// src/components/molecules/TrustItemGrouped.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import React from "react";

/** One role within a company that had multiple roles (LinkedIn-style). */
export interface TrustRoleProps {
  title: string;
  /** e.g. "Jul 2026 - Oct 2026 · 4 mos" */
  dateRange: string;
  description?: string;
}

export interface TrustGroupProps {
  logoSrc: string;
  logoAlt: string;
  company: string;
  /** e.g. "Full-time · 8 mos" */
  companyMeta?: string;
  location?: string;
  link: string;
  /** Roles in reverse-chronological order (most recent first). */
  roles: TrustRoleProps[];
}

export function TrustItemGrouped({
  logoSrc,
  logoAlt,
  company,
  companyMeta,
  location,
  link,
  roles,
}: TrustGroupProps) {
  return (
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
        aria-label={`Visit ${company}`}
        className="
          group block rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 md:p-5
          hover:bg-white/10 hover:ring-white/20 transition
          focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30
        "
      >
        {/* Company header */}
        <div className="flex items-start gap-4">
          <div className="relative h-14 w-14 shrink-0 rounded-xl bg-black/30 ring-1 ring-white/10 overflow-hidden">
            <Image
              src={logoSrc}
              alt={logoAlt || company}
              fill
              sizes="56px"
              className="object-contain p-2"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-white font-semibold leading-tight">{company}</h3>
              <span className="hidden shrink-0 items-center gap-1 text-xs text-white/70 group-hover:text-white sm:inline-flex">
                Visit{" "}
                <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
            {companyMeta && <p className="mt-0.5 text-sm text-white/70">{companyMeta}</p>}
            {location && <p className="mt-0.5 text-xs text-white/50">{location}</p>}
          </div>
        </div>

        {/* Roles timeline */}
        <div className="mt-4 pl-1">
          {roles.map((role, i) => {
            const isLast = i === roles.length - 1;
            return (
              <div key={role.title} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-white/50" />
                  {!isLast && <span className="mt-1 w-px flex-1 bg-white/15" />}
                </div>
                <div className={isLast ? "flex-1" : "flex-1 pb-4"}>
                  <h4 className="text-sm font-medium leading-tight text-white">
                    {role.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-white/50">{role.dateRange}</p>
                  {role.description && (
                    <p className="mt-1.5 text-sm text-white/85">{role.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <span className="mt-3 inline-flex items-center gap-1 text-sm text-white/80 group-hover:text-white sm:hidden">
          Visit{" "}
          <ExternalLink className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.div>
  );
}
