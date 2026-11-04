"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useChatWidget } from "./ChatWidgetContext";

export default function ChatTeaser() {
  const { open } = useChatWidget();

  return (
    <section className="relative z-10 bg-black px-4 pb-14">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl
                   border border-white/10 bg-white/5 px-6 py-8 text-center sm:flex-row sm:text-left"
      >
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">
            Got questions about what I&apos;ve built?
          </h3>
          <p className="mt-1 text-sm text-white/60">
            Ask Mark, my AI assistant, about my projects, experience, or skills.
          </p>
        </div>
        <button
          type="button"
          onClick={open}
          className="flex-shrink-0 rounded-full border border-white bg-white px-5 py-2.5
                     text-sm font-medium text-black transition hover:bg-transparent hover:text-white"
        >
          Ask now
        </button>
      </motion.div>
    </section>
  );
}
