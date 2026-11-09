// frontend/src/lib/useProjectCounts.ts
/* eslint-disable @typescript-eslint/no-explicit-any -- project JSON is untyped */
"use client";

import { useEffect, useState } from "react";

// Same classification rules the home hero used, so the counters stay identical.

const norm = (v: unknown) =>
  String(v ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

const mainTag = (p: any) => norm(p?.type ?? p?.area ?? p?.category ?? p?.categoria ?? "");
const anyTag = (p: any, re: RegExp) => Array.isArray(p?.tags) && p.tags.some((t: any) => re.test(norm(t)));

const AREA_SYNONYMS = {
  liderazgo: ["liderazgo", "lider", "lideres", "liderar", "leader", "leadership", "líder"],
  desarrollo: ["desarrollo", "dev", "development", "software", "backend", "frontend", "fullstack", "web"],
  diseno: ["diseno", "diseño", "design", "ui", "ux", "product design"],
} as const;

function hasArea(p: any, target: keyof typeof AREA_SYNONYMS) {
  if (!Array.isArray(p?.areas)) return false;
  const areas = p.areas.map(norm);
  return areas.some((a: string) => AREA_SYNONYMS[target].some((w) => a.includes(w)));
}

const LEADER_RE =
  /leader|leadership|lider|liderazgo|community|organizer|founder|volunteer|mentorship|club|team lead|president|coordinator/;
const DEV_RE = /dev|desarrollo|development|software|backend|frontend|fullstack|web/;
const DESIGN_RE = /design|diseno|ui|ux/;

const isLeader = (p: any) => hasArea(p, "liderazgo") || LEADER_RE.test(mainTag(p)) || anyTag(p, LEADER_RE);
const isDev = (p: any) => hasArea(p, "desarrollo") || DEV_RE.test(mainTag(p)) || anyTag(p, DEV_RE);
const isDesign = (p: any) => hasArea(p, "diseno") || DESIGN_RE.test(mainTag(p)) || anyTag(p, DESIGN_RE);

export type ProjectCounts = { leader: number; dev: number; design: number };

export function useProjectCounts(): ProjectCounts | null {
  const [counts, setCounts] = useState<ProjectCounts | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      for (const url of ["/data/proyectos.json", "/data/projects.json"]) {
        try {
          const r = await fetch(url, { cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache" });
          if (!r.ok) continue;
          const raw = await r.json();
          const arr: any[] = Array.isArray(raw) ? raw : raw?.projects || raw?.proyectos || raw?.items || raw?.data || [];
          if (Array.isArray(arr) && arr.length) {
            if (alive) setCounts({ leader: arr.filter(isLeader).length, dev: arr.filter(isDev).length, design: arr.filter(isDesign).length });
            return;
          }
        } catch {
          /* try next */
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return counts;
}
