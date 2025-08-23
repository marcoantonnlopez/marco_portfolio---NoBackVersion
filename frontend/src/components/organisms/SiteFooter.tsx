"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowRight,
  ArrowUpRight,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  Copy,
  ChevronUp,
} from "lucide-react";

// ---------- Types ----------
export type SocialPlatform = "github" | "linkedin" | "instagram" | "youtube" | "email";

export interface SocialLink {
  platform: SocialPlatform;
  href: string; // for email use `mailto:` or plain address (we normalize)
  label?: string; // accessible label override
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface SiteFooterProps {
  title?: string; // main title in footer
  tagline?: string; // short one-liner under the title
  columns?: FooterColumn[]; // navigation columns
  social?: SocialLink[]; // social icons
  email?: string; // used in CTA and copy button
  calloutTitle?: string; // big CTA card title
  calloutCopy?: string; // big CTA card text
  calloutHref?: string; // link for CTA button
  calloutCtaLabel?: string; // CTA button label
  showBackToTop?: boolean;
  className?: string;
}

// ---------- Defaults (safe fallbacks) ----------
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "marcoantoniolopez.dev@gmail.com";
const DEFAULT_SOCIAL: SocialLink[] = [
  { platform: "github", href: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/marcoantonnlopez" },
  { platform: "linkedin", href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/marco-antonn/" },
  { platform: "instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/marco_antonn/" },
  { platform: "youtube", href: process.env.NEXT_PUBLIC_YOUTUBE_URL || "https://www.youtube.com/@marco_antonn" },
  { platform: "email", href: CONTACT_EMAIL },
];

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    heading: "Explore",
    links: [
      { label: "Leadership", href: "/section?type=leader" },
      { label: "Development", href: "/section?type=dev" },
      { label: "Design", href: "/section?type=designer" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about-me" },
      { label: "Contact", href: "/contact" },
      { label: "Résumé", href: process.env.NEXT_PUBLIC_RESUME_URL || "/resume.pdf", external: true },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "GitHub", href: DEFAULT_SOCIAL[0].href, external: true },
      { label: "LinkedIn", href: DEFAULT_SOCIAL[1].href, external: true },
      { label: "YouTube", href: DEFAULT_SOCIAL[3].href, external: true },
    ],
  },
];

const iconFor = (p: SocialPlatform) => {
  switch (p) {
    case "github":
      return Github;
    case "linkedin":
      return Linkedin;
    case "instagram":
      return Instagram;
    case "youtube":
      return Youtube;
    case "email":
      return Mail;
  }
};

// ---------- Component ----------
export default function SiteFooter({
  title = "Let’s build something people want.",
  tagline = "Founder energy meets product sense. Ready when you are.",
  columns = DEFAULT_COLUMNS,
  social = DEFAULT_SOCIAL,
  email = CONTACT_EMAIL,
  calloutTitle = "Have a high-leverage project?",
  calloutCopy = "I design, ship and iterate fast — from zero to launch.",
  calloutHref = "/contact",
  calloutCtaLabel = "Contact me",
  showBackToTop = true,
  className,
}: SiteFooterProps) {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [copied, setCopied] = useState(false);

  const normalizedEmailHref = useMemo(() => {
    const href = email.includes("mailto:") ? email : `mailto:${email}`;
    return href;
  }, [email]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <footer className={`relative isolate bg-black text-white ${className ?? ""}`}>
      {/* Top gradient border */}
      <div className="h-px w-full bg-gradient-to-r from-fuchsia-500/40 via-white/20 to-indigo-500/40" />

      {/* CTA card */}
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="relative -translate-y-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 md:p-8 backdrop-blur"
        >
          <div className="grid gap-4 sm:gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
            <div className="min-w-0">
              <h3
                className="font-extrabold tracking-tight leading-tight"
                style={{ fontSize: "clamp(1.25rem, 3.2vw, 2rem)" }}
              >
                {calloutTitle}
              </h3>
              <p className="mt-2 text-white/80">{calloutCopy}</p>
            </div>

            {/* CTA actions: responsive & no overflow */}
            <div className="min-w-0 flex flex-col xs:flex-row gap-2 sm:gap-3 xs:justify-end">
              <Link
                href={calloutHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                {calloutCtaLabel} <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>

              <a
                href={normalizedEmailHref}
                title={email}
                className="inline-flex min-w-0 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate max-w-[60vw] xs:max-w-[40vw] sm:max-w-[18rem]">{email}</span>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Copy className="h-4 w-4 shrink-0" /> {copied ? "Copied!" : "Copy email"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-6xl px-4 pb-14">
        {/* Desktop / Tablet (md+) */}
        <div className="hidden md:grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <h4
              className="font-extrabold tracking-tight leading-tight"
              style={{ fontSize: "clamp(1.5rem, 3.2vw, 2.2rem)" }}
            >
              {title}
            </h4>
            <p className="mt-2 text-white/70 max-w-sm">{tagline}</p>

            {/* Social */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {social.map((s, i) => {
                const Icon = iconFor(s.platform);
                const href = s.platform === "email" ? normalizedEmailHref : s.href;
                const isExternal = s.platform !== "email";
                const label = s.label ?? s.platform;
                return (
                  <a
                    key={`${s.platform}-${i}`}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    aria-label={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <Icon className="h-4 w-4" /> <span className="capitalize">{label}</span>
                    {isExternal && <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columns */}
          {columns.map((col, idx) => (
            <nav key={col.heading + idx} aria-label={col.heading}>
              <div className="text-white/90 font-semibold mb-3">{col.heading}</div>
              <ul className="space-y-2 text-white/70">
                {col.links.map((l, i) => (
                  <li key={l.label + i}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-white">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="hover:text-white">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Mobile (md-) — acordeones */}
        <div className="md:hidden">
          {/* Brand + Social arriba para escanear rápido */}
          <div>
            <h4
              className="font-extrabold tracking-tight leading-tight"
              style={{ fontSize: "clamp(1.25rem, 5vw, 1.75rem)" }}
            >
              {title}
            </h4>
            <p className="mt-2 text-white/70">{tagline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              {social.map((s, i) => {
                const Icon = iconFor(s.platform);
                const href = s.platform === "email" ? normalizedEmailHref : s.href;
                const isExternal = s.platform !== "email";
                const label = s.label ?? s.platform;
                return (
                  <a
                    key={`${s.platform}-m-${i}`}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    aria-label={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <Icon className="h-4 w-4" /> <span className="capitalize">{label}</span>
                    {isExternal && <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Acordeones por columna */}
          <div className="mt-6 divide-y divide-white/10 rounded-xl border border-white/10">
            {columns.map((col, idx) => (
              <details key={`m-${col.heading}-${idx}`} className="group">
                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-white/90">
                  <span className="font-semibold">{col.heading}</span>
                  <svg
                    className="h-4 w-4 transition group-open:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.152l3.71-2.92a.75.75 0 1 1 .94 1.172l-4.2 3.306a.75.75 0 0 1-.94 0l-4.2-3.306a.75.75 0 0 1-.02-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <ul className="px-4 pb-3 pt-0 space-y-2 text-white/70">
                  {col.links.map((l, i) => (
                    <li key={`m-${l.label}-${i}`}>
                      {l.external ? (
                        <a href={l.href} target="_blank" rel="noreferrer" className="hover:text-white">
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className="hover:text-white">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 flex flex-wrap gap-3 sm:flex-nowrap sm:items-center sm:justify-between text-sm text-white/60">
          <div className="min-w-0">
            © {year} · Built with love in Mexico · UTC-6
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link href="/contact" className="hover:text-white">Contact</Link>
            <a href={normalizedEmailHref} className="hover:text-white">Email</a>
            {showBackToTop && (
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-white/80 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <ChevronUp className="h-4 w-4" /> Top
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
