// frontend/src/app/section/SectionHero.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Area = "liderazgo" | "desarrollo" | "diseno";

const TITLES: Record<Area, string> = {
  liderazgo: "Leader",
  desarrollo: "Developer",
  diseno: "Designer",
};

const BACKGROUNDS: Record<Area, string> = {
  liderazgo:
    "https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/4_sections/foundderBG.svg",
  desarrollo:
    "https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/4_sections/devBG.svg",
  diseno:
    "https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/1_Home/designer.svg",
};

const TAGLINES: Record<Area, string> = {
  liderazgo: "Lead with heart. Ship with clarity.",
  desarrollo: "Build fast. Iterate. Measure.",
  diseno: "Make it useful — and beautiful.",
};

const TAGS: Record<Area, string[]> = {
  liderazgo: ["Teams", "0→1", "Strategy", "Community"],
  desarrollo: ["Next.js", "TypeScript", "API-first", "Performance"],
  diseno: ["Design systems", "User-obsessed", "Figma", "UX research"],
};

// Animations
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } };
const zoomIn = { hidden: { scale: 1.06, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 1 } } };
const slideUp = { hidden: { y: 24, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.7, delay: 0.15 } } };

export default function SectionHero({
  area,
  title,
  bgSrc,
  className = "",
  // ↓ Más compacto
  height = "h-[36vh] min-h-[240px] md:min-h-[300px]",
  uxPortfolioHref = "/ux-portfolio.svg",
}: {
  area: Area;
  title?: string;
  bgSrc?: string;
  className?: string;
  height?: string;
  uxPortfolioHref?: string; // usado solo en Designer
}) {
  const resolvedTitle = title ?? TITLES[area];
  const resolvedBg = bgSrc ?? BACKGROUNDS[area];
  const slogan = TAGLINES[area];
  const chips = TAGS[area];

  return (
    <motion.section initial="hidden" animate="show" className={`relative w-full ${height} overflow-hidden ${className}`}>
      {/* BG image */}
      <motion.div variants={zoomIn} className="absolute inset-0">
        <Image src={resolvedBg} alt={`${resolvedTitle} hero`} fill priority className="object-cover" />
      </motion.div>

      {/* Overlay para contraste */}
      <motion.div variants={fadeIn} className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />

      {/* Contenido – ahora más abajo */}
      <motion.div
        variants={slideUp}
        className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 pb-6 md:pb-8"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
            {resolvedTitle}
          </span>
        </h1>

        {/* Mini slogan */}
        <p className="mt-2 max-w-2xl text-white/85">{slogan}</p>

        {/* Tags por sección */}
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {chips.map((t, i) => (
            <span
              key={`${area}-tag-${i}`}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white"
            >
              {t}
            </span>
          ))}
        </div>

        {/* CTA SOLO en Designer */}
        {area === "diseno" && (
          <a
            href={uxPortfolioHref}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-white transition hover:bg-white hover:text-black"
          >
            See UX design portfolio
          </a>
        )}
      </motion.div>
    </motion.section>
  );
}
