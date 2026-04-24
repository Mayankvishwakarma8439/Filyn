"use server";

import { getCurrentUser } from "./users.actions";
import { getFiles } from "./files.actions";
import { askGeminiAboutFiles } from "../backend/gemini";
import type { BackendFile } from "../backend/types";

export const askFileAssistant = async (question: string) => {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion) throw new Error("Question is required");

  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("User not found");

  const files = await getFiles();
  const allFiles = (files.documents || []) as BackendFile[];

  const response = await askGeminiAboutFiles({
    question: trimmedQuestion,
    files: allFiles,
  });

  return JSON.parse(
    JSON.stringify({
      answer: response.answer,
      files: response.files.map((file) => ({
        $id: file.$id,
        name: file.name,
        url: file.url,
        type: file.type,
        extension: file.extension,
      })),
    })
  );
};
