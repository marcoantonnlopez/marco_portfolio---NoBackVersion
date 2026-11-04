"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { useChatWidget } from "./ChatWidgetContext";

type ApiMessage = { role: "user" | "model"; text: string };

const SUGGESTED_QUESTIONS = [
  "What's his professional experience?",
  "Tell me about Studevs",
  "What technologies does he know?",
  "How can I contact him?",
];

const GREETING =
  "Hi, I'm Mark, Marco's AI assistant. I can tell you about his projects, experience, education, and skills. What would you like to know?";

const FALLBACK_ERROR = "Something went wrong. Please try again in a moment.";

/**
 * Bridges assistant-ui's runtime to the existing /api/chat endpoint, which
 * expects { messages: { role: "user" | "model", text: string }[] } and
 * returns { reply: string } (see src/app/api/chat/route.ts).
 */
const chatAdapter: ChatModelAdapter = {
  async run({ messages, abortSignal }) {
    const apiMessages: ApiMessage[] = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        role: (m.role === "assistant" ? "model" : "user") as ApiMessage["role"],
        text: m.content
          .filter(
            (p): p is { type: "text"; text: string } => p.type === "text"
          )
          .map((p) => p.text)
          .join("\n")
          .trim(),
      }))
      .filter((m) => m.text.length > 0);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortSignal,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return {
          content: [
            {
              type: "text",
              text:
                typeof data?.error === "string" ? data.error : FALLBACK_ERROR,
            },
          ],
        };
      }

      const data = await res.json();
      return { content: [{ type: "text", text: data.reply as string }] };
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") throw err;
      return { content: [{ type: "text", text: FALLBACK_ERROR }] };
    }
  },
};

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-start">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-white/10 px-3.5 py-2 text-sm leading-relaxed text-white">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end">
      <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-white px-3.5 py-2 text-sm leading-relaxed text-black">
        <MessagePrimitive.Content />
      </div>
    </MessagePrimitive.Root>
  );
}

function ChatThread() {
  return (
    <ThreadPrimitive.Root className="flex flex-1 flex-col overflow-hidden">
      <ThreadPrimitive.Viewport className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <ThreadPrimitive.Empty>
          <div className="flex justify-start">
            <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-white/10 px-3.5 py-2 text-sm leading-relaxed text-white">
              {GREETING}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-3">
            {SUGGESTED_QUESTIONS.map((q) => (
              <ThreadPrimitive.Suggestion
                key={q}
                prompt={q}
                send
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5
                           text-xs text-white/80 transition hover:bg-white/15"
              >
                {q}
              </ThreadPrimitive.Suggestion>
            ))}
          </div>
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages
          components={{ UserMessage, AssistantMessage }}
        />

        <ThreadPrimitive.If running>
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-white/10 px-3.5 py-2.5 text-sm text-white/70">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60" />
            </div>
          </div>
        </ThreadPrimitive.If>
      </ThreadPrimitive.Viewport>

      <ComposerPrimitive.Root className="flex items-center gap-2 border-t border-white/10 p-3">
        <ComposerPrimitive.Input
          placeholder="Ask Mark anything..."
          rows={1}
          className="flex-1 resize-none rounded-full bg-white/10 px-4 py-2 text-sm text-white
                     placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30"
        />
        <ComposerPrimitive.Send
          aria-label="Send"
          className="rounded-full bg-white p-2 text-black transition
                     hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
        >
          <Send className="h-4 w-4" />
        </ComposerPrimitive.Send>
      </ComposerPrimitive.Root>
    </ThreadPrimitive.Root>
  );
}

export default function ChatWidget() {
  const { isOpen, close, toggle } = useChatWidget();
  const runtime = useLocalRuntime(chatAdapter);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {/* Floating trigger button */}
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? "Close chat" : "Ask Mark, Marco's assistant"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full
                   bg-white text-black px-4 py-3 shadow-lg shadow-black/30
                   hover:scale-105 active:scale-95 transition-transform"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline text-sm font-semibold">
          {isOpen ? "Close" : "Ask Mark"}
        </span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-20 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-sm
                       flex-col overflow-hidden rounded-2xl border border-white/15
                       bg-[#171717] shadow-2xl shadow-black/50 sm:w-[380px]"
            style={{ height: "min(70vh, 560px)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">Mark</p>
                <p className="text-xs text-white/50">Marco's AI assistant</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ChatThread />
          </motion.div>
        )}
      </AnimatePresence>
    </AssistantRuntimeProvider>
  );
}
