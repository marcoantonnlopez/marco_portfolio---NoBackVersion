"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";
import { TrustItem, type TrustItemProps } from "@/components/molecules/TrustItem";
import { TrustItemGrouped, type TrustGroupProps } from "@/components/molecules/TrustItemGrouped";
import Heading from "@/components/atoms/Heading";

type TrustEntry = TrustItemProps | TrustGroupProps;

function isGrouped(item: TrustEntry): item is TrustGroupProps {
  return "roles" in item;
}

interface TrustSectionProps {
  /** Title text or a custom heading node */
  title?: React.ReactNode;
  /** Items provided by the parent */
  items: TrustEntry[];
  /** Optional extra classes for the section */
  className?: string;
  /** Fixed visual height for each item to keep them homogeneous */
  itemMinHeightPx?: number; // default 112
  /**
   * "grid": 2 columns. "stack": one card per row.
   * "sequence": pinned while scrolling, showing one card at a time (the next replaces the previous).
   */
  layout?: "grid" | "stack" | "sequence";
  /** Optional max width for the content, e.g. "130vh" */
  maxWidth?: string;
}

export default function TrustSection({
  title = "People & programs who bet on me.",
  items,
  className,
  itemMinHeightPx = 112,
  layout = "grid",
  maxWidth,
}: TrustSectionProps) {
  const stack = layout === "stack";

  if (layout === "sequence") {
    return <SequenceSection title={title} items={items} className={className} maxWidth={maxWidth} />;
  }
  return (
    <section className={clsx("relative isolate bg-black py-16", className)}>
      <div
        className={clsx("mx-auto px-4", !maxWidth && "max-w-6xl")}
        style={maxWidth ? { maxWidth: `min(${maxWidth}, 100%)` } : undefined}
      >
        {/* Title styled like card headings */}
        {typeof title === "string" ? (
          <Heading level={2}
            className="text-white font-extrabold tracking-tight leading-tight mb-10"
            // style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)" }}
          >
            {title}
          </Heading>
        ) : (
          <div className="mb-10 font-bold text-center text-4xl sm:text-5xl mb-12 ">{title}</div>
        )}

        {/* Homogeneous item sizes */}
        <ul className={stack ? "flex flex-col gap-6" : "grid gap-3 md:grid-cols-2"}>
          {items.map((item, i) => {
            const grouped = isGrouped(item);
            return (
              <li
                key={`${grouped ? item.company : item.title}-${i}`}
                style={grouped || stack ? undefined : { minHeight: itemMinHeightPx }}
                className={grouped && !stack ? "md:col-span-2" : undefined}
              >
                {grouped ? <TrustItemGrouped {...item} /> : <TrustItem {...item} />}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- "sequence": one card at a time while scrolling ---------- */

function renderEntry(item: TrustEntry) {
  return isGrouped(item) ? <TrustItemGrouped {...item} /> : <TrustItem {...item} />;
}

function SequenceSection({
  title,
  items,
  className,
  maxWidth,
}: {
  title: React.ReactNode;
  items: TrustEntry[];
  className?: string;
  maxWidth?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(items.length - 1, Math.max(0, Math.floor(p * items.length)));
    setActive((prev) => (prev === i ? prev : i));
  });

  const item = items[active];

  return (
    // ~60vh of scroll per card; the stage stays pinned while they swap.
    <section
      ref={ref}
      className={clsx("relative bg-black", className)}
      style={{ height: `calc(${items.length} * 60svh + 100svh)` }}
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-start overflow-hidden pt-[16svh]">
        <div
          className={clsx("mx-auto w-full px-4", !maxWidth && "max-w-6xl")}
          style={maxWidth ? { maxWidth: `min(${maxWidth}, 100%)` } : undefined}
        >
          {typeof title === "string" ? (
            <Heading level={2} className="mb-10 font-extrabold leading-tight tracking-tight text-white">
              {title}
            </Heading>
          ) : (
            <div className="mb-10 text-center text-4xl font-bold sm:text-5xl">{title}</div>
          )}

          <div className="relative min-h-[360px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {renderEntry(item)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div className="mt-8 flex items-center justify-center gap-2" aria-hidden="true">
            {items.map((_, i) => (
              <span
                key={i}
                className={clsx(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === active ? "w-6 bg-white" : "w-1.5 bg-white/30"
                )}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-white/50">
            {active + 1} / {items.length}
          </p>
        </div>
      </div>
    </section>
  );
}
