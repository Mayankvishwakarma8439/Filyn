"use client";

import { askFileAssistant } from "@/lib/actions/ai.actions";
import { cn } from "@/lib/utils";
import { Bot, Loader2, MessageSquareText, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

const quickPrompts = [
  "What’s in this contract?",
  "Show me files mentioning rent.",
  "Summarize my recent documents.",
];

const FileAssistant = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me about your files in plain language. I can help summarize, find, or explain what’s inside.",
    },
  ]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const canSend = useMemo(() => question.trim().length > 0, [question]);

  const sendQuestion = (value?: string) => {
    const prompt = (value ?? question).trim();
    if (!prompt) {
      setError("Type a question first.");
      return;
    }

    setError("");
    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", content: prompt },
      { role: "assistant", content: "Thinking..." },
    ]);
    setQuestion("");

    startTransition(async () => {
      try {
        const response = await askFileAssistant(prompt);
        setMessages((currentMessages) => {
          const nextMessages = [...currentMessages];
          const thinkingIndex = nextMessages.findLastIndex(
            (message) => message.role === "assistant" && message.content === "Thinking..."
          );
          if (thinkingIndex >= 0) {
            nextMessages[thinkingIndex] = {
              role: "assistant",
              content: response.answer,
            };
          }
          return nextMessages;
        });
      } catch (askError) {
        setMessages((currentMessages) => {
          const nextMessages = [...currentMessages];
          const thinkingIndex = nextMessages.findLastIndex(
            (message) => message.role === "assistant" && message.content === "Thinking..."
          );
          if (thinkingIndex >= 0) {
            nextMessages[thinkingIndex] = {
              role: "assistant",
              content:
                askError instanceof Error
                  ? askError.message
                  : "Something went wrong while asking your files.",
            };
          }
          return nextMessages;
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(244,63,94,0.28)] transition-transform hover:-translate-y-0.5 hover:bg-rose-600"
        >
          <MessageSquareText className="size-4" />
          Ask your files
        </button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "flex h-[84vh] max-h-[840px] w-[min(94vw,48rem)] flex-col gap-0 overflow-hidden border-rose-100 bg-white p-0 text-light-100 sm:rounded-[28px]"
        )}
      >
        <DialogHeader className="border-b border-rose-100 bg-gradient-to-r from-rose-50 to-white px-5 py-4 text-left">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-sm">
              <Bot className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-light-100">
                Ask your files
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm text-gray-500">
                Search, summarize, and ask questions in one place.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-rose-50/40 px-4 py-4">
          <div className="space-y-4">
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const isTyping = message.content === "Thinking...";

              return (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "flex",
                    isAssistant ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm",
                      isAssistant
                        ? "rounded-tl-md border border-rose-100 bg-white text-gray-700"
                        : "rounded-tr-md bg-rose-500 text-white"
                    )}
                  >
                    {isTyping ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="size-4 animate-spin" />
                        Searching your files...
                      </span>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              );
            })}

            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendQuestion(prompt)}
                  disabled={isPending}
                  className="rounded-full border border-rose-200 bg-white px-3 py-2 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="border-t border-rose-100 bg-white px-4 py-4">
          <div className="rounded-[24px] border border-gray-200 bg-gray-50 p-3 shadow-sm">
            <Textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about a contract, invoice, note, or anything in your library..."
              className="min-h-[88px] resize-none border-0 bg-transparent p-0 text-sm text-light-100 placeholder:text-gray-400 focus-visible:ring-0"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Sparkles className="size-4 text-rose-500" />
                Gemini will use your indexed file summaries and search text.
              </div>

              <div className="flex items-center gap-2">
                {error ? <p className="text-xs text-rose-500">{error}</p> : null}
                <Button
                  onClick={() => sendQuestion()}
                  disabled={!canSend || isPending}
                  className="rounded-full bg-rose-500 px-5 text-white hover:bg-rose-600"
                >
                  {isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : null}
                  {isPending ? "Sending..." : "Ask AI"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileAssistant;
