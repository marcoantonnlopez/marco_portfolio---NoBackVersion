"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        px-2 py-1
        text-white
        transition-all duration-200 ease-out
        ${isActive ? "font-bold underline" : "font-normal"}
        hover:scale-105 hover:font-bold hover:underline
      `}
    >
      {children}
    </Link>
  );
}
