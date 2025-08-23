// frontend/src/components/organisms/ContentCarousel.tsx
"use client";

import { useRef } from "react";
import { motion, easeOut } from "framer-motion";
import ContentCard from "@/components/molecules/ContentCard";
import type { UIContenido } from "@/lib/projects-loader";

type Props = {
  items: UIContenido[];
  title?: string;
};

export default function ContentCarousel({ items, title = "Here's more about this project" }: Props) {
  if (!items?.length) return null;

  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: "left" | "right") => {
    const el = scroller.current;
    if (!el) return;
    const delta = Math.round(el.clientWidth * 0.9) * (dir === "left" ? -1 : 1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
        {title}
      </h2>

      <div className="relative">
        {/* Flechas */}
        <button
          onClick={() => scrollBy("left")}
          aria-label="Previous"
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-white/20 bg-[#121212]/70 backdrop-blur hover:bg-[#1b1b1b] items-center justify-center"
        >
          ‹
        </button>
        <button
          onClick={() => scrollBy("right")}
          aria-label="Next"
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-white/20 bg-[#121212]/70 backdrop-blur hover:bg-[#1b1b1b] items-center justify-center"
        >
          ›
        </button>

        {/* Carrusel */}
        <motion.div
          ref={scroller}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 hide-scrollbar"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          {items.map((it) => (
            <div
              key={it.id}
              className="snap-start shrink-0 w-[85vw] sm:w-[560px] md:w-[680px] lg:w-[720px]"
            >
              <ContentCard item={it} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
