// src/lib/projects-loader.ts
export type Area = "liderazgo" | "desarrollo" | "diseno";

export interface UIResultado {
  id: string;
  order?: number;
  label: string;
  description?: string;
  count?: number;
}

export interface UIContenido {
  id: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  href?: string;
}

export interface UISubSection {
  videoUrl?: string;
  queHice?: string;
  figmaUrl?: string;
  githubUrl?: string;
  projectUrl?: string;
  highlights?: string[];
  techStack?: string[];
}

export interface UIProject {
  id: string;
  title: string;
  descripcionBreve?: string;
  backgroundUrl?: string;
  logoUrl?: string;
  area?: Area;
  liderazgo?: UISubSection;
  desarrollo?: UISubSection;
  diseno?: UISubSection;
  resultados?: UIResultado[];
  contenidoAdicional?: UIContenido[];
  tags?: string[];
}

// -------- utils ----------
const F = {
  async json<T = any>(url: string): Promise<T | null> {
    try {
      const r = await fetch(url, {
        cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
      });
      if (!r.ok) return null;
      return (await r.json()) as T;
    } catch {
      return null;
    }
  },
  arr(x: any): any[] {
    return Array.isArray(x) ? x : [];
  },
  group<T extends Record<string, any>>(arr: T[], by: keyof T) {
    const m = new Map<string, T[]>();
    for (const a of arr) {
      const k = String(a?.[by] ?? "");
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(a);
    }
    return m;
  },
};

const PATHS = {
  proyectos: ["/data/proyectos.json", "/data/db.json"],
  liderazgo: ["/data/liderazgo.json"],
  liderazgoHighlights: ["/data/liderazgo-highlight.json", "/data/liderazgo-highlights.json"],
  desarrollo: ["/data/desarrollo.json"],
  desarrolloHighlights: ["/data/desarrollo-highlight.json", "/data/desarrollo-highlights.json"],
  devTechStack: ["/data/dev-tech-stack.json"],
  diseno: ["/data/diseno.json", "/data/diseño.json"],
  disenoHighlights: ["/data/diseno-highlight.json", "/data/diseño-highlight.json", "/data/diseno-highlights.json"],
  resultados: ["/data/resultado-proyecto.json", "/data/resultados.json"],
  contenidoAdicional: ["/data/contenido-adicional.json"],
};

async function loadFirst<T = any>(candidates: string[]): Promise<T | null> {
  for (const u of candidates) {
    const data = await F.json<T>(u);
    if (data) return data;
  }
  return null;
}

function normalizeProjectRow(row: any) {
  return {
    id: String(row?.id ?? row?.uuid ?? row?.slug ?? ""),
    title: String(row?.title ?? row?.nombre ?? row?.name ?? "Untitled"),
    descripcionBreve: String(row?.descripcion_breve ?? row?.descripcionBreve ?? row?.summary ?? ""),
    backgroundUrl: String(row?.background_url ?? row?.backgroundUrl ?? row?.background ?? row?.cover ?? ""),
    logoUrl: String(row?.logo_url ?? row?.logoUrl ?? row?.logo ?? ""),
    tags: Array.isArray(row?.tags) ? row.tags.map((t: any) => String(t)) : undefined,
  };
}

export async function getProjects(): Promise<UIProject[]> {
  // 1) Proyectos base
  const proyectosRaw = await loadFirst<any>(PATHS.proyectos);
  const proyectos = F.arr(
    proyectosRaw?.projects ?? proyectosRaw?.proyectos ?? proyectosRaw
  ).map(normalizeProjectRow);

  const byId = new Map<string, UIProject>();
  for (const p of proyectos) byId.set(p.id, { ...p });

  // 2) Liderazgo + highlights
  const liderRaw = await loadFirst<any[]>(PATHS.liderazgo);
  const lider = F.arr(liderRaw).map((r) => ({
    proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
    videoUrl: String(r?.video_url ?? r?.videoUrl ?? ""),
    queHice: String(r?.que_hice ?? r?.queHice ?? ""),
    id: String(r?.id ?? ""),
  }));
  const liderHlRaw = await loadFirst<any[]>(PATHS.liderazgoHighlights);
  const liderHlByLid = F.group(
    F.arr(liderHlRaw).map((h) => ({
      liderazgo_id: String(h?.liderazgo_id ?? h?.liderazgoId ?? ""),
      texto: String(h?.texto ?? h?.text ?? ""),
    })),
    "liderazgo_id"
  );

  for (const l of lider) {
    const p = byId.get(l.proyecto_id);
    if (!p) continue;
    p.liderazgo = {
      videoUrl: l.videoUrl,
      queHice: l.queHice,
      highlights: (liderHlByLid.get(l.id) || []).map((x) => x.texto),
    };
    p.area ??= "liderazgo";
  }

  // 3) Desarrollo + highlights + tech stack
  const devRaw = await loadFirst<any[]>(PATHS.desarrollo);
  const dev = F.arr(devRaw).map((r) => ({
    proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
    id: String(r?.id ?? ""),
    videoUrl: String(r?.video_url ?? r?.videoUrl ?? ""),
    projectUrl: String(r?.enlace_proyecto ?? r?.project_url ?? r?.projectUrl ?? ""),
    githubUrl: String(r?.github_url ?? r?.githubUrl ?? ""),
    figmaUrl: String(r?.figma_url ?? r?.figmaUrl ?? ""),
    queHice: String(r?.que_hice ?? r?.queHice ?? ""),
  }));
  const devHlRaw = await loadFirst<any[]>(PATHS.desarrolloHighlights);
  const devHlByDev = F.group(
    F.arr(devHlRaw).map((h) => ({
      desarrollo_id: String(h?.desarrollo_id ?? h?.desarrolloId ?? ""),
      texto: String(h?.texto ?? h?.text ?? ""),
    })),
    "desarrollo_id"
  );
  const devTsRaw = await loadFirst<any[]>(PATHS.devTechStack);
  const devTsByDev = F.group(
    F.arr(devTsRaw).map((t) => ({
      desarrollo_id: String(t?.desarrollo_id ?? t?.desarrolloId ?? ""),
      tech: String(t?.tech ?? t?.stack ?? ""),
    })),
    "desarrollo_id"
  );

  for (const d of dev) {
    const p = byId.get(d.proyecto_id);
    if (!p) continue;
    p.desarrollo = {
      videoUrl: d.videoUrl,
      projectUrl: d.projectUrl,
      githubUrl: d.githubUrl,
      figmaUrl: d.figmaUrl,
      queHice: d.queHice,
      highlights: (devHlByDev.get(d.id) || []).map((x) => x.texto),
      techStack: (devTsByDev.get(d.id) || []).map((x) => x.tech),
    };
    p.area ??= "desarrollo";
  }

  // 4) Diseño + highlights
  const dizRaw = await loadFirst<any[]>(PATHS.diseno);
  const diz = F.arr(dizRaw).map((r) => ({
    proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
    id: String(r?.id ?? ""),
    figmaUrl: String(r?.figma_url ?? r?.figmaUrl ?? ""),
    queHice: String(r?.que_hice ?? r?.queHice ?? ""),
  }));
  const dizHlRaw = await loadFirst<any[]>(PATHS.disenoHighlights);
  const dizHlByDid = F.group(
    F.arr(dizHlRaw).map((h) => ({
      diseno_id: String(h?.diseno_id ?? h?.diseño_id ?? h?.disenoId ?? ""),
      texto: String(h?.texto ?? h?.text ?? ""),
    })),
    "diseno_id"
  );

  for (const d of diz) {
    const p = byId.get(d.proyecto_id);
    if (!p) continue;
    p.diseno = {
      figmaUrl: d.figmaUrl,
      queHice: d.queHice,
      highlights: (dizHlByDid.get(d.id) || []).map((x) => x.texto),
    };
    p.area ??= "diseno";
  }

  // 5) Resultados
  const resRaw = await loadFirst<any[]>(PATHS.resultados);
  const resByPid = F.group(
    F.arr(resRaw).map((r) => ({
      proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
      id: String(r?.id ?? ""),
      orden: typeof r?.orden === "number" ? r.orden : Number(r?.orden ?? 0),
      valor: r?.valor,
      descripcion: r?.descripcion,
    })),
    "proyecto_id"
  );

  for (const [pid, arr] of resByPid) {
    const p = byId.get(pid);
    if (!p) continue;
    const mapped: UIResultado[] = arr
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
      .map((x) => {
        const maybeNum = Number(x.valor);
        const isNum = !Number.isNaN(maybeNum) && String(x.valor).trim() !== "";
        return {
          id: x.id,
          order: x.orden,
          label: String(x.descripcion ?? x.valor ?? ""),
          description: x.descripcion ? String(x.descripcion) : undefined,
          count: isNum ? maybeNum : undefined,
        };
      });
    (byId.get(pid)!).resultados = mapped;
  }

  // 6) Contenido adicional  <-- FIX: soporta "imagenUrl" y no-store en dev
  const caRaw = await loadFirst<any[]>(PATHS.contenidoAdicional);
  const caByPid = F.group(
    F.arr(caRaw).map((r) => ({
      proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
      id: String(r?.id ?? ""),
      imageUrl: String(
        r?.imagen_url ?? r?.image_url ?? r?.imageUrl ?? r?.imagenUrl ?? "" // <-- añadido imagenUrl
      ),
      title: String(r?.titulo ?? r?.title ?? ""),
      description: String(r?.descripcion ?? r?.description ?? ""),
      href: String(r?.enlace ?? r?.link ?? r?.url ?? ""),
    })),
    "proyecto_id"
  );

  for (const [pid, arr] of caByPid) {
    const p = byId.get(pid);
    if (!p) continue;
    (byId.get(pid)!).contenidoAdicional = arr;
  }

  return [...byId.values()];
}

// Helpers por área
export async function getProjectsByArea(area: Area): Promise<UIProject[]> {
  const all = await getProjects();
  return all.filter((p) => Boolean(p[area]));
}

export async function getCounts() {
  const all = await getProjects();
  return {
    leader: all.filter((p) => p.liderazgo).length,
    dev: all.filter((p) => p.desarrollo).length,
    design: all.filter((p) => p.diseno).length,
  };
}
