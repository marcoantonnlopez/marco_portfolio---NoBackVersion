// frontend/src/components/organisms/ContentCard.tsx
"use client";

import Image from "next/image";
import Button from "../atoms/Button";
import { motion } from "framer-motion";
import type { UIContenido } from "@/lib/projects-loader";

type Props = { item: UIContenido };

export default function ContentCard({ item }: Props) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="relative w-[min(100%,720px)] aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,.45)]"
    >
      {/* Imagen */}
      {item.imageUrl ? (
        <Image
          src={item.imageUrl}
          alt={item.title ?? "Additional content"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 720px"
        />
      ) : (
        <div className="w-full h-full grid place-items-center text-white/40 text-sm">
          No image
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Texto + CTA */}
      <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-4">
        <div className="max-w-[70%]">
          <h4 className="text-white text-xl sm:text-2xl font-extrabold drop-shadow">
            {item.title ?? "Untitled"}
          </h4>
          {item.description && (
            <p className="text-white/85 text-sm sm:text-base leading-snug line-clamp-2">
              {item.description}
            </p>
          )}
        </div>

        {item.href && (
          <Button href={item.href} className="self-start border-white text-white px-4 py-2">
            See more...
          </Button>
        )}
      </div>
    </motion.article>
  );
}
