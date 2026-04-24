import "server-only";

import { GoogleGenAI } from "@google/genai";
import type { BackendFile } from "./types";
import { updateFileAiMetadata } from "./db";

const MAX_INDEX_BYTES = 15 * 1024 * 1024;
const MODEL_CANDIDATES = Array.from(
  new Set(
    [
      process.env.GEMINI_MODEL,
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.0-flash-lite",
    ].filter(Boolean)
  )
);
const DEFAULT_MODEL = MODEL_CANDIDATES[0] || "gemini-2.5-flash-lite";

const client = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

const sanitizeJson = (text: string) => {
  const trimmed = text.trim();
  const withoutFence = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");
  return withoutFence;
};

const safeJsonParse = <T>(value: string): T | null => {
  try {
    return JSON.parse(sanitizeJson(value)) as T;
  } catch {
    return null;
  }
};

const extensionMimeMap: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  txt: "text/plain",
  md: "text/markdown",
  csv: "text/csv",
  html: "text/html",
  htm: "text/html",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  rtf: "application/rtf",
};

const getMimeType = (file: BackendFile) =>
  extensionMimeMap[file.extension.toLowerCase()] || "application/octet-stream";

const isIndexableFile = (file: BackendFile) =>
  ["document", "image"].includes(file.type);

const buildPrompt = (file: BackendFile) => `
You are extracting search-friendly knowledge from a user-uploaded file.
Return only JSON with this shape:
{
  "summary": string,
  "keywords": string[],
  "searchableText": string
}

Rules:
- Keep the summary concise but useful.
- keywords should include exact names, terms, dates, companies, amounts, and topics.
- searchableText should contain the important extracted text or key phrases that would help a future search like "rent", "invoice", or "contract".
- If the file is a contract, include obligations, parties, dates, and payment terms when present.
- Do not add markdown or code fences.
- File name: ${file.name}
- File type: ${file.type}
- Extension: ${file.extension}
`;

const isTransientGeminiError = (error: unknown) => {
  const message =
    error instanceof Error ? error.message : JSON.stringify(error || {});
  return (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("UNAVAILABLE") ||
    message.includes("RESOURCE_EXHAUSTED") ||
    message.toLowerCase().includes("high demand") ||
    message.toLowerCase().includes("rate limit") ||
    message.toLowerCase().includes("temporarily")
  );
};

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const indexFileWithGemini = async (
  file: BackendFile,
  sourceBytes: Buffer,
  mimeType?: string
) => {
  const ai = client();
  if (!ai || !isIndexableFile(file)) return null;
  if (Number(file.size) > MAX_INDEX_BYTES) return null;

  const encoded = sourceBytes.toString("base64");
  const resolvedMimeType =
    mimeType && mimeType.length > 0 ? mimeType : getMimeType(file);
  let lastError: unknown = null;

  for (const model of MODEL_CANDIDATES) {
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const currentModel = model ?? DEFAULT_MODEL;
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: [
            {
              inlineData: {
                mimeType: resolvedMimeType,
                data: encoded,
              },
            },
            { text: buildPrompt(file) },
          ],
        });

        const parsed = safeJsonParse<{
          summary?: string;
          keywords?: string[];
          searchableText?: string;
        }>(response.text || "");

        if (!parsed?.summary || !parsed?.searchableText) {
          throw new Error(`Gemini returned unusable output for ${file.name}`);
        }

        const keywords = Array.isArray(parsed.keywords)
          ? parsed.keywords.map((keyword) => String(keyword).trim()).filter(Boolean)
          : [];

        return {
          aiSummary: parsed.summary.trim(),
          aiSearchText: parsed.searchableText.trim().slice(0, 10000),
          aiKeywords: keywords.slice(0, 20),
          aiProcessedAt: new Date().toISOString(),
        };
      } catch (error) {
        lastError = error;
        if (!isTransientGeminiError(error)) break;
        if (attempt < 3) await sleep(500 * attempt * attempt);
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Gemini indexing failed");
};

export const indexUploadedFile = async (
  file: BackendFile,
  sourceBytes: Buffer,
  mimeType?: string
) => {
  try {
    const aiData = await indexFileWithGemini(file, sourceBytes, mimeType);
    if (!aiData) return file;

    const updatedFile = await updateFileAiMetadata({
      fileId: file.$id,
      aiSummary: aiData.aiSummary,
      aiSearchText: aiData.aiSearchText,
      aiKeywords: aiData.aiKeywords,
      aiProcessedAt: aiData.aiProcessedAt,
      aiIndexStatus: "ready",
      aiIndexError: null,
    });

    return updatedFile || file;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log("Failed to index file with Gemini", error);
    await updateFileAiMetadata({
      fileId: file.$id,
      aiSummary: file.aiSummary || "",
      aiSearchText: file.aiSearchText || "",
      aiKeywords: file.aiKeywords || [],
      aiProcessedAt: file.aiProcessedAt || new Date().toISOString(),
      aiIndexStatus: "failed",
      aiIndexError: errorMessage.slice(0, 1000),
      aiIndexAttempts: (file.aiIndexAttempts || 0) + 1,
      aiLastIndexedAt: new Date().toISOString(),
    }).catch(() => null);
    return file;
  }
};

const tokenise = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .map((token) => token.trim())
    .filter((token) => token.length > 2);

const scoreFile = (file: BackendFile, tokens: string[]) => {
  const haystack = [
    file.name,
    file.type,
    file.extension,
    file.aiSummary || "",
    file.aiSearchText || "",
    ...(file.aiKeywords || []),
  ]
    .join(" ")
    .toLowerCase();

  return tokens.reduce((score, token) => {
    if (!token) return score;
    if (haystack.includes(token)) return score + 1;
    return score;
  }, 0);
};

export const prepareFileAssistantContext = (
  question: string,
  files: BackendFile[],
) => {
  const tokens = tokenise(question);
  const rankedFiles = [...files]
    .map((file) => ({ file, score: scoreFile(file, tokens) }))
    .sort((left, right) => right.score - left.score)
    .filter(({ score }) => score > 0)
    .slice(0, 6)
    .map(({ file }) => file);

  const fallbackFiles =
    rankedFiles.length > 0 ? rankedFiles : files.slice(0, 6);

  const context = fallbackFiles
    .map(
      (file, index) => `
File ${index + 1}
Name: ${file.name}
Type: ${file.type}
Extension: ${file.extension}
Uploaded: ${file.$createdAt}
Summary: ${file.aiSummary || "No AI summary yet."}
Keywords: ${(file.aiKeywords || []).join(", ") || "None"}
Search text: ${(file.aiSearchText || "").slice(0, 1500) || "No extracted search text yet."}
`,
    )
    .join("\n");

  return { rankedFiles: fallbackFiles, context };
};

export const askGeminiAboutFiles = async ({
  question,
  files,
}: {
  question: string;
  files: BackendFile[];
}) => {
  const ai = client();
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const { rankedFiles, context } = prepareFileAssistantContext(question, files);
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,
      contents: `
You answer questions about a user's private file library.
Only use the file context below.
If the answer is not supported by the context, say so clearly.
When asked to find files, list the filenames that match.
Keep the answer concise and practical.

Question:
${question}

File context:
${context}
`,
    });

    return {
      answer:
        response.text?.trim() ||
        "I couldn’t generate an answer for that question right now.",
      files: rankedFiles,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Gemini is temporarily unavailable.";
    const isUnavailable =
      message.includes("503") ||
      message.includes("UNAVAILABLE") ||
      message.toLowerCase().includes("high demand");

    if (isUnavailable) {
      return {
        answer:
          "The AI is temporarily busy right now. Please try again in a moment, or ask me again later and I’ll re-run the search.",
        files: rankedFiles,
      };
    }

    throw error;
  }
};
