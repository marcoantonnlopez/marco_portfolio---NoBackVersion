# Marco Portfolio — No-Backend Version

**YC-style, top-1% PM documentation.**  
Single-repo, frontend-only portfolio built with **Next.js 15 + TypeScript + Tailwind + Framer Motion**.  
All dynamic content is sourced from **static JSON files in `/public/data`**—no servers, no DB.

---

## 1) Alcance

- **Home** con hero animado, contadores por área (liderazgo/dev/diseño), secciones “trust” y “passions”.
- **Section** (`/section?type=leader|dev|designer`) con **grid de proyectos por área**.
- **Carouseles** por área (3 cards elegidas en código + “See all projects”).
- **Página de proyecto** (`/proyectos/[id]`) con:
  - Hero con imagen/brand/social
  - **Detalles** (propósito, inicio, historia, métricas)
  - Secciones de rol (líder/dev/diseño)
  - **Carrusel de contenido adicional** por proyecto

**Sin backend**: todos los datos se leen de `/public/data/*.json`.

---

## 2) Arquitectura & Flujo de Datos

