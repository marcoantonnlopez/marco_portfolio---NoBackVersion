// atoms/ -> botones, inputs, tipografía
import Link from "next/link";
import React from "react";

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  href,
  children,
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`
        inline-block px-5 py-2 border border-white rounded
        text-white font-medium
        hover:bg-white hover:text-black transition-colors
        ${className}
      `}
    >
      {/* className="inline-block px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition rounded"
      > */}
      {children}
    </Link>
  );
}
