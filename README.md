```markdown
# Marco Portfolio — No-Backend (Next.js + JSON)

> A **100% frontend** portfolio built with **Next.js 15, TypeScript, Tailwind, and Framer Motion**.  
> All dynamic content is loaded from **`/public/data`** JSON files. **No server or database** required.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model (JSON)](#data-model-json)
- [Architecture & Data Flow](#architecture--data-flow)
- [UI Logic](#ui-logic)
- [Run Locally](#run-locally)
- [Build & Production](#build--production)
- [Deploy to Vercel](#deploy-to-vercel)
- [Add / Edit Projects](#add--edit-projects)
- [Remote Images (Next Image)](#remote-images-next-image)
- [Troubleshooting (FAQ)](#troubleshooting-faq)
- [Scripts](#scripts)
- [License](#license)

---

## Features

- **Home**
  - Animated hero (role rotation).
  - **Counters** of projects by area (Leadership / Development / Design).
- **Sections** `/section?type=leader|dev|designer`
  - **Grid** of projects per area with **area-specific tags**.
- **Area Carousels**
  - Three **handpicked projects by ID** + a 4th card “See all projects”.
- **Project Page** `/proyectos/[id]`
  - Hero with brand, logo, background, slogan, and social links.
  - **ProjectDetails** (Purpose, Beginning, Story + animated metrics).
  - Role sections: **Leader / Dev / Design**.
  - **Content Carousel** with external links per project.
- **No backend**: JSON fetch + tolerant normalization for key names.

---

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS**
- **Framer Motion**
- **lucide-react**
- **pnpm** (recommended) / npm / yarn

---

## Project Structure

```

.
├─ app/
│  ├─ page.tsx                      # Home
│  ├─ section/page.tsx              # /section?type=leader|dev|designer
│  └─ proyectos/\[id]/page.tsx       # Project page
├─ components/
│  ├─ atoms/
│  ├─ molecules/
│  │  ├─ PassionCard.tsx
│  │  └─ ProjectCard.tsx
│  └─ organisms/
│     ├─ HeroCarousel.tsx
│     ├─ SectionProjectsGrid.tsx
│     ├─ LeaderCarousel.tsx / DevCarousel.tsx / DesignCarousel.tsx
│     ├─ ProjectHero.tsx
│     ├─ ProjectDetails.tsx
│     ├─ LeaderRoleSection.tsx / DevRolSection.tsx / DesignRolSection.tsx
│     └─ ContentCarousel.tsx / ContentCard.tsx
├─ lib/
│  └─ projects-loader.ts            # Merges & normalizes all JSON tables
├─ public/
│  └─ data/
│     ├─ proyectos.json
│     ├─ liderazgo.json
│     ├─ desarrollo.json
│     ├─ diseno.json
│     ├─ desarrollo-highlight.json
│     ├─ diseno-highlight.json
│     ├─ dev-tech-stack.json
│     ├─ resultado-proyecto.json
│     └─ contenido-adicional.json
├─ next.config.ts
└─ package.json

````

> In production, **ensure** `public/data` exists under the **build root**.

---

## Data Model (JSON)

### `proyectos.json` (base projects)
Common keys are normalized; aliases like `backgroundUrl|background_url` and `logoUrl|logo_url` are supported.

```json
[
  {
    "id": 1,
    "title": "Studevs",
    "slogan": "From curious learners to tech visionaries.",
    "backgroundUrl": "https://.../BG_card.svg",
    "logoUrl": "https://.../logo.svg",
    "descripcionBreve": "A launchpad turning curious CS students into tech builders.",
    "proposito": "To unlock top-tier experiences...",
    "inicio": "Started after our first hackathon...",
    "historiaBreve": "Multiline text...\nMore text...",
    "segundaImagenUrl": "https://.../BG.svg",
    "areas": ["liderazgo", "desarrollo", "diseno"],
    "instagramUrl": "...", "linkedinUrl": "...", "twitterUrl": "...",
    "youtubeUrl": "...",  "facebookUrl": "..."
  }
]
````

### Sub-tables by area

```json
// liderazgo.json
[{ "id": 1, "proyectoId": 1, "videoUrl": "", "queHice": "..." }]

// desarrollo.json
[{
  "id": 1, "proyectoId": 1,
  "videoUrl": "", "projectUrl": "", "githubUrl": "", "figmaUrl": "", "queHice": "..."
}]

// diseno.json
[{
  "id": 1, "proyectoId": 1,
  "previewUrl": "https://...", "figmaUrl": "", "queHice": "..."
}]
```

### Highlights & Tech Stack

```json
// desarrollo-highlight.json
[{ "id": 1, "desarrolloId": 1, "texto": "CI/CD pipeline" }]

// diseno-highlight.json
[{ "id": 1, "disenoId": 1, "texto": "Design system v1" }]

// dev-tech-stack.json
[
  { "id": 1, "desarrolloId": 1, "disenoId": "", "tech": "AngularJS" },
  { "id": 2, "desarrolloId": "", "disenoId": 1, "tech": "Figma" },
  { "id": 3, "desarrolloId": "", "disenoId": 1, "tech": "Atomic design" }
]
```

### Results & Extra Content

```json
// resultado-proyecto.json
[
  { "id": 1, "proyectoId": 1, "orden": 1, "valor": 160, "descripcion": "members" },
  { "id": 2, "proyectoId": 1, "orden": 2, "valor": "14+", "descripcion": "events" }
]

// contenido-adicional.json
[
  {
    "id": 1, "proyectoId": 1,
    "imagenUrl": "https://.../image.svg",
    "titulo": "Press feature",
    "descripcion": "Short summary",
    "enlace": "https://external.link"
  }
]
```

> The loader supports **aliases**:
> `imagen_url | imagenUrl | image_url | imageUrl`, `titulo | title`, `descripcion | description`, `enlace | link | url`, etc.

---

## Architecture & Data Flow

* UI components do **not** call services. They `fetch('/data/*.json')`.
* **`lib/projects-loader.ts`** centralizes **loading + normalization**:

  * Joins `proyectos.json` with sub-tables: liderazgo, desarrollo, diseño.
  * Resolves `highlights`, `techStack`, `resultados`, `contenidoAdicional`.
  * Accepts **key aliases** to avoid breaking UI if JSON names change.
* In **dev** it uses `cache: "no-store"`; in **prod** it uses `force-cache`.

---

## UI Logic

### Home (HeroCarousel)

* **Counters**: count projects per area from `proyectos.json`.
* Role and gallery rotate with Framer Motion.

### `/section?type=leader|dev|designer` (SectionProjectsGrid)

* Filters `proyectos.json` by `areas` including `"liderazgo" | "desarrollo" | "diseno"`.
* **Card tags** are area-specific:

  * **liderazgo** → top 3 **results** from `resultado-proyecto.json` by `proyectoId`.
  * **desarrollo** → 3 techs from `dev-tech-stack.json` by **`desarrolloId`**.
  * **diseno** → 2 highlights from `diseno-highlight.json` by **`disenoId`**.

### Area Carousels

* Show 3 **curated IDs** + a 4th “See all projects” card.

### Project Page `/proyectos/[id]`

* **ProjectHero**: brand/logo/background/slogan/social.
* **ProjectDetails**:

  * `proposito`, `inicio`, `historiaBreve`, `segundaImagenUrl`.
  * Metrics from `resultados` (falls back to parsing numbers from text if needed).
* **Design** section uses `previewUrl` from `diseno.json` and tools from `dev-tech-stack.json` via **`disenoId`**.

---

## Run Locally

### Requirements

* Node **18+** (20+ recommended)
* pnpm (recommended) — npm/yarn also work

### Install

```bash
pnpm i
```

### Dev server

```bash
pnpm dev
# open http://localhost:3000
```

### Production build

```bash
pnpm build
pnpm start
```

---

## Build & Production

* **Dev**: `cache: "no-store"` ⇒ always reads the latest JSON.
* **Prod**: `force-cache` ⇒ faster.
* To invalidate cache in prod: hard refresh / redeploy / change JSON path if you need instant invalidation.

---

## Deploy to Vercel

### A) Single repo (no monorepo)

1. Ensure **`public/data/*.json`** exists at repo **root**.
2. Connect repo → **Deploy**.

### B) Monorepo (e.g. folder `frontend/`)

1. In Vercel → **Settings → General → Root Directory** = `frontend`.
2. Ensure **`frontend/public/data`** is committed.
3. Deploy.
4. Verify these **public endpoints** don’t 404:

   * `https://<your-domain>/data/proyectos.json`
   * `https://<your-domain>/data/contenido-adicional.json`

> If you get **404**, your **Root Directory** is likely wrong or `public/data` is missing at that root.

### Recommended `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.jsdelivr.net" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" }
    ]
  },
  async redirects() {
    return [
      { source: "/projectos/:id", destination: "/proyectos/:id", permanent: false },
      { source: "/project/:id",   destination: "/proyectos/:id", permanent: false }
    ];
  }
};
export default nextConfig;
```

---

## Add / Edit Projects

1. Add an object to **`public/data/proyectos.json`**:

   * Include the relevant areas: `"areas": ["liderazgo", "desarrollo", "diseno"]`.
   * Optional fields: `slogan`, `proposito`, `inicio`, `historiaBreve`, `segundaImagenUrl`, socials, etc.
2. (Optional) Add rows in **sub-tables**:

   * `liderazgo.json` / `desarrollo.json` / `diseno.json` (by **`proyectoId`**).
   * `desarrollo-highlight.json` (by **`desarrolloId`**), `diseno-highlight.json` (by **`disenoId`**).
   * `dev-tech-stack.json`: use **`desarrolloId`** for Dev tools, **`disenoId`** for Design tools.
   * `resultado-proyecto.json` (by **`proyectoId`**).
   * `contenido-adicional.json` (by **`proyectoId`**).
3. (Optional) If you want a project in **carousels**, add its **ID** to the curated arrays in the carousel components.

---

## Remote Images (Next Image)

* Allow external hosts in `next.config.ts → images.remotePatterns`.
* Current hosts:

  * `cdn.jsdelivr.net`
  * `raw.githubusercontent.com`
  * `github.com`
* Add more if you change CDNs/hosts.

---

## Troubleshooting (FAQ)

**1) 404 for `/data/*.json` on Vercel**
**Cause:** Wrong Root Directory or `public/data` missing at that root.
**Fix:** Set **Root Directory** properly (e.g., `frontend`) and ensure `public/data` is committed.

**2) Counters/grids show 0**
**Cause:** Project missing the area in `areas` or sub-tables are empty.
**Fix:** Add `"liderazgo" | "desarrollo" | "diseno"` in `proyectos.json`, and/or complete sub-tables.

**3) Design section missing `previewUrl` / `tools`**
**Cause:** No row in `diseno.json` (by `proyectoId`) or no records in `dev-tech-stack.json` with **`disenoId`**.
**Fix:** Add those rows. The loader already maps them.

**4) Carousel visible but empty**
**Cause:** Key name drift in JSON.
**Fix:** Loader supports aliases, but verify real keys (`imagenUrl`, `titulo`, `descripcion`, `enlace`, etc.).

**5) Works locally but not in prod**
**Cause:** Cache or wrong root on Vercel.
**Fix:** Hard refresh / redeploy / verify Root Directory and the presence of `public/data`.

---

## Scripts

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

---

## License

MIT — use and modify freely.

```
```
