// src/components/molecules/TrustItem.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import React from "react";

export interface TrustItemProps {
  logoSrc: string;
  logoAlt: string;
  title: string;
  subtitle?: string;
  description: string;
  link: string;
  /** opcional: chip arriba a la derecha (e.g. "Press", "Award") */
  badge?: string;
  /** opcional: tags debajo del texto (e.g. ["YC alum", "Featured"]) */
  tags?: string[];
}

export function TrustItem({
  logoSrc,
  logoAlt,
  title,
  subtitle,
  description,
  link,
  badge,
  tags = [],
}: TrustItemProps) {
  return (
    // ✅ Opción A: este componente ya NO devuelve <li>, sino <motion.div>
    <motion.div
      initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visitar ${title}`}
        className="
          group grid grid-cols-1 sm:grid-cols-[auto_1px_1fr] items-center sm:items-start gap-y-4 sm:gap-y-0 sm:gap-x-6
          rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 md:p-5
          hover:bg-white/10 hover:ring-white/20 transition
          focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30
        "
      >
        {/* Logo */}
        <div className="relative w-full sm:w-auto flex items-center justify-start sm:justify-center">
          <div className="relative h-14 w-14 shrink-0 rounded-xl bg-black/30 ring-1 ring-white/10 overflow-hidden">
            <Image
              src={logoSrc}
              alt={logoAlt || title}
              fill
              sizes="56px"
              className="object-contain p-2"
            />
          </div>
          {/* Badge arriba derecha en sm+ */}
          {badge && (
            <span className="ml-3 sm:ml-0 sm:absolute sm:-top-2 sm:-right-2 inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/90 ring-1 ring-white/20">
              {badge}
            </span>
          )}
        </div>

        {/* Divisor */}
        <div className="hidden sm:block w-px bg-white/15 h-12 my-auto" />

        {/* Texto */}
        <div className="w-full">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-white font-semibold leading-tight">{title}</h3>
              {subtitle && (
                <p className="text-white/70 text-sm mt-0.5">{subtitle}</p>
              )}
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-white/70 group-hover:text-white">
              Visit{" "}
              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>

          <p className="text-white/90 text-sm mt-2">{description}</p>

          {tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="inline-flex items-center rounded-full bg-white/12 px-2 py-1 text-[11px] text-white ring-1 ring-white/15"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* CTA móvil */}
          <span className="mt-3 inline-flex sm:hidden items-center gap-1 text-sm text-white/80 group-hover:text-white">
            Visit{" "}
            <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
