// src/components/atoms/Heading.tsx
import React from "react";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
}

export default function Heading({
  level = 2,
  className = "",
  children,
}: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Tag className={`font-extrabold text-white ${className}`}>
      {children}
    </Tag>
  );
}
