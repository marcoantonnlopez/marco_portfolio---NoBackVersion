// frontend/src/components/organisms/ClosingPhoto.tsx
// Last section of the home page: the Toronto photo ("Marco López" is part of the image) with two CTAs.
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";

const PHOTO_SRC = "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/1_main.svg";
const RESUME_HREF = process.env.NEXT_PUBLIC_RESUME_URL || "/resume.pdf";

export default function ClosingPhoto() {
  return (
    <section aria-label="Marco López" className="bg-black px-6 pb-16 pt-10 sm:h-[150svh] sm:px-16 sm:pb-24 sm:pt-16 lg:px-24">
      {/* Phones keep the photo's own proportions so the name in the image isn't cropped */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.94, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[844/535] w-full overflow-hidden rounded-3xl ring-1 ring-white/10 sm:aspect-auto sm:h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- remote SVG with an embedded photo */}
        <img
          src={PHOTO_SRC}
          alt="Marco López in front of the Toronto skyline"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* Buttons sit just below the "Marco López" lettering in the photo */}
        <div className="absolute inset-x-0 top-[38%] flex flex-wrap items-center justify-center gap-2 px-4 sm:gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/55 px-4 py-2 text-sm text-white backdrop-blur-sm transition hover:bg-black/75 sm:px-5 sm:py-2.5 sm:text-base"
          >
            Contact me <Mail className="h-4 w-4" />
          </Link>
          <a
            href={RESUME_HREF}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/55 px-4 py-2 text-sm text-white backdrop-blur-sm transition hover:bg-black/75 sm:px-5 sm:py-2.5 sm:text-base"
          >
            <Download className="h-4 w-4" /> Resume
          </a>
        </div>
      </motion.div>
    </section>
  );
}
