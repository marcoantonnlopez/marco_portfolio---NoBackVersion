// frontend/src/components/organisms/HeroCarousel.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, Github, Linkedin, Play, Download } from "lucide-react";

// === Slides ===
const slides = [
  {
    src: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/1_main.svg",
    alt: "Skyline portrait",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/3_stepMarch.svg",
    alt: "Step March",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/2_riverdalePark.svg",
    alt: "Riverdale Park meetup",
  },
];

const ROLES = ["Leader", "Engineer", "Designer"];

// Social links (fallbacks)
const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/marcoantonnlopez";
const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/marco-antonn/";
const RESUME_URL = process.env.NEXT_PUBLIC_RESUME_URL ?? "";
const DEFAULT_RESUME = "/resume.pdf";
const RESUME_HREF = RESUME_URL && RESUME_URL.trim().length > 0 ? RESUME_URL : DEFAULT_RESUME;

/* ================= Helpers de clasificación ================= */

const toLowerNoAccents = (v: any) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function getMainTag(p: any): string {
  return toLowerNoAccents(p?.type ?? p?.area ?? p?.category ?? p?.categoria ?? "");
}

function hasAnyTag(p: any, regex: RegExp): boolean {
  return Array.isArray(p?.tags) && p.tags.some((t: any) => regex.test(toLowerNoAccents(t)));
}

function hasArea(p: any, target: "liderazgo" | "desarrollo" | "diseno"): boolean {
  if (!Array.isArray(p?.areas)) return false;
  const normalized = p.areas.map(toLowerNoAccents);
  const syn: Record<typeof target, string[]> = {
    liderazgo: ["liderazgo", "lider", "lideres", "liderar", "leader", "leadership", "líder"],
    desarrollo: ["desarrollo", "dev", "development", "software", "backend", "frontend", "fullstack", "web"],
    diseno: ["diseno", "diseño", "design", "ui", "ux", "product design"],
  } as const;
  const wanted = syn[target];
  return normalized.some((a) => wanted.some((w) => a.includes(w)));
}

function isLeaderProject(p: any): boolean {
  if (hasArea(p, "liderazgo")) return true;
  const tag = getMainTag(p);
  const tagged =
    tag.includes("leader") ||
    tag.includes("leadership") ||
    tag.includes("lider") ||
    tag.includes("liderazgo") ||
    tag.includes("community") ||
    tag.includes("organizer") ||
    tag.includes("founder") ||
    tag.includes("volunteer") ||
    tag.includes("mentorship") ||
    tag.includes("club") ||
    tag.includes("team lead") ||
    tag.includes("president") ||
    tag.includes("coordinator");

  const inTags = hasAnyTag(
    p,
    /leader|leadership|lider|liderazgo|community|organizer|founder|volunteer|mentorship|club|team lead|president|coordinator/
  );
  return tagged || inTags;
}

function isDevProject(p: any): boolean {
  if (hasArea(p, "desarrollo")) return true;
  const tag = getMainTag(p);
  const tagged =
    tag.includes("dev") ||
    tag.includes("desarrollo") ||
    tag.includes("development") ||
    tag.includes("software") ||
    tag.includes("backend") ||
    tag.includes("frontend") ||
    tag.includes("fullstack") ||
    tag.includes("web");

  const inTags = hasAnyTag(p, /dev|desarrollo|development|software|backend|frontend|fullstack|web/);
  return tagged || inTags;
}

function isDesignProject(p: any): boolean {
  if (hasArea(p, "diseno")) return true;
  const tag = getMainTag(p);
  const tagged = tag.includes("design") || tag.includes("diseno") || tag.includes("ui") || tag.includes("ux");
  const inTags = hasAnyTag(p, /design|diseno|ui|ux/);
  return tagged || inTags;
}

/* ================= Component ================= */

export default function HomeHero() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [imgIdx, setImgIdx] = useState(0);
  const timerRef = useRef<number | null>(null);

  // counters
  const [counts, setCounts] = useState<{ leader: number; dev: number; design: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    const CANDIDATES = ["/data/proyectos.json", "/data/projects.json"];

    (async () => {
      try {
        let loaded: any[] | null = null;

        for (const url of CANDIDATES) {
          try {
            const r = await fetch(url, {
              cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
            });
            if (!r.ok) continue;
            const raw = await r.json();
            const arr: any[] = Array.isArray(raw)
              ? raw
              : raw?.projects || raw?.proyectos || raw?.items || raw?.data || [];
            if (Array.isArray(arr) && arr.length) {
              loaded = arr;
              break;
            }
          } catch {
            /* try next */
          }
        }

        const data = loaded || [];
        const leader = data.filter(isLeaderProject).length;
        const dev = data.filter(isDevProject).length;
        const design = data.filter(isDesignProject).length;

        if (mounted) setCounts({ leader, dev, design });
      } catch {
        if (mounted) setCounts(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // rotate role every 2.4s
  useEffect(() => {
    const t = window.setInterval(() => setRoleIdx((i) => (i + 1) % ROLES.length), 2400);
    return () => window.clearInterval(t);
  }, []);

  // cycle gallery every 5s
  useEffect(() => {
    timerRef.current = window.setInterval(() => setImgIdx((i) => (i + 1) % slides.length), 5000) as any;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const role = ROLES[roleIdx];
  const subKicker = useMemo(() => "Remote-first · UTC-6 (CDMX) · Spanish / English", []);

  return (
    <section className="relative isolate overflow-hidden bg-[#121212] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-6rem] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-fuchsia-500/15 blur-[140px]" />
        <div className="absolute right-[-6rem] bottom-[-6rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/15 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 pt-24 pb-14 md:pt-28 md:pb-20">
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-2">
          {/* Left: copy */}
          <div>
            <p className="text-sm uppercase tracking-widest text-white/60">Let’s build something people want</p>

            <h1 className="mt-3 text-4xl font-extrabold leading-[1.1] sm:text-5xl md:text-6xl">
              I turn ideas into products —
              <br className="hidden sm:block" />
              <span className="inline-flex h-[1.1em] overflow-hidden align-top">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={role}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-120%", opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="ml-1 bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent"
                  >
                    {role}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-white/80">
              Full-stack problem solver with product taste. I ship fast, design systems that scale,
              and lead teams with heart. If you need momentum, I’m your builder.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/section?type=leader"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Explore projects <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-white transition hover:bg-white/20"
              >
                Contact me <Mail className="h-4 w-4" />
              </Link>

              <a
                href={RESUME_HREF}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-2.5 text-white transition hover:bg-white/10 sm:ml-auto"
              >
                <Download className="h-4 w-4" /> Résumé
              </a>
            </div>

            <div className="mt-5 text-sm text-white/60">{subKicker}</div>

            {/* Social proof counters */}
            <div className="mt-6 grid w-full grid-cols-3 gap-3 sm:max-w-md">
              {[
                { label: "Leadership", value: counts?.leader ?? "—" },
                { label: "Development", value: counts?.dev ?? "—" },
                { label: "Design", value: counts?.design ?? "—" },
              ].map((c) => (
                <div
                  key={c.label}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center shadow-[0_0_5px_rgba(255,255,255,0.6)]"
                >
                  <div className="text-lg font-semibold">{c.value}</div>
                  <div className="text-[11px] uppercase tracking-wide text-white/60">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-4 text-white/80 pb-10">
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>

          {/* Right: layered gallery */}
          <div className="relative h-[44vh] min-h-[320px] w-full select-none sm:h-[52vh]">
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={slides[imgIdx].src}
                src={slides[imgIdx].src}
                alt={slides[imgIdx].alt}
                className="absolute left-1/2 top-1/2 h-[78%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-2xl object-cover shadow-2xl"
                initial={{ opacity: 0, scale: 1.04, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.6 }}
              />
            </AnimatePresence>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs backdrop-blur">
                <Play className="h-3.5 w-3.5" />
                Moments from my journey
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
