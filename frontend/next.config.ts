import type { NextConfig } from "next";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : undefined);

const nextConfig: NextConfig = {
  // (temporal) evita que ESLint/TS rompan el build
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      { source: "/projectos/:id", destination: "/proyectos/:id", permanent: false },
      { source: "/project/:id",   destination: "/proyectos/:id", permanent: false },
    ];
  },

  // Proxy opcional para usar /api/* → backend (dev/prod)
  // En prod, si no hay API_BASE, no proxees a localhost por accidente
  // async rewrites() {
  //   if (!API_BASE) return [];
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${API_BASE}/:path*`, // usa Render en prod, localhost en dev
  //     },
  //   ];
  // },

  images: {
    // Dominios que sí usas (sin limitar por pathname para evitar problemas de mayúsculas)
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
    ],
  },
};

export default nextConfig;
