// frontend/src/components/organisms/ProjectHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Link2, Instagram, Linkedin, Twitter, Youtube, Facebook } from "lucide-react";
import type { UIProject } from "@/lib/projects-loader";

// Tipo mínimo que usa este componente (compatible con UIProject y objetos “sueltos”)
type ProjectHeroData =
  | UIProject
  | ({
      id?: string | number;
      title: string;
      descripcionBreve?: string;
      backgroundUrl?: string;
      logoUrl?: string;
      slogan?: string;
      // enlaces toplevel
      proyectoUrl?: string;
      projectUrl?: string;
      instagramUrl?: string;
      linkedinUrl?: string;
      twitterUrl?: string;
      youtubeUrl?: string;
      facebookUrl?: string;
      // opcional: contenedor de links
      links?: Partial<{
        website: string;
        instagram: string;
        linkedin: string;
        twitter: string;
        youtube: string;
        facebook: string;
      }>;
      // por si vienen anidados desde sub-secciones
      desarrollo?: Partial<{ projectUrl: string }>;
    } & Record<string, any>);

const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } };
const zoomIn = { hidden: { scale: 1.06, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 1 } } };
const slideUp = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 0.1 } },
};

// helper para leer con múltiples llaves/fallbacks
function pick(...vals: Array<any>) {
  for (const v of vals) {
    const s = typeof v === "string" ? v : "";
    if (s && s.trim().length > 0) return s;
  }
  return "";
}

export default function ProjectHero({ project }: { project: ProjectHeroData }) {
  const brand = String(project.title || "").split("|")[0].trim();
  const brandSlugForAlt = brand.toLowerCase();

  // Website puede venir con distintos nombres o anidado
  const website = pick(
    (project as any).proyectoUrl,
    (project as any).projectUrl,
    (project as any)?.desarrollo?.projectUrl,
    (project as any)?.links?.website
  );

  // Redes sociales: aceptar toplevel o en "links"
  const instagram = pick((project as any).instagramUrl, (project as any)?.links?.instagram);
  const linkedin = pick((project as any).linkedinUrl, (project as any)?.links?.linkedin);
  const twitter = pick((project as any).twitterUrl, (project as any)?.links?.twitter);
  const youtube = pick((project as any).youtubeUrl, (project as any)?.links?.youtube);
  const facebook = pick((project as any).facebookUrl, (project as any)?.links?.facebook);

  const socials = [
    { href: website, Icon: Link2, label: "Website" },
    { href: instagram, Icon: Instagram, label: "Instagram" },
    { href: linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: twitter, Icon: Twitter, label: "Twitter/X" },
    { href: youtube, Icon: Youtube, label: "YouTube" },
    { href: facebook, Icon: Facebook, label: "Facebook" },
  ].filter((s) => Boolean(s.href));

  return (
    <motion.section initial="hidden" animate="show" className="relative w-full h-[420px] md:h-[380px] lg:h-[420px] overflow-hidden">
      {/* Fondo con zoom-in */}
      <motion.div variants={zoomIn} className="absolute inset-0">
        {project.backgroundUrl && (
          <Image
            src={project.backgroundUrl}
            alt={`${brand} background`}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
      </motion.div>

      {/* Overlay */}
      <motion.div variants={fadeIn} className="absolute inset-0 bg-[#0b0b0b]/70" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(1200px_400px_at_50%_55%,rgba(255,255,255,0.06),transparent_60%)]" />

      {/* Contenido */}
      <div className="relative z-10 h-full flex items-end pb-16">
        <div className="mx-auto w-full max-w-4xl px-6 text-center">
          {/* Logo */}
          {project.logoUrl && (
            <motion.div variants={slideUp} className="mx-auto mb-3 relative w-16 h-16 md:w-20 md:h-20">
              <Image src={project.logoUrl} alt={`${brandSlugForAlt} logo`} fill className="object-contain" sizes="80px" />
            </motion.div>
          )}

          {/* Título + Slogan (slogan bajo el título) */}
          <motion.div variants={slideUp} className="mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">{brand}</h1>
            {/* usar slogan; si falta, no mostramos nada aquí (la descripción va en ProjectDetails) */}
            {Boolean((project as any).slogan) && (
              <p className="text-white/80 leading-snug text-center">{(project as any).slogan}</p>
            )}
          </motion.div>

          {/* Descripción breve: NO va aquí; se muestra en ProjectDetails (“What is …?”) */}

          {/* Social Links */}
          {socials.length > 0 && (
            <motion.div variants={slideUp} className="flex justify-center gap-3">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <social.Icon className="w-5 h-5 text-white" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
