"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CONTACT = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "marcoantoniolopez.dev@gmail.com",
  calendly: process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/marcoantoniolopez-dev",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com/in/marco-antonn/",
  github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/marcoantonnlopez",
  resume: process.env.NEXT_PUBLIC_RESUME_URL || "",
};

const pageFade = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6 } },
};

const cardRise = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const Chip = ({
  selected,
  label,
  onToggle,
}: {
  selected: boolean;
  label: string;
  onToggle: () => void;
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onToggle}
    className={
      "px-3 py-1.5 rounded-full text-sm border transition " +
      (selected
        ? "bg-white text-black border-white"
        : "bg-white/10 text-white border-white/20 hover:bg-white/20")
    }
  >
    {label}
  </button>
);

const Icon = {
  Mail: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 6h16v12H4z" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  ),
  Calendar: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  ),
  External: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M14 3h7v7" />
      <path d="M10 14 21 3" />
      <path d="M21 14v7h-7" />
      <path d="M3 10v11h11" />
    </svg>
  ),
  Copy: (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <rect x="2" y="2" width="13" height="13" rx="2" />
    </svg>
  ),
};

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // form state (controlled, no extra libs)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [budget, setBudget] = useState("< $2k");
  const [timeframe, setTimeframe] = useState("ASAP");
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [honeypot, setHoneypot] = useState("");

  const chips = useMemo(
    () => [
      "MVP / Prototype",
      "Web App (Next.js)",
      "API / Backend",
      "Data / ML",
      "UI Design",
      "Performance / Infra",
    ],
    []
  );

  const budgets = ["< $2k", "$2k–$5k", "$5k–$10k", "$10k+", "Hiring full‑time"];
  const timeframes = ["ASAP", "2–4 weeks", "This quarter", "Exploring"];

  const toggleType = (label: string) => {
    setProjectTypes((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot caught

    // light validation
    if (!name || !email || !message) {
      alert("Please fill name, email and message.");
      return;
    }

    setLoading(true);

    const subject = `Intro — ${name}${company ? ` / ${company}` : ""}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : "",
      `Project types: ${projectTypes.join(", ") || "(not specified)"}`,
      `Budget: ${budget}`,
      `Timeframe: ${timeframe}`,
      "",
      message,
    ].filter(Boolean);

    const mailto = `mailto:${encodeURIComponent(CONTACT.email)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    // Fallback-only approach: open user's email client
    window.location.href = mailto;

    // fake a quick UX feedback
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <motion.main
      variants={pageFade}
      initial="hidden"
      animate="show"
      className="relative min-h-screen bg-[#121212] text-white"
    >
      {/* Background gradient / accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      <section className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-10">
        <motion.div variants={cardRise} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight pt-16">
            Let’s build something people want.
          </h1>
          <p className="mt-4 text-gray-300">
            I design, ship and iterate fast — from zero to launch. If you’re hiring or
            need a hands‑on builder for a key project, reach out.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${CONTACT.email}`}
              className="group inline-flex items-center gap-2 rounded-full border border-white bg-white px-4 py-2 text-black hover:shadow-lg hover:-translate-y-0.5 transition"
            >
              <Icon.Mail className="h-4 w-4" /> Email me
            </a>
            {CONTACT.calendly && (
              <a
                href={CONTACT.calendly}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 hover:bg-white/20 transition"
              >
                <Icon.Calendar className="h-4 w-4" /> Book 15‑min call
                <Icon.External className="h-3.5 w-3.5 opacity-70" />
              </a>
            )}
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 hover:bg-white/20 transition"
            >
              <Icon.Copy className="h-4 w-4" /> {copied ? "Copied!" : CONTACT.email}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-5 text-sm text-white/70">
            <span>Remote‑first</span>
            <span className="inline-block h-1 w-1 rounded-full bg-white/40" />
            <span>UTC‑6 (CDMX)</span>
            <span className="inline-block h-1 w-1 rounded-full bg-white/40" />
            <span>Spanish / English</span>
          </div>
        </motion.div>
      </section>

      {/* Grid: left value / right form */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: value + links */}
          <motion.aside variants={cardRise} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Where I add the most value</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-300">
              <li>• Turning ambiguous ideas into scoped, testable MVPs.</li>
              <li>• Full‑stack shipping: Next.js, Node, data, infra basics.</li>
              <li>• Product sense: prioritize the 20% that moves 80%.</li>
              <li>• Design systems that stay beautiful under pressure.</li>
            </ul>

            <div className="mt-6 h-px w-full bg-white/10" />

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
              >
                <div className="font-medium">LinkedIn</div>
                <div className="text-white/70 truncate">{CONTACT.linkedin}</div>
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
              >
                <div className="font-medium">GitHub</div>
                <div className="text-white/70 truncate">{CONTACT.github}</div>
              </a>
              {CONTACT.resume && (
                <a
                  href={CONTACT.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition col-span-2"
                >
                  <div className="font-medium">Résumé / CV</div>
                  <div className="text-white/70 truncate">{CONTACT.resume}</div>
                </a>
              )}
            </div>

            <p className="mt-6 text-xs text-white/60">
              Prefer email? Use the button above, or the form — both land in the same inbox.
            </p>
          </motion.aside>

          {/* Right: form */}
          <motion.div variants={cardRise} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm text-white/80">Name *</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Ada Lovelace"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-white/80">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="marcoantoniolopez.dev@gmail.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="company" className="block text-sm text-white/80">Company (optional)</label>
                  <input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Turing Labs"
                  />
                </div>
              </div>

              <div>
                <div className="block text-sm text-white/80">Project type</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {chips.map((c) => (
                    <Chip key={c} label={c} selected={projectTypes.includes(c)} onToggle={() => toggleType(c)} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget" className="block text-sm text-white/80">Budget</label>
                  <select
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
                  >
                    {budgets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="timeframe" className="block text-sm text-white/80">Timeframe</label>
                  <select
                    id="timeframe"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
                  >
                    {timeframes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-white/80">Message *</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="A few lines about your goals, constraints and success criteria."
                />
              </div>

              {/* honeypot */}
              <div className="hidden" aria-hidden>
                <label>Leave this field empty</label>
                <input value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl border border-white bg-white px-4 py-2 text-black hover:shadow-lg hover:-translate-y-0.5 transition disabled:opacity-60"
                >
                  {loading ? "Opening your email app…" : "Send message"}
                </button>
                {CONTACT.calendly && (
                  <a
                    href={CONTACT.calendly}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 hover:bg-white/20 transition"
                  >
                    Or book a call <Icon.External className="h-3.5 w-3.5 opacity-70" />
                  </a>
                )}
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </motion.main>
  );
}
