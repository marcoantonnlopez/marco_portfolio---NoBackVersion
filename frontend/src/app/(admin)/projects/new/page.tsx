// formulario “Crear”
// frontend/src/app/(admin)/projects/new/page.tsx
import type { ReactNode } from "react";

// Evita SSG en build y fuerza SSR
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Si tienes metadata, que sea *named*, nunca default
export const metadata = {
  title: "New Project",
};

// IMPORTA el form correctamente según cómo lo exportaste:
// 1) Si en tu form hiciste `export default function NewProjectForm(){}`:
import NewProjectForm from "../../../../components/admin/NewProjectForm";
// 2) Si hiciste `export function NewProjectForm(){}` usa:
// import { NewProjectForm } from "@/components/admin/NewProjectForm";

export default function NewProjectPage() {
  // Si aún no tienes el form o falla el import, deja un placeholder temporal:
  // return <div className="p-6">New Project — coming soon.</div>;

  return <NewProjectForm />; // ← usa el import correcto (default vs named)
}
