// src/components/organisms/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";
import { Logo } from "../atoms/Logo";
import { NavLink } from "../atoms/NavLink";

export function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/about-me", label: "About me" },
    { href: "/section?type=leader", label: "Leader" },
    { href: "/section?type=dev", label: "Developer" },
    { href: "/section?type=designer", label: "Designer" },
    { href: "/contact", label: "Contact me" },
    // { href: "/admin", label: "Log In" },
  ];

  return (
    <>
      <header
        className={`
          fixed top-4 left-1/2 transform -translate-x-1/2
          w-[90vw] max-w-6xl
          ${open ? "rounded-none" : "rounded-full"}    /* ← aquí el cambio */
          bg-[#171717]/70 backdrop-blur-[50px]
          drop-shadow-[0_0_50px_rgba(255,255,255,0.5)]
          z-50
        `}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex space-x-6">
          {links.map(({ href, label }, i) => (
               <NavLink key={`${label}-${i}`} href={href}>
                 {label}
               </NavLink>
             ))}
          </nav>

          {/* Toggle móvil */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Menú móvil full-screen */}
      <div
        className={`
          fixed inset-0 z-40
          bg-[#171717]/90 backdrop-blur-[50px]
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-y-0" : "-translate-y-full"}
          flex flex-col items-center justify-center
        `}
      >
        <nav className="flex flex-col items-center space-y-8">
          {links.map(({ href, label }) => (
            <span key={href} onClick={() => setOpen(false)}>
              <NavLink href={href}>
                <span className="text-xl md:text-2xl">{label}</span>
              </NavLink>
            </span>
          ))}
        </nav>
      </div>
    </>
  );
}
