// src/components/organisms/HeroCarousel/IconButton.tsx
"use client";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
export default function IconButton({ children, className = "", ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={`p-2 rounded-full hover:bg-white/20 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}
