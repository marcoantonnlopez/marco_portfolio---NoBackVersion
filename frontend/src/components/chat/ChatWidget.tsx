"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { useChatWidget } from "./ChatWidgetContext";

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

const SUGGESTED_QUESTIONS = [
  "¿Cuál es su experiencia profesional?",
  "Cuéntame sobre Studevs",
  "¿Qué tecnologías domina?",
  "¿Cómo puedo contactarlo?",
];

const GREETING: ChatMessage = {
  role: "model",
  text:
    "¡Hola! Soy el asistente de Marco. Puedo contarte sobre sus proyectos, experiencia, estudios y habilidades. ¿Qué te gustaría saber?",
};

export default function ChatWidget() {
  const { isOpen, close, toggle } = useChatWidget();
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, isOpen]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo obtener respuesta.");
      }

      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Algo salió mal. Intenta de nuevo en un momento."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={isOpen ? "Cerrar chat" : "Preguntarle a mi asistente"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full
                   bg-white text-black px-4 py-3 shadow-lg shadow-black/30
                   hover:scale-105 active:scale-95 transition-transform"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden sm:inline text-sm font-semibold">
          {isOpen ? "Cerrar" : "Pregúntale a mi asistente"}
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
                <p className="text-sm font-semibold text-white">Asistente de Marco</p>
                <p className="text-xs text-white/50">Responde con base en su portafolio</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Cerrar chat"
                className="rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-3.5 py-2 text-sm text-white/70">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Pensando...
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}

              {messages.length <= 1 && !loading && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5
                                 text-xs text-white/80 hover:bg-white/15 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2 border-t border-white/10 p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white
                           placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Enviar"
                className="rounded-full bg-white p-2 text-black transition
                           hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
