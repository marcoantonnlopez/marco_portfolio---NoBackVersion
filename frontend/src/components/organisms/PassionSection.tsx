// frontend/src/components/organisms/PassionSection.tsx
"use client";

import { useEffect, useState } from "react";
import Heading from "../atoms/Heading";
import { PassionCard } from "@/components/molecules/PassionCard";

type Counts = { leader: number; dev: number; designer: number };

const CARDS = [
  {
    key: "leader" as const,
    title: "Leader",
    description: "Building communities, movements, and teams that make ideas real.",
    imgSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/leader.svg",
    href: "/section?type=leader",
    tags: ["Top 1% leadership", "0→1", "Vision casting"],
  },
  {
    key: "dev" as const,
    title: "Developer",
    description: "Creating real solutions for real problems with tech environments.",
    imgSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/dev.svg",
    href: "/section?type=dev",
    tags: ["Rapid MVP", "TypeScript · Next.js", "Ship > talk"],
  },
  {
    key: "designer" as const,
    title: "Designer",
    description: "Making ideas work, connect and feel real through design.",
    imgSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/designer.svg",
    href: "/section?type=designer",
    tags: ["Top 1% product taste", "Design systems", "Product thinking"],
  },
];

/* ===== Helpers de clasificación (con soporte para `areas`) ===== */

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
    liderazgo: ["liderazgo", "lider", "leader", "leadership", "líder"],
    desarrollo: ["desarrollo", "dev", "development", "software", "backend", "frontend", "fullstack", "web"],
    diseno: ["diseno", "diseño", "design", "ui", "ux", "product design"],
  };
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

export default function PassionSection() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    let mounted = true;
    const CANDIDATES = ["/data/proyectos.json", "/data/projects.json"]; // JSON en /public/data/

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
        const designer = data.filter(isDesignProject).length;

        if (mounted) setCounts({ leader, dev, designer });
      } catch {
        if (mounted) setCounts(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const getMeta = (key: keyof Counts) => {
    if (!counts) return undefined; // evita “0 projects” durante carga
    const n = counts[key];
    return `${n} project${n === 1 ? "" : "s"}`;
    // si prefieres mostrar "—" en lugar de ocultar mientras carga, devuelve n ?? "—"
  };

  return (
    <section className="py-16 bg-[#121212]">
      <div className="max-w-6xl mx-auto px-4">
        <Heading level={2} className="text-center text-4xl sm:text-5xl mb-12">
          Explore my passion.
        </Heading>

        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <PassionCard
              key={c.key}
              title={c.title}
              meta={getMeta(c.key)} // “X projects”
              description={c.description}
              imgSrc={c.imgSrc}
              href={c.href}
              tags={c.tags}
              ctaLabel="See projects"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
