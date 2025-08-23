// frontend/src/components/organisms/DesignCarousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProjectCard from "../molecules/ProjectCard";

// === IDs FIJOS PARA ESTE CARRUSEL (3 proyectos a mostrar) ===
const SELECTED_PROJECT_IDS: Array<string | number> = [7, 8, 9];

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

// Construye tags desde diseno-highlight.json (primeros 2 por disenoId == project.id)
async function buildDesignTagsMap(): Promise<Map<string, Tag[]>> {
  const raw =
    (await loadJson<any[]>("/data/diseno-highlight.json")) ||
    (await loadJson<any[]>("/data/diseño-highlight.json")) ||
    (await loadJson<any[]>("/data/diseno-highlights.json")) ||
    [];
  const byDesign = new Map<string, Tag[]>();
  for (const r of arr(raw)) {
    const did = asId(r?.disenoId ?? r?.diseñoId ?? r?.designId);
    if (!did) continue;
    if (!byDesign.has(did)) byDesign.set(did, []);
    const list = byDesign.get(did)!;
    if (list.length < 2) {
      list.push({
        id: `${did}-dhl-${list.length}`,
        label: String(r?.texto ?? r?.text ?? r?.label ?? ""),
      });
    }
  }
  return byDesign;
}

export default function DesignCarousel() {
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

      // 2) Mantener SOLO los seleccionados (7, 8, 9), respetando su orden
      const byId = new Map<string, ReturnType<typeof normalizeProjectRow>>();
      for (const p of proyectos) byId.set(asId(p.id), p);

      const selected = SELECTED_PROJECT_IDS
        .map(asId)
        .map((id) => byId.get(id))
        .filter(Boolean) as ReturnType<typeof normalizeProjectRow>[];

      // 3) Tags de diseño: primeros 2 por proyecto desde diseno-highlight
      const designTags = await buildDesignTagsMap();

      // 4) Mapear a props de card
      const mapped: ProjectCardProps[] = selected.map((p) => ({
        id: p.id,
        title: p.title,
        descripcionBreve: p.slogan?.trim()?.length ? p.slogan : p.descripcionBreve,
        backgroundUrl: p.backgroundUrl,
        logoUrl: p.logoUrl,
        resultados: designTags.get(asId(p.id)) ?? [],
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

  // Siempre mostramos 3 cards (las seleccionadas) + la 4ª "Ver más proyectos"
  const toShow = projects.slice(0, 3);

  return (
    <section className="relative py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-5xl font-extrabold text-white mb-4">
          Learn. Design. Create.
        </h2>
        <p className="text-center text-gray-400 mb-12">
          Creating new solutions is one of my passions.
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
              <ProjectCard {...p} variant="diseno" />
            </motion.div>
          ))}

          {/* Card 4: Ver más proyectos */}
          <motion.div
            variants={childPassThrough}
            className="snap-center flex-shrink-0 w-[80%] md:w-[45%] lg:w-[30%]"
          >
            <Link
              href="/section?type=designer"
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
