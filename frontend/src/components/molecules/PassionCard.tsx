// src/components/molecules/PassionCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getCounts } from "@/lib/projects-loader";

export interface PassionCardProps {
  title: string;
  /** e.g., "4 projects" — si no se provee, la card lo calculará sola por área */
  meta?: string;
  /** optional subline under meta if you still want it */
  subtitle?: string;
  /** short paragraph shown above tags */
  description?: string;
  imgSrc: string;
  href: string;
  /** small badge aligned to the top-right */
  chip?: string;
  /** chips rendered at the bottom area */
  tags?: string[];
  /** CTA text */
  ctaLabel?: string;
  /** pass true for above-the-fold images */
  priority?: boolean;
}

type Area = "liderazgo" | "desarrollo" | "diseno";

function inferAreaFromHrefOrTitle(href: string, title: string): Area | null {
  const h = href.toLowerCase();
  if (h.includes("type=leader")) return "liderazgo";
  if (h.includes("type=dev")) return "desarrollo";
  if (h.includes("type=designer") || h.includes("type=design")) return "diseno";

  const t = title.toLowerCase();
  if (t.includes("leader")) return "liderazgo";
  if (t.includes("developer") || t.includes("engineer") || t.includes("dev")) return "desarrollo";
  if (t.includes("designer") || t.includes("design")) return "diseno";

  return null;
}

export function PassionCard({
  title,
  meta,
  subtitle,
  description,
  imgSrc,
  href,
  chip,
  tags = [],
  ctaLabel = "See projects",
  priority = false,
}: PassionCardProps) {
  const [autoMeta, setAutoMeta] = useState<string | undefined>(undefined);

  // Si no nos pasan `meta`, calcularla automáticamente por área.
  useEffect(() => {
    let cancelled = false;
    if (meta) {
      setAutoMeta(undefined);
      return;
    }
    const area = inferAreaFromHrefOrTitle(href, title);
    if (!area) {
      setAutoMeta(undefined);
      return;
    }
    (async () => {
      try {
        const counts = await getCounts(); // lee /public/data/* usando el loader
        let n = 0;
        if (area === "liderazgo") n = counts.leader;
        else if (area === "desarrollo") n = counts.dev;
        else if (area === "diseno") n = counts.design;

        if (!cancelled) {
          setAutoMeta(`${n} project${n === 1 ? "" : "s"}`);
        }
      } catch {
        if (!cancelled) setAutoMeta(undefined);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [href, title, meta]);

  const metaText = meta ?? autoMeta;

  return (
    <Link href={href} aria-label={`Open ${title}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-2xl h-0 pb-[125%] shadow-2xl ring-1 ring-white/10 bg-black/20"
      >
        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={imgSrc}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover will-change-transform transition duration-700 ease-out group-hover:scale-[1.06] group-hover:rotate-[0.3deg]"
          />
          {/* Top & bottom gradients to guarantee text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/35 to-black/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-5 md:p-6 flex flex-col">
          {/* TOP: Title + meta at the top-left, chip at top-right */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3
                className="text-white font-extrabold tracking-tight leading-tight"
                style={{ fontSize: "clamp(1.7rem, 5.4vw, 2.7rem)" }}
              >
                {title}
              </h3>
              {metaText && (
                <div className="text-white/90 text-lg font-semibold">{metaText}</div>
              )}
              {subtitle && (
                <p className="text-white/85 text-sm md:text-[15px]">{subtitle}</p>
              )}
            </div>

            {/* {chip && (
              <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90 ring-1 ring-white/20 backdrop-blur">
                {chip}
              </span>
            )} */}
          </div>

          {/* BOTTOM: description, tags, CTA */}
          <div className="mt-auto">
            {description && (
              <p className="text-white/90 text-[13px] md:text-sm line-clamp-3">
                {description}
              </p>
            )}

            {tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tags.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="inline-flex items-center rounded-full bg-white/15 px-2 py-1 text-[11px] text-white ring-1 ring-white/20"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white transition group-hover:bg-white group-hover:text-black">
                {ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Focus ring */}
        <span className="absolute inset-0 rounded-2xl ring-0 ring-white/0 focus-within:ring-4 focus-within:ring-white/40" />
      </motion.article>
    </Link>
  );
}
