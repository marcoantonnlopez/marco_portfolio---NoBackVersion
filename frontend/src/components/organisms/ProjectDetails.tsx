// // frontend/src/components/organisms/ProjectDetails.tsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import {
//   motion,
//   easeOut,
//   useMotionValue,
//   useTransform,
//   useAnimationFrame,
//   animate,
// } from "framer-motion";
// import Image from "next/image";

// /* -------- animated counter -------- */
// function AnimatedNumber({ value }: { value: number }) {
//   const count = useMotionValue(0);
//   useTransform(count, (latest) => Math.floor(latest));
//   const [display, setDisplay] = useState(0);

//   useAnimationFrame(() => setDisplay(Math.floor(count.get())));

//   useEffect(() => {
//     count.set(0);
//     animate(count, value, { duration: 1.8, ease: "easeOut" });
//   }, [value]);

//   return (
//     <motion.div className="text-5xl md:text-6xl text-center font-extrabold">
//       {display}
//     </motion.div>
//   );
// }

// /* -------- animations -------- */
// const container = { hidden: {}, show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } } };
// const card = {
//   hidden: { y: 18, opacity: 0, filter: "blur(4px)" },
//   show: { y: 0, opacity: 1, filter: "blur(0px)", transition: { duration: 0.55, ease: easeOut } },
// };
// const block = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } } };
// const metric = { hidden: { opacity: 0, y: 12, scale: 0.98 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } } };

// /* -------- helpers -------- */
// const s = (v: any) => (v == null ? "" : String(v));

// type Resultado = {
//   id: string | number;
//   label: string;
//   description?: string;
//   count?: number;
//   valor?: number | string;
//   orden?: number;
// };

// function normalizeResultados(raw: any): Resultado[] {
//   const arr = Array.isArray(raw) ? raw : [];
//   return arr.map((r: any, i: number) => {
//     const id = s(r?.id ?? i);
//     const label = s(r?.label ?? r?.descripcion ?? r?.description ?? r?.texto ?? r?.text ?? r?.valor ?? "");
//     const description = r?.description ?? r?.descripcion ?? undefined;
//     let count: number | undefined = undefined;

//     if (typeof r?.count === "number" && Number.isFinite(r.count)) {
//       count = r.count;
//     } else if (r?.valor != null) {
//       const n = Number(String(r.valor).replace(/,/g, ""));
//       if (Number.isFinite(n)) count = n;
//     }
//     return { id, label, description, count, valor: r?.valor, orden: r?.orden };
//   });
// }

// /** Extrae número de `count` o desde el label. Soporta "2,500", "1.2k", "3.4M", "200+" */
// function numberFromResultado(r: Resultado): number {
//   if (typeof r.count === "number" && Number.isFinite(r.count)) return r.count;

//   const label = s(r.label).toLowerCase().trim();
//   const km = label.match(/(-?\d+(?:[\.,]\d+)?)\s*([kKmM])/);
//   if (km) {
//     const n = Number(km[1].replace(",", "."));
//     const mul = km[2].toLowerCase() === "m" ? 1_000_000 : 1_000;
//     return Math.round(n * mul);
//   }
//   const plain = label.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
//   return plain ? Math.floor(Number(plain[0])) : 0;
// }

// // fetch helper con no-store en dev
// async function loadJson<T = any>(url: string): Promise<T | null> {
//   try {
//     const r = await fetch(url, {
//       cache: process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
//     });
//     if (!r.ok) return null;
//     return (await r.json()) as T;
//   } catch {
//     return null;
//   }
// }

// // Une preferentemente los valores ya presentes en 'base'; solo rellena cuando falta
// function mergePreferBase<T extends Record<string, any>>(base: T, extra?: Partial<T> | null): T {
//   if (!extra) return base;
//   const out: any = { ...base };
//   for (const k of Object.keys(extra)) {
//     if (out[k] == null || out[k] === "") out[k] = (extra as any)[k];
//   }
//   return out;
// }

// export default function ProjectDetails({ project }: { project: any }) {
//   // 1) Partimos del objeto que recibes desde el padre (puede venir “recortado”)
//   const [hydrated, setHydrated] = useState<any>(project);

//   // 2) Si faltan campos clave y hay id, hacemos fallback al JSON maestro
//   useEffect(() => {
//     const needs =
//       !project?.proposito ||
//       !project?.inicio ||
//       !project?.historiaBreve ||
//       !project?.segundaImagenUrl ||
//       project?.slogan == null; // también aseguramos slogan
//     if (!needs || project?.id == null) return;

//     let cancelled = false;
//     (async () => {
//       const all = (await loadJson<any[]>("/data/proyectos.json")) ?? [];
//       const full = Array.isArray(all)
//         ? all.find((p) => String(p?.id) === String(project.id))
//         : null;
//       if (!cancelled) {
//         setHydrated((prev: any) => mergePreferBase(prev ?? {}, full ?? null));
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [project]);

//   // 3) Normalizamos sobre el objeto ya hidratado (separamos slogan y descripcionBreve)
//   const p = useMemo(() => {
//     const record = hydrated ?? project ?? {};
//     return {
//       id: record?.id,
//       title: s(record?.title ?? record?.nombre ?? "Untitled"),
//       slogan: s(record?.slogan ?? ""), // ← separado
//       descripcionBreve: s(
//         record?.descripcionBreve ?? record?.descripcion_breve ?? record?.descripcion ?? ""
//       ),
//       proposito: s(record?.proposito ?? record?.propositoGeneral ?? record?.purpose ?? ""),
//       inicio: s(record?.inicio ?? record?.startedAt ?? record?.origen ?? ""),
//       historiaBreve: s(record?.historiaBreve ?? record?.story ?? ""),
//       segundaImagenUrl: s(record?.segundaImagenUrl ?? record?.secondImageUrl ?? record?.secondImage ?? ""),
//       backgroundUrl: s(record?.backgroundUrl ?? record?.background_url ?? ""),
//       logoUrl: s(record?.logoUrl ?? record?.logo_url ?? ""),
//       resultados: normalizeResultados(record?.resultados),
//     };
//   }, [hydrated, project]);

//   const resultados = p.resultados;
//   const hasResultados = resultados.length > 0;

//   const storyParagraphs = p.historiaBreve
//     .split("\n")
//     .map((x) => x.trim())
//     .filter(Boolean);

//   const brand = s(p.title).split("|")[0].trim() || s(p.title);

//   return (
//     <section className="max-w-6xl mx-auto px-6 py-12">
//       {/* 3 tarjetas superiores */}
//       <motion.div
//         variants={container}
//         initial="hidden"
//         whileInView="show"
//         viewport={{ once: true, amount: 0.3 }}
//         className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]"
//       >
//         <motion.article
//           variants={card}
//           whileHover={{ y: -4, scale: 1.01 }}
//           transition={{ type: "spring", stiffness: 220, damping: 18 }}
//           className="rounded-3xl bg-[#1a1a1a] p-6 md:p-8 border border-white/5"
//         >
//           <h3 className="text-2xl md:text-3xl font-extrabold">
//             What is {brand}?
//           </h3>
//           <p className="text-white/85 leading-relaxed mt-3">
//             {p.descripcionBreve}
//           </p>
//         </motion.article>

//         <motion.article
//           variants={card}
//           whileHover={{ y: -4, scale: 1.01 }}
//           transition={{ type: "spring", stiffness: 220, damping: 18 }}
//           className="rounded-3xl bg-[#1a1a1a] p-6 md:p-8 border border-white/5"
//         >
//           <h3 className="text-2xl md:text-3xl font-extrabold mb-3">The purpose</h3>
//           <p className="text-white/85 leading-relaxed">
//             {p.proposito || <span className="text-white/50">No purpose provided.</span>}
//           </p>
//         </motion.article>

//         <motion.article
//           variants={card}
//           whileHover={{ y: -4, scale: 1.01 }}
//           transition={{ type: "spring", stiffness: 220, damping: 18 }}
//           className="rounded-3xl bg-[#1a1a1a] p-6 md:p-8 border border-white/5"
//         >
//           <h3 className="text-2xl md:text-3xl font-extrabold mb-3">The beginning</h3>
//           <p className="text-white/85 leading-relaxed">
//             {p.inicio || <span className="text-white/50">No starting note.</span>}
//           </p>
//         </motion.article>
//       </motion.div>

//       {/* Panel grande "The result" */}
//       {hasResultados && (
//         <motion.div
//           variants={block}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.3 }}
//           className="rounded-3xl bg-[#1a1a1a] p-6 md:p-10 border border-white/5 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)] "
//         >
//           <h3 className="text-center text-3xl md:text-4xl font-extrabold mb-8">The result</h3>

//           <motion.div
//             variants={container}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, amount: 0.3 }}
//             className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10"
//           >
//             {resultados.map((r) => {
//               const value = numberFromResultado(r);
//               return (
//                 <motion.div key={r.id} variants={metric} className="flex flex-col">
//                   <AnimatedNumber value={value} />
//                   <div className="w-4/5 h-[2px] bg-white/40 mt-3 mb-2 mx-auto" />
//                   {r.description && (
//                     <p className="text-white/60 text-sm mt-1 text-center">{r.description}</p>
//                   )} 
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         </motion.div>
//       )}

//       {/* The story */}
//       <motion.div
//         variants={block}
//         initial="hidden"
//         whileInView="show"
//         viewport={{ once: true, amount: 0.3 }}
//         className="mt-14"
//       >
//         <div className="md:flex items-start gap-5 md:gap-12 pt-16 pb-16">
//           <h3 className="text-right md:text-right text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight text-white md:basis-5/12 md:self-center">
//             The story
//           </h3>

//           <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
//           <div className="md:hidden h-px my-8 bg-white/10" />

//           <div className="md:basis-7/12 text-white/85 text-lg md:text-xl leading-relaxed [text-wrap:balance]">
//             {storyParagraphs.length > 0 ? (
//               storyParagraphs.map((pTxt, i) => <p key={i} className={i ? "mt-4" : ""}>{pTxt}</p>)
//             ) : (
//               <p className="text-white/60">No story yet.</p>
//             )}
//           </div>
//         </div>
//       </motion.div>

//       {/* Imagen 2 */}
//       {p.segundaImagenUrl && (
//         <motion.div
//           variants={block}
//           initial="hidden"
//           whileInView="show"
//           viewport={{ once: true, amount: 0.3 }}
//           className="mt-10"
//         >
//           <div className="relative w-full aspect-[8/4] rounded-2xl overflow-hidden bg-white/5">
//             <Image
//               src={p.segundaImagenUrl}
//               alt={`${p.title} secondary`}
//               fill
//               className="object-cover"
//             />
//           </div>
//         </motion.div>
//       )}
//     </section>
//   );
// }



// frontend/src/components/organisms/ProjectDetails.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  motion,
  easeOut,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  animate,
} from "framer-motion";
import Image from "next/image";

/* -------- animated counter -------- */
function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  // (kept so the value is clamped to integers even if you ever read it via transform)
  useTransform(count, (latest) => Math.floor(latest));
  const [display, setDisplay] = useState(0);

  useAnimationFrame(() => setDisplay(Math.floor(count.get())));

  useEffect(() => {
    count.set(0);
    animate(count, value, { duration: 1.8, ease: "easeOut" });
  }, [value]);

  return (
    <motion.div className="text-5xl md:text-6xl text-center font-extrabold">
      {display}
    </motion.div>
  );
}

/* -------- animations -------- */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};
const card = {
  hidden: { y: 18, opacity: 0, filter: "blur(4px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: easeOut },
  },
};
const block = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};
const metric = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45 } },
};

/* -------- helpers -------- */
const s = (v: any) => (v == null ? "" : String(v));

type Resultado = {
  id: string | number;
  label: string;
  description?: string;
  count?: number;
  valor?: number | string;
  orden?: number;
};

function normalizeResultados(raw: any): Resultado[] {
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((r: any, i: number) => {
    const id = s(r?.id ?? i);
    const label = s(
      r?.label ??
        r?.descripcion ??
        r?.description ??
        r?.texto ??
        r?.text ??
        r?.valor ??
        ""
    );
    const description = r?.description ?? r?.descripcion ?? undefined;

    let count: number | undefined;
    if (typeof r?.count === "number" && Number.isFinite(r.count)) {
      count = r.count;
    } else if (r?.valor != null) {
      const n = Number(String(r.valor).replace(/,/g, ""));
      if (Number.isFinite(n)) count = n;
    }
    return { id, label, description, count, valor: r?.valor, orden: r?.orden };
  });
}

/** Extrae número de `count` o desde el label. Soporta "2,500", "1.2k", "3.4M", "200+" */
function numberFromResultado(r: Resultado): number {
  if (typeof r.count === "number" && Number.isFinite(r.count)) return r.count;

  const label = s(r.label).toLowerCase().trim();
  // sufijos k/m
  const km = label.match(/(-?\d+(?:[\.,]\d+)?)\s*([kKmM])/);
  if (km) {
    const n = Number(km[1].replace(",", "."));
    const mul = km[2].toLowerCase() === "m" ? 1_000_000 : 1_000;
    return Math.round(n * mul);
  }
  // número simple (con separadores)
  const plain = label.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  return plain ? Math.floor(Number(plain[0])) : 0;
}

// fetch helper (no-store en dev, cacheable en prod)
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

// Intenta /data/proyectos.json y /data/db.json, aceptando array o {proyectos|projects}
async function loadFullProjects(): Promise<any[]> {
  const candidates = ["/data/proyectos.json", "/data/db.json"];
  for (const url of candidates) {
    const raw = await loadJson<any>(url);
    if (!raw) continue;
    const arr = Array.isArray(raw)
      ? raw
      : raw?.proyectos || raw?.projects || raw?.items || raw?.data;
    if (Array.isArray(arr)) return arr;
  }
  return [];
}

// Une preferentemente los valores ya presentes en 'base'; solo rellena cuando falta
function mergePreferBase<T extends Record<string, any>>(
  base: T,
  extra?: Partial<T> | null
): T {
  if (!extra) return base;
  const out: any = { ...base };
  for (const k of Object.keys(extra)) {
    if (out[k] == null || out[k] === "") out[k] = (extra as any)[k];
  }
  return out;
}

export default function ProjectDetails({ project }: { project: any }) {
  // 1) Partimos del objeto que recibes desde el padre (puede venir “recortado”)
  const [hydrated, setHydrated] = useState<any>(project);

  // 2) Si faltan campos clave y hay id, hacemos fallback a /public/data/*
  useEffect(() => {
    const needs =
      !project?.proposito ||
      !project?.inicio ||
      !project?.historiaBreve ||
      !project?.segundaImagenUrl ||
      project?.slogan == null; // también aseguramos slogan
    if (!needs || project?.id == null) return;

    let cancelled = false;
    (async () => {
      const all = await loadFullProjects();
      const full = all.find((p) => String(p?.id) === String(project.id)) || null;
      if (!cancelled) {
        setHydrated((prev: any) => mergePreferBase(prev ?? {}, full ?? null));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [project]);

  // 3) Normalizamos sobre el objeto ya hidratado
  const p = useMemo(() => {
    const record = hydrated ?? project ?? {};
    return {
      id: record?.id,
      title: s(record?.title ?? record?.nombre ?? "Untitled"),
      slogan: s(record?.slogan ?? ""),
      descripcionBreve: s(
        record?.descripcionBreve ??
          record?.descripcion_breve ??
          record?.descripcion ??
          ""
      ),
      proposito: s(
        record?.proposito ?? record?.propositoGeneral ?? record?.purpose ?? ""
      ),
      inicio: s(record?.inicio ?? record?.startedAt ?? record?.origen ?? ""),
      historiaBreve: s(record?.historiaBreve ?? record?.story ?? ""),
      segundaImagenUrl: s(
        record?.segundaImagenUrl ??
          record?.secondImageUrl ??
          record?.secondImage ??
          ""
      ),
      backgroundUrl: s(record?.backgroundUrl ?? record?.background_url ?? ""),
      logoUrl: s(record?.logoUrl ?? record?.logo_url ?? ""),
      resultados: normalizeResultados(record?.resultados),
    };
  }, [hydrated, project]);

  const resultados = p.resultados;
  const hasResultados = resultados.length > 0;

  const storyParagraphs = p.historiaBreve
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

  const brand = s(p.title).split("|")[0].trim() || s(p.title);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* 3 tarjetas superiores */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)]"
      >
        <motion.article
          variants={card}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="rounded-3xl bg-[#1a1a1a] p-6 md:p-8 border border-white/5"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold">
            What is {brand}?
          </h3>
          <p className="text-white/85 leading-relaxed mt-3">
            {p.descripcionBreve}
          </p>
        </motion.article>

        <motion.article
          variants={card}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="rounded-3xl bg-[#1a1a1a] p-6 md:p-8 border border-white/5"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
            The purpose
          </h3>
          <p className="text-white/85 leading-relaxed">
            {p.proposito || (
              <span className="text-white/50">No purpose provided.</span>
            )}
          </p>
        </motion.article>

        <motion.article
          variants={card}
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="rounded-3xl bg-[#1a1a1a] p-6 md:p-8 border border-white/5"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
            The beginning
          </h3>
          <p className="text-white/85 leading-relaxed">
            {p.inicio || <span className="text-white/50">No starting note.</span>}
          </p>
        </motion.article>
      </motion.div>

      {/* Panel grande "The result" */}
      {hasResultados && (
        <motion.div
          variants={block}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-3xl bg-[#1a1a1a] p-6 md:p-10 border border-white/5 drop-shadow-[0_0_5px_rgba(255,255,255,0.6)] "
        >
          <h3 className="text-center text-3xl md:text-4xl font-extrabold mb-8">
            The result
          </h3>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10"
          >
            {resultados.map((r) => {
              const value = numberFromResultado(r);
              return (
                <motion.div key={r.id} variants={metric} className="flex flex-col">
                  <AnimatedNumber value={value} />
                  <div className="w-4/5 h-[2px] bg-white/40 mt-3 mb-2 mx-auto" />
                  {/* Always show the main label */}
                  <p className="text-white/80 leading-snug text-center">{r.label}</p>
                  {/* Optional supporting text */}
                  {r.description && (
                    <p className="text-white/60 text-sm mt-1 text-center">
                      {r.description}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {/* The story */}
      <motion.div
        variants={block}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-14"
      >
        <div className="md:flex items-start gap-5 md:gap-12 pt-16 pb-16">
          <h3 className="text-right md:text-right text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight text-white md:basis-5/12 md:self-center">
            The story
          </h3>

          <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-white/0 via-white/20 to-white/0" />
          <div className="md:hidden h-px my-8 bg-white/10" />

          <div className="md:basis-7/12 text-white/85 text-lg md:text-xl leading-relaxed [text-wrap:balance]">
            {storyParagraphs.length > 0 ? (
              storyParagraphs.map((pTxt, i) => (
                <p key={i} className={i ? "mt-4" : ""}>
                  {pTxt}
                </p>
              ))
            ) : (
              <p className="text-white/60">No story yet.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Imagen 2 */}
      {p.segundaImagenUrl && (
        <motion.div
          variants={block}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10"
        >
          <div className="relative w-full aspect-[8/4] rounded-2xl overflow-hidden bg-white/5">
            <Image
              src={p.segundaImagenUrl}
              alt={`${p.title} secondary`}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
