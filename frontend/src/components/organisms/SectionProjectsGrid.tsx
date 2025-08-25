// frontend/src/components/organisms/SectionProjectsGrid.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "../molecules/ProjectCard";

type Area = "liderazgo" | "desarrollo" | "diseno";

interface ProjectCardProps {
  id: string | number;
  title: string;
  descripcionBreve: string;
  backgroundUrl: string;
  logoUrl: string;
  resultados: Array<{ id: string; label: string; count?: number }>;
}

interface Props {
  area: Area;
  title?: string;
  limit?: number;
}

const TITLES: Record<Area, string> = {
  liderazgo: "My leadership projects",
  desarrollo: "My development projects",
  diseno: "My design projects",
};

// Animations
const gridStagger = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };
const childPassThrough = { hidden: {}, show: { transition: { when: "beforeChildren" } } };

// ---- Utils de fetch robustos (aceptan distintos shapes) ----
async function loadJson<T = any>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, {
      cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
    });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}
const arr = (x: any) => (Array.isArray(x) ? x : []);
const asId = (v: any) => String(v ?? "").trim();

// ---- Normalizador base desde proyectos.json ----
function normalizeProjectRow(row: any) {
  return {
    id: row?.id,
    title: String(row?.title ?? row?.nombre ?? "Untitled"),
    slogan: String(row?.slogan ?? ""),
    descripcionBreve: String(row?.descripcionBreve ?? row?.descripcion_breve ?? ""),
    backgroundUrl: String(row?.backgroundUrl ?? row?.background_url ?? ""),
    logoUrl: String(row?.logoUrl ?? row?.logo_url ?? ""),
    areas: Array.isArray(row?.areas) ? row.areas.map((a: any) => String(a)) : [],
  };
}

// ---- Construcción de tags por área ----
type Tag = { id: string; label: string; count?: number };

async function buildLeaderTagsMap(): Promise<Map<string, Tag[]>> {
  const raw =
    (await loadJson<any[]>("/data/resultado-proyecto.json")) ||
    (await loadJson<any[]>("/data/resultados.json")) ||
    [];
  const grouped = new Map<string, any[]>();
  for (const r of arr(raw)) {
    const pid = asId(r?.proyectoId ?? r?.proyecto_id ?? r?.project_id);
    if (!pid) continue;
    if (!grouped.has(pid)) grouped.set(pid, []);
    grouped.get(pid)!.push(r);
  }

  const out = new Map<string, Tag[]>();
  for (const [pid, rows] of grouped) {
    const ordered = rows.sort((a, b) => Number(a?.orden ?? 0) - Number(b?.orden ?? 0));
    const tags = ordered.slice(0, 3).map((r: any, i: number) => {
      const label = String(r?.descripcion ?? r?.valor ?? "");
      const valNum = Number(r?.valor);
      const count = Number.isFinite(valNum) ? valNum : undefined;
      return { id: `${pid}-res-${i}`, label, count };
    });
    out.set(pid, tags);
  }
  return out;
}

async function buildDevTagsMap(): Promise<Map<string, { id: string; label: string; count?: number }[]>> {
  const raw = await loadJson<any[]>("/data/dev-tech-stack.json");
  const byDev = new Map<string, { id: string; label: string; count?: number }[]>();

  const idList = (v: any): string[] => {
    if (Array.isArray(v)) return v.map((x) => String(x ?? "").trim()).filter(Boolean);
    if (typeof v === "number") return [String(v)];
    if (typeof v === "string") {
      return v.split(/[,\s;|]+/g).map((x) => x.trim()).filter(Boolean);
    }
    return [];
  };

  for (const row of Array.isArray(raw) ? raw : []) {
    const tech = String(row?.tech ?? row?.stack ?? "").trim();
    if (!tech) continue;

    const devIds = [
      ...idList(row?.desarrollo_id),
      ...idList(row?.desarrolloId),
      ...idList(row?.desarrolloIds),
    ];

    for (const did of devIds) {
      if (!byDev.has(did)) byDev.set(did, []);
      const list = byDev.get(did)!;

      // evita duplicados de label
      if (!list.some((t) => t.label === tech)) {
        if (list.length < 3) list.push({ id: `${did}-tech-${list.length}`, label: tech });
      }
    }
  }
  return byDev;
}


async function buildDesignTagsMap(): Promise<Map<string, Tag[]>> {
  const raw =
    (await loadJson<any[]>("/data/diseno-highlight.json")) ||
    (await loadJson<any[]>("/data/diseño-highlight.json")) ||
    (await loadJson<any[]>("/data/diseno-highlights.json"));
  const byDesign = new Map<string, Tag[]>();
  for (const r of arr(raw)) {
    const did = asId(r?.disenoId ?? r?.diseñoId);
    if (!did) continue;
    if (!byDesign.has(did)) byDesign.set(did, []);
    const list = byDesign.get(did)!;
    if (list.length < 2)
      list.push({ id: `${did}-dhl-${list.length}`, label: String(r?.texto ?? "") });
  }
  return byDesign;
}

export default function SectionProjectsGrid({ area, title, limit }: Props) {
  const [projects, setProjects] = useState<ProjectCardProps[] | null>(null);
  const effectiveTitle = title ?? TITLES[area];

  useEffect(() => {
    let cancelled = false;
    setProjects(null);

    (async () => {
      // 1) Cargar proyectos
      const proyectosRaw =
        (await loadJson<any[]>("/data/proyectos.json")) ||
        (await loadJson<any[]>("/data/db.json")) ||
        [];
      const proyectos = arr(proyectosRaw).map(normalizeProjectRow);

      // 2) Filtrar por área declarada en cada proyecto
      const filtered = proyectos.filter((p) => p.areas.includes(area));

      // 3) Cargar tags específicos por área
      let tagMap: Map<string, Tag[]>;
      if (area === "liderazgo") tagMap = await buildLeaderTagsMap();
      else if (area === "desarrollo") tagMap = await buildDevTagsMap();
      else tagMap = await buildDesignTagsMap();

      // 4) Mapear a props de ProjectCard
      const mapped: ProjectCardProps[] = filtered.map((p) => ({
        id: p.id,
        title: p.title,
        // usar slogan si existe; si no, la descripcionBreve
        descripcionBreve: p.slogan?.trim()?.length ? p.slogan : p.descripcionBreve,
        backgroundUrl: p.backgroundUrl,
        logoUrl: p.logoUrl,
        resultados: tagMap.get(asId(p.id)) ?? [],
      }));

      const finalList = typeof limit === "number" ? mapped.slice(0, limit) : mapped;
      if (!cancelled) setProjects(finalList);
    })();

    return () => {
      cancelled = true;
    };
  }, [area, limit]);

  if (projects === null) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {effectiveTitle && <div className="h-8 w-64 bg-white/10 rounded mb-8 animate-pulse" />}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-white/10 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {effectiveTitle && (
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8">{effectiveTitle}</h2>
          )}
          <p className="text-gray-400">No projects found for “{area}”.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {effectiveTitle && (
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-8">{effectiveTitle}</h2>
        )}

        {/* 👇 cambia whileInView por animate para que no quede oculto hasta hacer scroll */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((p) => (
            <motion.div key={p.id} variants={childPassThrough}>
              <ProjectCard {...p} variant={area} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
