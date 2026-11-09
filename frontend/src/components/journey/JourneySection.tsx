// frontend/src/components/journey/JourneySection.tsx
"use client";

import { Component, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight, Github, Linkedin } from "lucide-react";
import { INTRO_COPY, OUTRO_COPY, STOPS, STOP_COUNT, progressToStop } from "./cities";
import { useProjectCounts } from "@/lib/useProjectCounts";

const CityScene = dynamic(() => import("./CityScene"), { ssr: false });

const GITHUB_URL = process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/marcoantonnlopez";
const LINKEDIN_URL = process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/in/marco-antonn/";

type Phase = { kind: "intro" } | { kind: "city"; index: number } | { kind: "between" } | { kind: "outro" };

/** If WebGL fails, keep the copy and drop the 3D. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const fade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.35 } },
};

/* ---------- copy blocks ---------- */

function IntroBlock() {
  return (
    <div className="max-w-3xl">
      <h2 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">{INTRO_COPY.title}</h2>
      <p className="mt-5 max-w-2xl text-base text-white/80 sm:text-lg">{INTRO_COPY.roles}</p>
    </div>
  );
}

function StopCard({ index }: { index: number }) {
  const { copy } = STOPS[index];
  return (
    <div className="max-w-xl rounded-2xl border border-white/15 bg-black/45 px-6 py-5 backdrop-blur-md">
      <span className="text-xs uppercase tracking-widest text-white/60">{copy.eyebrow}</span>
      <h3 className="mt-1 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl">{copy.title}</h3>
      <p className="mt-2 text-sm text-white/80 sm:text-base">{copy.body}</p>
      <span className="mt-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/85">
        {copy.tag}
      </span>
    </div>
  );
}

function OutroCard() {
  const counts = useProjectCounts();
  return (
    <div className="max-w-xl rounded-2xl border border-white/10 bg-black/45 p-6 backdrop-blur-md sm:p-8">
      <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">{OUTRO_COPY.title}</h2>
      <p className="mt-2 text-white/80">{OUTRO_COPY.body}</p>

      <div className="mt-5 flex items-center gap-4 text-white/80">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
          <Github className="h-4 w-4" /> GitHub
        </a>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white">
          <Linkedin className="h-4 w-4" /> LinkedIn
        </a>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
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

      <Link
        href="/section?type=leader"
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        Explore projects <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* ---------- section ---------- */

export default function JourneySection() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const { u } = progressToStop(p);
    const k = Math.round(u);
    let next: Phase;
    if (u < 0.45) next = { kind: "intro" };
    else if (u > STOP_COUNT - 1.45) next = { kind: "outro" };
    else if (k >= 1 && k <= STOPS.length && Math.abs(u - k) < 0.42) next = { kind: "city", index: k - 1 };
    else next = { kind: "between" };
    setPhase((prev) =>
      prev.kind === next.kind && (prev.kind !== "city" || (next.kind === "city" && prev.index === next.index)) ? prev : next
    );
  });

  // Reduced motion: no 3D flight, just the two copy blocks.
  if (reduceMotion) {
    return (
      <section className="mx-auto flex max-w-6xl flex-col gap-12 bg-black px-6 py-24 text-white">
        <IntroBlock />
        {STOPS.map((_, i) => (
          <StopCard key={i} index={i} />
        ))}
        <OutroCard />
      </section>
    );
  }

  const key = phase.kind === "city" ? `city-${phase.index}` : phase.kind;

  return (
    <section ref={ref} aria-label="My journey" className="relative h-[600svh] bg-black text-white">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <SceneBoundary>
          <CityScene progress={scrollYProgress} />
        </SceneBoundary>

        {/* blend the top edge into the black section above */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="pointer-events-none absolute inset-0 mx-auto flex max-w-6xl flex-col justify-end px-6 pb-16 sm:pb-20">
          <AnimatePresence mode="wait">
            {phase.kind !== "between" && (
              <motion.div key={key} {...fade} className="pointer-events-auto">
                {phase.kind === "intro" && <IntroBlock />}
                {phase.kind === "city" && <StopCard index={phase.index} />}
                {phase.kind === "outro" && <OutroCard />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
