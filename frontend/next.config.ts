// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // (Opcional mientras limpias errores de TS/ESLint en producción)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async redirects() {
    return [
      { source: "/projectos/:id", destination: "/proyectos/:id", permanent: false },
      { source: "/project/:id",   destination: "/proyectos/:id", permanent: false },
    ];
  },

  // Control fino del caché para los JSON estáticos en /public/data
  async headers() {
    // En prod/previews cachea 10 min en navegador y CDN; en dev no cachea.
    const isProd = process.env.NODE_ENV === "production";
    const cache = isProd
      ? "public, max-age=600, s-maxage=600, stale-while-revalidate=300"
      : "no-store";

    return [
      {
        source: "/data/:path*",
        headers: [
          { key: "Cache-Control", value: cache },
        ],
      },
    ];
  },

  images: {
    // Necesario porque usas SVG remotos (jsDelivr, GitHub raw)
    dangerouslyAllowSVG: true,
    // Endurece la política al permitir SVG remotos
    contentSecurityPolicy:
      "default-src 'self'; img-src * data: blob:; media-src 'none'; script-src 'none'; sandbox;",

    // Dominios desde los que cargas imágenes
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
      // añade otros si los usas (unsplash, vercel, etc.)
      // { protocol: "https", hostname: "images.unsplash.com" },
      // { protocol: "https", hostname: "*.vercel.app" },
    ],
  },
};

export default nextConfig;
