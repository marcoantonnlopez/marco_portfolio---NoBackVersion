// frontend/src/components/molecules/ProjectCard.tsx
"use client";

import Image from "next/image";
import Tag from "../atoms/Tag";
import Button from "../atoms/Button";
import { motion, easeOut } from "framer-motion";

interface Resultado {
  id: string;
  label: string;
  count?: number; // opcional: solo se usa en liderazgo
}

type Variant = "liderazgo" | "desarrollo" | "diseno";

interface ProjectCardProps {
  id: string | number;
  title: string;
  descripcionBreve: string;
  backgroundUrl: string;
  logoUrl: string;
  resultados: Resultado[];
  variant?: Variant;
}

const cardVariant = {
  hidden: { y: 24, opacity: 0, filter: "blur(4px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easeOut },
  },
};

export default function ProjectCard({
  id,
  title,
  descripcionBreve,
  backgroundUrl,
  logoUrl,
  resultados,
  variant = "liderazgo",
}: ProjectCardProps) {
  const projectId = encodeURIComponent(String(id));

  return (
    <motion.article
      variants={cardVariant}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Imagen de fondo */}
      {backgroundUrl ? (
        <Image
          src={backgroundUrl}
          alt={`Background of ${title}`}
          width={1200}
          height={675}
          className="w-full h-[400px] object-cover"
        />
      ) : (
        <div className="w-full h-[400px] bg-gray-800" />
      )}

      {/* Overlay + contenido */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
        <div className="flex items-center mb-3">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={`${title} logo`}
              width={48}
              height={48}
              className="rounded-full p-1 mr-3"
            />
          )}
          <div className="w-px h-8 bg-white/30 mx-3" />
          <h3 className="text-white text-2xl font-semibold">{title}</h3>
        </div>

        <p className="text-white text-sm mb-4">{descripcionBreve}</p>

        {/* Tags por área */}
        {resultados.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resultados.map((r) => (
              <Tag
                key={r.id}
                className="bg-white/20 text-white px-2 py-1 rounded-full text-xs"
              >
                {variant === "liderazgo" && typeof r.count === "number"
                  ? `+${r.count} ${r.label}`
                  : r.label}
              </Tag>
            ))}
          </div>
        )}

        <Button
          href={`/project/${projectId}`}
          className="self-start border-white text-white px-4 py-2"
        >
          Explore project
        </Button>
      </div>
    </motion.article>
  );
}
