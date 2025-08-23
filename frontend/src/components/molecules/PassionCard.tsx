"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface PassionCardProps {
  title: string;
  /** e.g., "4 projects" */
  meta?: string;
  /** optional subline under meta if you still want it */
  subtitle?: string;
  /** short paragraph shown above tags */
  description?: string;
  imgSrc: string;
  href: string;
  /** small badge aligned to the top‑right */
  chip?: string;
  /** chips rendered at the bottom area */
  tags?: string[];
  /** CTA text */
  ctaLabel?: string;
  /** pass true for above‑the‑fold images */
  priority?: boolean;
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
              {meta && (
                <div className="text-white/90 text-lg font-semibold">{meta}</div>
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
