// frontend/src/components/organisms/ProjectHero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Link2, Instagram, Linkedin, Twitter, Youtube, Facebook } from "lucide-react";
// (opcional) si usas el loader que te di:
import type { UIProject } from "@/lib/projects-loader";

// Tipo mínimo que usa este componente (sin servicios)
type ProjectHeroData = (UIProject | {
  // si no usas el loader, igual funciona con este shape
  id?: string;
  title: string;
  descripcionBreve?: string;
  backgroundUrl?: string;
  logoUrl?: string;
}) & {
  slogan?: string;
  proyectoUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
};

const fadeIn  = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } };
const zoomIn  = { hidden: { scale: 1.06, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { duration: 1 } } };
const slideUp = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.6, delay: 0.1 } } };

export default function ProjectHero({ project }: { project: ProjectHeroData }) {
  const brand = (project.title || "").split("|")[0].trim().toLowerCase();

  const socials = [
    { href: project.proyectoUrl, Icon: Link2, label: "Website" },
    { href: project.instagramUrl, Icon: Instagram, label: "Instagram" },
    { href: project.linkedinUrl,  Icon: Linkedin,  label: "LinkedIn" },
    { href: project.twitterUrl,   Icon: Twitter,   label: "Twitter/X" },
    { href: project.youtubeUrl,   Icon: Youtube,   label: "YouTube" },
    { href: project.facebookUrl,  Icon: Facebook,  label: "Facebook" },
  ].filter(s => !!s.href);

  return (
    <motion.section
      initial="hidden"
      animate="show"
      className="relative w-full h-[420px] md:h-[380px] lg:h-[420px] overflow-hidden"
    >
      {/* Fondo con zoom-in */}
      <motion.div variants={zoomIn} className="absolute inset-0">
        {project.backgroundUrl && (
          <Image
            src={project.backgroundUrl}
            alt={`${project.title} background`}
            fill
            priority
            className="object-cover"
          />
        )}
      </motion.div>

      {/* Overlay */}
      <motion.div variants={fadeIn} className="absolute inset-0 bg-[#0b0b0b]/70" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(1200px_400px_at_50%_55%,rgba(255,255,255,0.06),transparent_60%)]" />

      {/* Contenido */}
      <div className="relative z-10 h-full flex items.end md:items-end items-center pb-16">
        <div className="mx-auto w-full max-w-4xl px-6 text-center">
          {/* Logo */}
          {project.logoUrl && (
            <motion.div variants={slideUp} className="mx-auto mb-3 relative w-16 h-16 md:w-20 md:h-20">
              <Image src={project.logoUrl} alt={`${brand} logo`} fill className="object-contain" />
            </motion.div>
          )}

          {/* Marca */}
          <motion.div variants={slideUp} className="mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {project.title}
            </h1>
            {project.slogan && (
              <p className="text-lg md:text-xl text-gray-200">{project.slogan}</p>
            )}
          </motion.div>

          {/* Descripción */}
          {project.descripcionBreve && (
            <motion.p variants={slideUp} className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
              {project.descripcionBreve}
            </motion.p>
          )}

          {/* Social Links */}
          {socials.length > 0 && (
            <motion.div variants={slideUp} className="flex justify-center gap-4">
              {socials.map((social, index) => (
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
