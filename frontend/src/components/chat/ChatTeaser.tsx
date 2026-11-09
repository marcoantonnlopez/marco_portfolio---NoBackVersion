"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useChatWidget } from "./ChatWidgetContext";

// Purple → blue, same family as the page's ambient glows (fuchsia-500 / indigo-500).
const GLOW_FILL =
  "radial-gradient(420px circle at var(--mx) var(--my), rgba(217,70,239,0.22), rgba(99,102,241,0.14) 40%, transparent 70%)";
const GLOW_EDGE =
  "radial-gradient(260px circle at var(--mx) var(--my), rgba(217,70,239,0.9), rgba(99,102,241,0.6) 45%, transparent 75%)";

export default function ChatTeaser() {
  const { open } = useChatWidget();
  const cardRef = useRef<HTMLDivElement>(null);

  // Track the pointer with CSS variables (no React re-render per mouse move).
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section className="relative z-10 flex min-h-[40svh] items-center bg-black px-4 py-14">
      <motion.div
        ref={cardRef}
        onPointerMove={onMove}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
        className="group relative mx-auto w-full max-w-3xl rounded-2xl bg-white/10 p-px"
      >
        {/* Edge light that follows the pointer */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: GLOW_EDGE }}
        />

        <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-[15px] bg-[#0c0c10] px-6 py-8 text-center sm:flex-row sm:text-left">
          {/* Soft fill glow that follows the pointer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: GLOW_FILL }}
          />

          <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="relative flex-1">
            <h3 className="text-lg font-semibold text-white">Got questions about what I&apos;ve built?</h3>
            <p className="mt-1 text-sm text-white/60">
              Ask Mark, my AI assistant, about my projects, experience, or skills.
            </p>
          </div>

          {/* Same style as the "Explore my passion." card buttons */}
          <button
            type="button"
            onClick={open}
            className="group/btn relative inline-flex flex-shrink-0 items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white transition hover:bg-white hover:text-black"
          >
            Ask now
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
