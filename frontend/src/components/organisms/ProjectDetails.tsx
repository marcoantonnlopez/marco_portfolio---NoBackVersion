// frontend/src/components/organisms/ProjectDetails.tsx
"use client";

import { useEffect, useState } from "react";
import {
  motion,
  easeOut,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  animate,
} from "framer-motion";
import Image from "next/image";
import type { UIProject, UIResultado } from "@/lib/projects-loader";

function AnimatedNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest)); // (si lo quieres usar en UI)
  const [display, setDisplay] = useState(0);

  useAnimationFrame(() => {
    setDisplay(Math.floor(count.get()));
  });

  useEffect(() => {
    count.set(0);
    animate(count, value, { duration: 3.3, ease: "easeOut" });
  }, [value]);

  return (
    <motion.div className="text-5xl md:text-6xl text-center font-extrabold">
      {display}
    </motion.div>
  );
}

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

// Intenta extraer número si no viene `count` (p.ej., de "200+ members")
function numberFromResultado(r: UIResultado): number {
  if (typeof r.count === "number") return r.count;
  const m = String(r.label ?? "").match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : 0;
}

export default function ProjectDetails({ project }: { project: UIProject }) {
  const resultados: UIResultado[] = Array.isArray(project.resultados)
    ? project.resultados
    : [];

  const hasResultados = resultados.length > 0;

  const storyParagraphs = String((project as any).historiaBreve ?? "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const proposito = (project as any).proposito ?? "";
  const inicio = (project as any).inicio ?? "";
  const segundaImagenUrl = (project as any).segundaImagenUrl ?? "";

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
          <h3 className="text-2xl md:text-3xl font-extrabold mb-3">
            What is {project.title.split("|")[0].trim()}?
          </h3>
          <p className="text-white/85 leading-relaxed">
            {project.descripcionBreve}
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
          <p className="text-white/85 leading-relaxed">{proposito}</p>
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
          <p className="text-white/85 leading-relaxed">{inicio}</p>
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

          {/* Grid de métricas */}
          {resultados.length === 0 ? (
            <p className="text-white/60 text-center">No results yet.</p>
          ) : (
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
                    <p className="text-white/80 leading-snug text-center">
                      {r.label}
                    </p>
                    {r.description && (
                      <p className="text-white/60 text-sm mt-1 text-center">
                        {r.description}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
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
              storyParagraphs.map((p, i) => (
                <p key={i} className={i ? "mt-4" : ""}>
                  {p}
                </p>
              ))
            ) : (
              <p className="text-white/60">No story yet.</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Imagen 2 */}
      {segundaImagenUrl && (
        <motion.div
          variants={block}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10"
        >
          <div className="relative w-full aspect-[8/4] rounded-2xl overflow-hidden bg-white/5">
            <Image
              src={segundaImagenUrl}
              alt={`${project.title} secondary`}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
