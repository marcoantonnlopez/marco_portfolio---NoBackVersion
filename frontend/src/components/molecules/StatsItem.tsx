"use client";

import React, { useState, useRef, useEffect } from "react";

interface StatsItemProps {
  value: string; // p.ej. "+14" o "5"
  label: string;
}

export function StatsItem({ value, label }: StatsItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  // Extrae el número puro de `value`, p.ej. "+14" → 14
  const numeric = parseInt(value.replace(/\D/g, ""), 10) || 0;
  // Guarda si hay prefijo, p.ej. "+"
  const prefix = value.match(/^\D+/)?.[0] ?? "";

  // In-view + count-up
  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasAnimated.current = true;
          obs.disconnect();
          const duration = 1200; // ms
          const start = performance.now();
          const animate = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            setCount(Math.round(numeric * t));
            if (t < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [numeric]);

  return (
    <div
      ref={ref}
      className="
        flex flex-col sm:flex-row items-center justify-center
        p-4 sm:px-6 bg-black 
        transition-transform duration-300 ease-in-out
        hover:scale-105 hover:shadow-2xl
        w-full sm:w-auto
      "
      aria-label={`${numeric} ${label}`}
    >
      <span
        className="text-[clamp(2rem,5vw,3rem)] font-extrabold text-white leading-none"
        aria-hidden="true"
      >
        {prefix}
        {count}
      </span>
      <span
        className="
          mt-2 sm:mt-0 sm:ml-3 text-[clamp(0.875rem,2.5vw,1rem)]
          text-center sm:text-left text-gray-200
          leading-snug
        "
      >
        {label}
      </span>
    </div>
  );
}
