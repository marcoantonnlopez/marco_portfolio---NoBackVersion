"use client";

import React from "react";
import clsx from "clsx";
import { TrustItem, type TrustItemProps } from "@/components/molecules/TrustItem";
import Heading from "@/components/atoms/Heading";

interface TrustSectionProps {
  /** Title text or a custom heading node */
  title?: React.ReactNode;
  /** Items provided by the parent */
  items: TrustItemProps[];
  /** Optional extra classes for the section */
  className?: string;
  /** Fixed visual height for each item to keep them homogeneous */
  itemMinHeightPx?: number; // default 112
}

export default function TrustSection({
  title = "People & programs who bet on me.",
  items,
  className,
  itemMinHeightPx = 112,
}: TrustSectionProps) {
  return (
    <section className={clsx("relative isolate bg-black py-16", className)}>
      <div className="mx-auto max-w-6xl px-4">
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
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map((item, i) => (
            <li key={`${item.title}-${i}`} style={{ minHeight: itemMinHeightPx }}>
              <TrustItem {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
