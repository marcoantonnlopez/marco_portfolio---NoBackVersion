// frontend/src/components/organisms/LeaderCarousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "../molecules/ProjectCard";

// === IDs FIJOS PARA ESTE CARRUSEL (elige aquí los 3) ===
const SELECTED_PROJECT_IDS: Array<string | number> = [1, 3, 5];

interface ProjectCardProps {
  id: string | number;
  title: string;
  descripcionBreve: string;
  backgroundUrl: string;
  logoUrl: string;
  resultados: Array<{ id: string; label: string; count?: number }>;
}

const gridStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const childPassThrough = {
  hidden: {},
  show: { transition: { when: "beforeChildren" } },
};

// ---------- helpers de carga / normalización ----------
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

function normalizeProjectRow(row: any) {
  return {
    id: row?.id, // puede ser string o number
    title: String(row?.title ?? row?.nombre ?? "Untitled"),
    slogan: String(row?.slogan ?? ""),
    descripcionBreve: String(row?.descripcionBreve ?? row?.descripcion_breve ?? ""),
    backgroundUrl: String(row?.backgroundUrl ?? row?.background_url ?? ""),
    logoUrl: String(row?.logoUrl ?? row?.logo_url ?? ""),
  };
}

type Tag = { id: string; label: string; count?: number };

async function buildLeaderTagsMap(): Promise<Map<string, Tag[]>> {
  // resultados: [{ id, proyectoId|proyecto_id, orden, valor, descripcion }]
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
    const ordered = rows.sort(
      (a, b) => Number(a?.orden ?? 0) - Number(b?.orden ?? 0)
    );
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

export default function LeaderCarousel() {
  const [projects, setProjects] = useState<ProjectCardProps[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setProjects(null);

      // 1) Cargar proyectos base
      const proyectosRaw =
        (await loadJson<any[]>("/data/proyectos.json")) ||
        (await loadJson<any[]>("/data/db.json")) ||
        [];
      const proyectos = arr(proyectosRaw).map(normalizeProjectRow);

      // 2) Mantener SOLO los seleccionados (1, 3, 5), respetando su orden
      const byId = new Map<string, ReturnType<typeof normalizeProjectRow>>();
      for (const p of proyectos) byId.set(asId(p.id), p);

      const selected = SELECTED_PROJECT_IDS
        .map(asId)
        .map((id) => byId.get(id))
        .filter(Boolean) as ReturnType<typeof normalizeProjectRow>[];

      // 3) Tags: resultados (primeros 3 por proyecto)
      const leaderTags = await buildLeaderTagsMap();

      // 4) Mapear a props de card
      const mapped: ProjectCardProps[] = selected.map((p) => ({
        id: p.id,
        title: p.title,
        descripcionBreve: p.slogan?.trim()?.length ? p.slogan : p.descripcionBreve,
        backgroundUrl: p.backgroundUrl,
        logoUrl: p.logoUrl,
        resultados: leaderTags.get(asId(p.id)) ?? [],
      }));

      if (!cancelled) setProjects(mapped);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (projects === null) {
    return (
      <section className="relative py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-8 w-72 bg-white/10 rounded mb-6 animate-pulse" />
          <div className="flex space-x-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] w-[80%] md:w-[45%] lg:w-[30%] bg-white/10 rounded-xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Siempre mostramos 3 cards (los seleccionados) + la 4ª "Ver más proyectos"
  const toShow = projects.slice(0, 3);

  return (
    <section className="relative py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-5xl font-extrabold text-white mb-4">
          Founded. Led. Changed.
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Life gave me opportunities to make things different. With love.
        </p>

        <motion.div
          ref={containerRef}
          variants={gridStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex space-x-6 overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar"
        >
          {toShow.map((p) => (
            <motion.div
              key={p.id}
              variants={childPassThrough}
              className="snap-center flex-shrink-0 w-[80%] md:w-[45%] lg:w-[30%]"
            >
              <ProjectCard {...p} variant="liderazgo" />
            </motion.div>
          ))}

          {/* Card 4: Ver más proyectos */}
          <motion.div
            variants={childPassThrough}
            className="snap-center flex-shrink-0 w-[80%] md:w-[45%] lg:w-[30%]"
          >
            <Link
              href="/section?type=leader"
              className="block h-full bg-white/10 hover:bg-white/20 rounded-xl p-8 flex flex-col items-center justify-center text-white text-lg font-medium"
            >
              Ver más proyectos
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}
