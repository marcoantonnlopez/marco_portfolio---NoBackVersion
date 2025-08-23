// app/project/[id]/page.tsx  (ajusta la ruta si es distinta)
"use client";

import { useEffect, useState } from "react";

import ProjectHero from "@/components/organisms/ProjectHero";
import ProjectDetails from "@/components/organisms/ProjectDetails";
import LeaderRoleSection from "@/components/organisms/LeaderRoleSection";
import DevRoleSection from "@/components/organisms/DevRolSection";
import DesignRoleSection from "@/components/organisms/DesignRolSection";
import ContentCarousel from "@/components/organisms/ContentCarousel";

import { getProjects, type UIProject } from "@/lib/projects-loader";

type PageProps = { params: { id: string } };

export default function ProjectPage({ params }: PageProps) {
  const [project, setProject] = useState<UIProject | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Carga proyecto desde /public/data/*
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await getProjects();
        const p = all.find((x) => x.id === params.id) ?? null;
        if (!cancelled) setProject(p);
      } catch (e: any) {
        if (!cancelled) setError(String(e?.message ?? e));
      }
    })();
    return () => { cancelled = true; };
  }, [params.id]);

  // Loading
  if (!project && !error) {
    return (
      <div className="bg-[#121212] min-h-screen text-white flex items-center justify-center">
        <div className="max-w-xl p-6 rounded-xl border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold mb-2">Loading project…</h2>
          <p className="text-white/80">ID: {params.id}</p>
        </div>
      </div>
    );
  }

  // Not found / error
  if (!project) {
    return (
      <div className="bg-[#121212] min-h-screen text-white flex items-center justify-center">
        <div className="max-w-xl p-6 rounded-xl border border-white/20 bg-white/5">
          <h2 className="text-xl font-bold mb-2">Project not found</h2>
          <p className="text-white/80 mb-4">ID: {params.id}</p>
          {error && (
            <pre className="text-xs whitespace-pre-wrap opacity-80">{error}</pre>
          )}
        </div>
      </div>
    );
  }

  // Desestructurar subsecciones (siguiendo el loader)
  const leader  = project.liderazgo;
  const dev     = project.desarrollo;
  const design  = project.diseno;
  const extras  = project.contenidoAdicional ?? [];

  const showLeader = Boolean(leader && (leader.highlights?.length || leader.videoUrl || leader.queHice));
  const showDev    = Boolean(dev && (dev.highlights?.length || dev.videoUrl || dev.queHice || dev.techStack?.length));
  const showDesign = Boolean(design && (design.highlights?.length || design.figmaUrl || design.queHice));

  // Hero recibe también links si los tienes (opcionales)
  const heroProject = {
    id: project.id,
    title: project.title,
    descripcionBreve: project.descripcionBreve,
    backgroundUrl: project.backgroundUrl,
    logoUrl: project.logoUrl,
    slogan: (project as any).slogan,
    // sociales opcionales si existen en tus datos
    proyectoUrl: dev?.projectUrl,
    instagramUrl: (project as any).instagramUrl,
    linkedinUrl: (project as any).linkedinUrl,
    twitterUrl: (project as any).twitterUrl,
    youtubeUrl: (project as any).youtubeUrl,
    facebookUrl: (project as any).facebookUrl,
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <ProjectHero project={heroProject as any} />
      <ProjectDetails project={project as any} />

      {showLeader && leader && (
        <LeaderRoleSection
          title="My role as a leader."
          videoUrl={leader.videoUrl}
          queHice={leader.queHice}
          highlights={leader.highlights ?? []}
        />
      )}

      {showDev && dev && (
        <DevRoleSection
          title="My rol as a dev."
          videoUrl={dev.videoUrl}
          queHice={dev.queHice}
          projectUrl={dev.projectUrl}
          githubUrl={dev.githubUrl}
          figmaUrl={dev.figmaUrl}
          techStack={dev.techStack ?? []}
          highlights={dev.highlights ?? []}
        />
      )}

      {showDesign && design && (
        <DesignRoleSection
          title="My rol as a designer."
          previewUrl={(design as any).previewUrl ?? project.backgroundUrl /* fallback */}
          figmaUrl={design.figmaUrl}
          queHice={design.queHice}
          tools={(design as any).tools ?? []}
          highlights={design.highlights ?? []}
        />
      )}

      {extras.length > 0 && <ContentCarousel items={extras as any} />}
    </div>
  );
}
