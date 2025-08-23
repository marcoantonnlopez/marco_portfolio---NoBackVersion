// src/components/organisms/HeroCarousel/SocialIcon.tsx
"use client";

import Link from "next/link";
import {
  Linkedin,
  Github,
  Youtube,
  Instagram,
  Mail as MailIcon,
} from "lucide-react";

const icons = {
  linkedin: <Linkedin size={24} />,
  github:   <Github size={24} />,
  youtube:  <Youtube size={24} />,
  instagram:<Instagram size={24} />,
  mail:     <MailIcon size={24} />,
};

interface SocialIconProps {
  platform: keyof typeof icons;
}

export default function SocialIcon({ platform }: SocialIconProps) {
  const hrefs: Record<string,string> = {
    linkedin:  "https://linkedin.com/in/tu-perfil",
    github:    "https://github.com/tu-usuario",
    youtube:   "https://youtube.com/tu-canal",
    instagram: "https://instagram.com/tu-usuario",
    mail:      "mailto:tu@correo.com",
  };
  return (
    <Link
      href={hrefs[platform]}
      target="_blank"
      className="text-white hover:text-gray-200 transition-colors"
      aria-label={platform}
    >
      {icons[platform]}
    </Link>
  );
}
