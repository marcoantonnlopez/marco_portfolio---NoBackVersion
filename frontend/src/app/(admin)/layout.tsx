// * (admin)/ ->  **route group** oculto en URL
// dashboard shell (sidebar, logout)

// import { getSession } from "next-auth/react";
// export default async function AdminLayout({ children }) {
//   const session = await getSession();
//   if (!session) redirect("/admin/login");
//   return <DashboardShell>{children}</DashboardShell>;
// }

// frontend/src/app/(admin)/layout.tsx
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <section className="min-h-screen bg-[#121212] text-white">{children}</section>;
}

// (opcional)
export const metadata = { title: "Admin" };
