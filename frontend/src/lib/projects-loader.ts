// // src/lib/projects-loader.ts

// export type Area = "liderazgo" | "desarrollo" | "diseno";

// export interface UIResultado {
//   id: string;
//   order?: number;
//   label: string;
//   description?: string;
//   count?: number;
// }

// export interface UIContenido {
//   id: string;
//   imageUrl?: string;
//   title?: string;
//   description?: string;
//   href?: string;
// }

// export interface UISubSection {
//   videoUrl?: string;
//   queHice?: string;
//   previewUrl?: string;   // design preview
//   figmaUrl?: string;
//   githubUrl?: string;
//   projectUrl?: string;
//   highlights?: string[];
//   techStack?: string[];  // dev or design techs
// }

// export interface UIProject {
//   id: string;
//   title: string;
//   descripcionBreve?: string;
//   backgroundUrl?: string;
//   logoUrl?: string;

//   // NEW: carry these fields from proyectos.json so Hero & others can use them
//   slogan?: string;
//   proyectoUrl?: string;
//   instagramUrl?: string;
//   linkedinUrl?: string;
//   twitterUrl?: string;
//   youtubeUrl?: string;
//   facebookUrl?: string;

//   area?: Area;
//   liderazgo?: UISubSection;
//   desarrollo?: UISubSection;
//   diseno?: UISubSection;
//   resultados?: UIResultado[];
//   contenidoAdicional?: UIContenido[];
//   tags?: string[];
// }

// /* -----------------------------------------------------------
//  * Utils
//  * --------------------------------------------------------- */
// const F = {
//   async json<T = any>(url: string): Promise<T | null> {
//     try {
//       // Bypass cache so edits in /public/data/*.json show up immediately (dev & prod)
//       const r = await fetch(url, { cache: "no-store" });
//       if (!r.ok) return null;
//       return (await r.json()) as T;
//     } catch {
//       return null;
//     }
//   },
//   arr(x: any): any[] {
//     return Array.isArray(x) ? x : [];
//   },
//   group<T extends Record<string, any>>(arr: T[], by: keyof T) {
//     const m = new Map<string, T[]>();
//     for (const a of arr) {
//       const k = String(a?.[by] ?? "");
//       if (!m.has(k)) m.set(k, []);
//       m.get(k)!.push(a);
//     }
//     return m;
//   },
// };

// const PATHS = {
//   proyectos: ["/data/proyectos.json", "/data/db.json"],
//   liderazgo: ["/data/liderazgo.json"],
//   liderazgoHighlights: [
//     "/data/liderazgo-highlight.json",
//     "/data/liderazgo-highlights.json",
//   ],
//   desarrollo: ["/data/desarrollo.json"],
//   desarrolloHighlights: [
//     "/data/desarrollo-highlight.json",
//     "/data/desarrollo-highlights.json",
//   ],
//   devTechStack: ["/data/dev-tech-stack.json"],
//   diseno: ["/data/diseno.json", "/data/diseño.json"],
//   disenoHighlights: [
//     "/data/diseno-highlight.json",
//     "/data/diseño-highlight.json",
//     "/data/diseno-highlights.json",
//   ],
//   resultados: ["/data/resultado-proyecto.json", "/data/resultados.json"],
//   contenidoAdicional: ["/data/contenido-adicional.json"],
// };

// async function loadFirst<T = any>(candidates: string[]): Promise<T | null> {
//   for (const u of candidates) {
//     const data = await F.json<T>(u);
//     if (data) return data;
//   }
//   return null;
// }

// function normalizeProjectRow(row: any) {
//   return {
//     id: String(row?.id ?? row?.uuid ?? row?.slug ?? ""),
//     title: String(row?.title ?? row?.nombre ?? row?.name ?? "Untitled"),
//     descripcionBreve: String(
//       row?.descripcion_breve ?? row?.descripcionBreve ?? row?.summary ?? ""
//     ),
//     backgroundUrl: String(
//       row?.background_url ??
//         row?.backgroundUrl ??
//         row?.background ??
//         row?.cover ??
//         ""
//     ),
//     logoUrl: String(row?.logo_url ?? row?.logoUrl ?? row?.logo ?? ""),

//     // NEW: keep marketing + socials
//     slogan: String(row?.slogan ?? ""),
//     proyectoUrl: String(row?.proyectoUrl ?? row?.projectUrl ?? ""),
//     instagramUrl: String(row?.instagramUrl ?? ""),
//     linkedinUrl: String(row?.linkedinUrl ?? ""),
//     twitterUrl: String(row?.twitterUrl ?? ""),
//     youtubeUrl: String(row?.youtubeUrl ?? ""),
//     facebookUrl: String(row?.facebookUrl ?? ""),

//     tags: Array.isArray(row?.tags)
//       ? row.tags.map((t: any) => String(t))
//       : undefined,
//   };
// }

// /* -----------------------------------------------------------
//  * Loader
//  * --------------------------------------------------------- */
// export async function getProjects(): Promise<UIProject[]> {
//   /* 1) Proyectos base */
//   const proyectosRaw = await loadFirst<any>(PATHS.proyectos);
//   const proyectos = (Array.isArray(proyectosRaw?.projects ?? proyectosRaw?.proyectos)
//     ? (proyectosRaw?.projects ?? proyectosRaw?.proyectos)
//     : proyectosRaw) as any[];
//   const base = (Array.isArray(proyectos) ? proyectos : []).map(
//     normalizeProjectRow
//   );

//   const byId = new Map<string, UIProject>();
//   for (const p of base) byId.set(p.id, { ...p });

//   /* 2) Liderazgo + highlights (tolerant to proyectoId or liderazgoId in highlights) */
//   const liderRaw = await loadFirst<any[]>(PATHS.liderazgo);
//   const lider = (Array.isArray(liderRaw) ? liderRaw : []).map((r) => ({
//     proyecto_id: String(
//       r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""
//     ),
//     id: String(r?.id ?? ""),
//     videoUrl: String(r?.video_url ?? r?.videoUrl ?? ""),
//     queHice: String(r?.que_hice ?? r?.queHice ?? ""),
//   }));

//   // map: proyectoId -> liderazgoId
//   const liderByProjectId = new Map<string, string>();
//   for (const l of lider) {
//     if (l.proyecto_id && l.id) liderByProjectId.set(l.proyecto_id, l.id);
//   }

//   const liderHlRaw = await loadFirst<any[]>(PATHS.liderazgoHighlights);
//   const liderHlNorm = (Array.isArray(liderHlRaw) ? liderHlRaw : [])
//     .map((h) => {
//       const lid = String(h?.liderazgo_id ?? h?.liderazgoId ?? "");
//       const pid = String(h?.proyecto_id ?? h?.proyectoId ?? "");
//       const key = lid || (pid ? liderByProjectId.get(pid) ?? "" : "");
//       return {
//         liderazgo_id: key,
//         texto: String(h?.texto ?? h?.text ?? ""),
//       };
//     })
//     .filter((h) => h.liderazgo_id);

//   const liderHlByLid = new Map<string, { texto: string }[]>();
//   for (const h of liderHlNorm) {
//     if (!liderHlByLid.has(h.liderazgo_id)) liderHlByLid.set(h.liderazgo_id, []);
//     liderHlByLid.get(h.liderazgo_id)!.push({ texto: h.texto });
//   }

//   for (const l of lider) {
//     const p = byId.get(l.proyecto_id);
//     if (!p) continue;
//     p.liderazgo = {
//       videoUrl: l.videoUrl,
//       queHice: l.queHice,
//       highlights: (liderHlByLid.get(l.id) || []).map((x) => x.texto),
//     };
//     p.area ??= "liderazgo";
//   }

//   /* 3) Desarrollo + highlights + tech stack (by desarrolloId) */
//   const devRaw = await loadFirst<any[]>(PATHS.desarrollo);
//   const dev = F.arr(devRaw).map((r) => ({
//     proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
//     id: String(r?.id ?? ""),
//     videoUrl: String(r?.video_url ?? r?.videoUrl ?? ""),
//     projectUrl: String(
//       r?.enlace_proyecto ?? r?.project_url ?? r?.projectUrl ?? ""
//     ),
//     githubUrl: String(r?.github_url ?? r?.githubUrl ?? ""),
//     figmaUrl: String(r?.figma_url ?? r?.figmaUrl ?? ""),
//     queHice: String(r?.que_hice ?? r?.queHice ?? ""),
//   }));

//   const devHlRaw = await loadFirst<any[]>(PATHS.desarrolloHighlights);
//   const devHlByDev = F.group(
//     F.arr(devHlRaw).map((h) => ({
//       desarrollo_id: String(h?.desarrollo_id ?? h?.desarrolloId ?? ""),
//       texto: String(h?.texto ?? h?.text ?? ""),
//     })),
//     "desarrollo_id"
//   );

//   // --- Tech stack: soporta múltiples ids por fila (desarrolloId(s) y/o disenoId(s)) ---
// const devTsRaw = await loadFirst<any[]>(PATHS.devTechStack);

// // helper: normaliza una lista de ids que puede venir como número, string "1, 2 | 3", o array
// const idList = (v: any): string[] => {
//   if (Array.isArray(v)) return v.map((x) => String(x ?? "").trim()).filter(Boolean);
//   if (typeof v === "number") return [String(v)];
//   if (typeof v === "string") {
//     return v
//       .split(/[,\s;|]+/g)
//       .map((x) => x.trim())
//       .filter(Boolean);
//   }
//   return [];
// };

// // construimos sets para evitar duplicados por id
// const devTsByDevSet = new Map<string, Set<string>>();
// const devTsByDesignSet = new Map<string, Set<string>>();

// for (const t of F.arr(devTsRaw)) {
//   const tech = String(t?.tech ?? t?.stack ?? "").trim();
//   if (!tech) continue;

//   // recolecta TODAS las variantes posibles para desarrollo
//   const devIds = [
//     ...idList(t?.desarrollo_id),
//     ...idList(t?.desarrolloId),
//     ...idList(t?.desarrolloIds),
//   ];
//   // recolecta TODAS las variantes posibles para diseño
//   const dizIds = [
//     ...idList(t?.diseno_id),
//     ...idList(t?.diseño_id),
//     ...idList(t?.disenoId),
//     ...idList(t?.disenoIds),
//     ...idList(t?.diseñoIds),
//   ];

//   for (const id of devIds) {
//     if (!devTsByDevSet.has(id)) devTsByDevSet.set(id, new Set());
//     devTsByDevSet.get(id)!.add(tech);
//   }
//   for (const id of dizIds) {
//     if (!devTsByDesignSet.has(id)) devTsByDesignSet.set(id, new Set());
//     devTsByDesignSet.get(id)!.add(tech);
//   }
// }

// // convierte sets -> arrays
// const devTsByDev = new Map<string, string[]>();
// for (const [id, set] of devTsByDevSet) devTsByDev.set(id, [...set]);

// const devTsByDesign = new Map<string, string[]>();
// for (const [id, set] of devTsByDesignSet) devTsByDesign.set(id, [...set]);


//   for (const d of dev) {
//     const p = byId.get(d.proyecto_id);
//     if (!p) continue;
//     p.desarrollo = {
//       videoUrl: d.videoUrl,
//       projectUrl: d.projectUrl,
//       githubUrl: d.githubUrl,
//       figmaUrl: d.figmaUrl,
//       queHice: d.queHice,
//       highlights: (devHlByDev.get(d.id) || []).map((x) => x.texto),
//       techStack: devTsByDev.get(d.id) || [],
//     };
//     p.area ??= "desarrollo";
//   }

//   /* 4) Diseño + highlights (+ previewUrl + tech stack by disenoId) */
//   const dizRaw = await loadFirst<any[]>(PATHS.diseno);
//   const diz = F.arr(dizRaw).map((r) => ({
//     proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
//     id: String(r?.id ?? ""),
//     previewUrl: String(r?.preview_url ?? r?.previewUrl ?? r?.preview ?? ""),
//     figmaUrl: String(r?.figma_url ?? r?.figmaUrl ?? ""),
//     queHice: String(r?.que_hice ?? r?.queHice ?? ""),
//   }));

//   const dizHlRaw = await loadFirst<any[]>(PATHS.disenoHighlights);
//   const dizHlByDid = F.group(
//     F.arr(dizHlRaw).map((h) => ({
//       diseno_id: String(h?.diseno_id ?? h?.diseño_id ?? h?.disenoId ?? ""),
//       texto: String(h?.texto ?? h?.text ?? ""),
//     })),
//     "diseno_id"
//   );

//   for (const d of diz) {
//     const p = byId.get(d.proyecto_id);
//     if (!p) continue;
//     p.diseno = {
//       previewUrl: d.previewUrl,
//       figmaUrl: d.figmaUrl,
//       queHice: d.queHice,
//       highlights: (dizHlByDid.get(d.id) || []).map((x) => x.texto),
//       techStack: devTsByDesign.get(d.id) || [],
//     };
//     p.area ??= "diseno";
//   }

//   /* 5) Resultados */
//   const resRaw = await loadFirst<any[]>(PATHS.resultados);
//   const resByPid = F.group(
//     F.arr(resRaw).map((r) => ({
//       proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
//       id: String(r?.id ?? ""),
//       orden:
//         typeof r?.orden === "number" ? r.orden : Number(r?.orden ?? 0),
//       valor: r?.valor,
//       descripcion: r?.descripcion,
//     })),
//     "proyecto_id"
//   );

//   for (const [pid, arr] of resByPid) {
//     const p = byId.get(pid);
//     if (!p) continue;
//     const mapped: UIResultado[] = arr
//       .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
//       .map((x) => {
//         const maybeNum = Number(x.valor);
//         const isNum =
//           !Number.isNaN(maybeNum) && String(x.valor).trim() !== "";
//         return {
//           id: x.id,
//           order: x.orden,
//           label: String(x.descripcion ?? x.valor ?? ""),
//           description: x.descripcion ? String(x.descripcion) : undefined,
//           count: isNum ? maybeNum : undefined,
//         };
//       });
//     (byId.get(pid)!).resultados = mapped;
//   }

//   /* 6) Contenido adicional */
//   const caRaw = await loadFirst<any[]>(PATHS.contenidoAdicional);
//   const caByPid = F.group(
//     F.arr(caRaw).map((r) => ({
//       proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
//       id: String(r?.id ?? ""),
//       imageUrl: String(
//         r?.imagen_url ?? r?.image_url ?? r?.imageUrl ?? r?.imagenUrl ?? ""
//       ),
//       title: String(r?.titulo ?? r?.title ?? ""),
//       description: String(r?.descripcion ?? r?.description ?? ""),
//       href: String(r?.enlace ?? r?.link ?? r?.url ?? ""),
//     })),
//     "proyecto_id"
//   );

//   for (const [pid, arr] of caByPid) {
//     const p = byId.get(pid);
//     if (!p) continue;
//     (byId.get(pid)!).contenidoAdicional = arr;
//   }

//   return [...byId.values()];
// }

// /* -----------------------------------------------------------
//  * Helpers
//  * --------------------------------------------------------- */
// export async function getProjectsByArea(area: Area): Promise<UIProject[]> {
//   const all = await getProjects();
//   return all.filter((p) => Boolean(p[area]));
// }

// export async function getCounts() {
//   const all = await getProjects();
//   return {
//     leader: all.filter((p) => p.liderazgo).length,
//     dev: all.filter((p) => p.desarrollo).length,
//     design: all.filter((p) => p.diseno).length,
//   };
// }

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
  previewUrl?: string;   // design preview
  figmaUrl?: string;
  githubUrl?: string;
  projectUrl?: string;
  highlights?: string[];
  techStack?: string[];  // dev or design techs
}

export interface UIProject {
  id: string;
  title: string;
  descripcionBreve?: string;
  backgroundUrl?: string;
  logoUrl?: string;

  // Carry-through fields from proyectos.json for Hero, etc.
  slogan?: string;
  proyectoUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;

  area?: Area;
  liderazgo?: UISubSection;
  desarrollo?: UISubSection;
  diseno?: UISubSection;
  resultados?: UIResultado[];
  contenidoAdicional?: UIContenido[];
  tags?: string[];
}

/* -----------------------------------------------------------
 * Utils
 * --------------------------------------------------------- */
const F = {
  async json<T = any>(url: string): Promise<T | null> {
    try {
      // Bypass cache so edits in /public/data/*.json show up immediately
      const r = await fetch(url, { cache: "no-store" });
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
  liderazgoHighlights: [
    "/data/liderazgo-highlight.json",
    "/data/liderazgo-highlights.json",
  ],
  desarrollo: ["/data/desarrollo.json"],
  desarrolloHighlights: [
    "/data/desarrollo-highlight.json",
    "/data/desarrollo-highlights.json",
  ],
  devTechStack: ["/data/dev-tech-stack.json"],
  diseno: ["/data/diseno.json", "/data/diseño.json"],
  disenoHighlights: [
    "/data/diseno-highlight.json",
    "/data/diseño-highlight.json",
    "/data/diseno-highlights.json",
  ],
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

function normalizeProjectRow(row: any): UIProject {
  return {
    id: String(row?.id ?? row?.uuid ?? row?.slug ?? ""),
    title: String(row?.title ?? row?.nombre ?? row?.name ?? "Untitled"),
    descripcionBreve: String(
      row?.descripcion_breve ?? row?.descripcionBreve ?? row?.summary ?? ""
    ),
    backgroundUrl: String(
      row?.background_url ??
        row?.backgroundUrl ??
        row?.background ??
        row?.cover ??
        ""
    ),
    logoUrl: String(row?.logo_url ?? row?.logoUrl ?? row?.logo ?? ""),

    // keep marketing + socials
    slogan: String(row?.slogan ?? ""),
    proyectoUrl: String(row?.proyectoUrl ?? row?.projectUrl ?? ""),
    instagramUrl: String(row?.instagramUrl ?? ""),
    linkedinUrl: String(row?.linkedinUrl ?? ""),
    twitterUrl: String(row?.twitterUrl ?? ""),
    youtubeUrl: String(row?.youtubeUrl ?? ""),
    facebookUrl: String(row?.facebookUrl ?? ""),

    tags: Array.isArray(row?.tags) ? row.tags.map((t: any) => String(t)) : undefined,
  };
}

/* -----------------------------------------------------------
 * Loader
 * --------------------------------------------------------- */
export async function getProjects(): Promise<UIProject[]> {
  /* 1) Proyectos base */
  const proyectosRaw = await loadFirst<any>(PATHS.proyectos);
  const proyectos = (Array.isArray(proyectosRaw?.projects ?? proyectosRaw?.proyectos)
    ? (proyectosRaw?.projects ?? proyectosRaw?.proyectos)
    : proyectosRaw) as any[];
  const base = F.arr(proyectos).map(normalizeProjectRow);

  const byId = new Map<string, UIProject>();
  for (const p of base) byId.set(p.id, { ...p });

  // helper local para listas de IDs (número, string "1, 2 | 3", o array)
  const listFromIds = (v: any): string[] => {
    if (Array.isArray(v)) return v.map((x) => String(x ?? "").trim()).filter(Boolean);
    if (typeof v === "number") return [String(v)];
    if (typeof v === "string") {
      return v.split(/[,\s;|]+/g).map((x) => x.trim()).filter(Boolean);
    }
    return [];
  };

  /* 2) Liderazgo + highlights (tolerant to proyectoId or liderazgoId in highlights) */
  const liderRaw = await loadFirst<any[]>(PATHS.liderazgo);
  const lider = F.arr(liderRaw).map((r) => ({
    proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
    id: String(r?.id ?? ""),
    videoUrl: String(r?.video_url ?? r?.videoUrl ?? ""),
    queHice: String(r?.que_hice ?? r?.queHice ?? ""),
  }));

  // map: proyectoId -> liderazgoId
  const liderByProjectId = new Map<string, string>();
  for (const l of lider) {
    if (l.proyecto_id && l.id) liderByProjectId.set(l.proyecto_id, l.id);
  }

  const liderHlRaw = await loadFirst<any[]>(PATHS.liderazgoHighlights);
  const liderHlNorm = F.arr(liderHlRaw)
    .map((h) => {
      const lid = String(h?.liderazgo_id ?? h?.liderazgoId ?? "");
      const pid = String(h?.proyecto_id ?? h?.proyectoId ?? "");
      const key = lid || (pid ? liderByProjectId.get(pid) ?? "" : "");
      return {
        liderazgo_id: key,
        texto: String(h?.texto ?? h?.text ?? ""),
      };
    })
    .filter((h) => h.liderazgo_id);

  const liderHlByLid = new Map<string, { texto: string }[]>();
  for (const h of liderHlNorm) {
    if (!liderHlByLid.has(h.liderazgo_id)) liderHlByLid.set(h.liderazgo_id, []);
    liderHlByLid.get(h.liderazgo_id)!.push({ texto: h.texto });
  }

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

  /* 3) Desarrollo + highlights + tech stack (by desarrolloId, soporta múltiples IDs) */
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

  // Tech stack: múltiples ids por fila (desarrolloId(s) y/o disenoId(s))
  const devTsRaw = await loadFirst<any[]>(PATHS.devTechStack);

  const devTsByDevSet = new Map<string, Set<string>>();
  const devTsByDesignSet = new Map<string, Set<string>>();

  for (const t of F.arr(devTsRaw)) {
    const tech = String(t?.tech ?? t?.stack ?? "").trim();
    if (!tech) continue;

    const devIds = [
      ...listFromIds(t?.desarrollo_id),
      ...listFromIds(t?.desarrolloId),
      ...listFromIds(t?.desarrolloIds),
    ];
    const dizIds = [
      ...listFromIds(t?.diseno_id),
      ...listFromIds(t?.diseño_id),
      ...listFromIds(t?.disenoId),
      ...listFromIds(t?.disenoIds),
      ...listFromIds(t?.diseñoIds),
    ];

    for (const id of devIds) {
      if (!devTsByDevSet.has(id)) devTsByDevSet.set(id, new Set());
      devTsByDevSet.get(id)!.add(tech);
    }
    for (const id of dizIds) {
      if (!devTsByDesignSet.has(id)) devTsByDesignSet.set(id, new Set());
      devTsByDesignSet.get(id)!.add(tech);
    }
  }

  // sets -> arrays
  const devTsByDev = new Map<string, string[]>();
  for (const [id, set] of devTsByDevSet) devTsByDev.set(id, [...set]);

  const devTsByDesign = new Map<string, string[]>();
  for (const [id, set] of devTsByDesignSet) devTsByDesign.set(id, [...set]);

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
      techStack: devTsByDev.get(d.id) || [],
    };
    p.area ??= "desarrollo";
  }

  /* 4) Diseño + highlights (+ previewUrl + tech stack by disenoId) */
  const dizRaw = await loadFirst<any[]>(PATHS.diseno);
  const diz = F.arr(dizRaw).map((r) => ({
    proyecto_id: String(r?.proyecto_id ?? r?.proyectoId ?? r?.project_id ?? ""),
    id: String(r?.id ?? ""),
    previewUrl: String(r?.preview_url ?? r?.previewUrl ?? r?.preview ?? ""),
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
      previewUrl: d.previewUrl,
      figmaUrl: d.figmaUrl,
      queHice: d.queHice,
      highlights: (dizHlByDid.get(d.id) || []).map((x) => x.texto),
      techStack: devTsByDesign.get(d.id) || [],
    };
    p.area ??= "diseno";
  }

  /* 5) Resultados */
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

  /* 6) Contenido adicional — múltiples proyectoId(s) por fila */
  const caRaw = await loadFirst<any[]>(PATHS.contenidoAdicional);

  // acumuladores por proyecto con de-dupe por (id || href || title|imageUrl)
  const contentByPid = new Map<string, UIContenido[]>();
  const seenKeysByPid = new Map<string, Set<string>>();

  for (const r of F.arr(caRaw)) {
    const pids = [
      ...listFromIds(r?.proyecto_id),
      ...listFromIds(r?.proyectoId),
      ...listFromIds(r?.project_id),
      ...listFromIds(r?.proyectoIds),
      ...listFromIds(r?.projectIds),
      ...listFromIds(r?.proyectos), // alias
    ];
    if (pids.length === 0) continue;

    const item: UIContenido = {
      id: String(r?.id ?? ""),
      imageUrl: String(r?.imagen_url ?? r?.image_url ?? r?.imageUrl ?? r?.imagenUrl ?? ""),
      title: String(r?.titulo ?? r?.title ?? ""),
      description: String(r?.descripcion ?? r?.description ?? ""),
      href: String(r?.enlace ?? r?.link ?? r?.url ?? ""),
    };

    for (const pid of pids) {
      if (!contentByPid.has(pid)) contentByPid.set(pid, []);
      if (!seenKeysByPid.has(pid)) seenKeysByPid.set(pid, new Set());

      const key = item.id || item.href || `${item.title}|${item.imageUrl}`;
      if (seenKeysByPid.get(pid)!.has(key)) continue;

      seenKeysByPid.get(pid)!.add(key);
      contentByPid.get(pid)!.push(item);
    }
  }

  for (const [pid, arr] of contentByPid) {
    const p = byId.get(pid);
    if (!p) continue;
    p.contenidoAdicional = arr;
  }

  return [...byId.values()];
}

/* -----------------------------------------------------------
 * Helpers
 * --------------------------------------------------------- */
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
