// frontend/src/components/organisms/IntroHero.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const VIDEO_SRC =
  "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/0_intro/intro.mp4";
const POSTER_SRC =
  "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/0_intro/intro_poster.jpg";

// Id of the section the button scrolls to (the existing home hero).
const HOME_MAIN_ID = "home-main";

export default function IntroHero() {
  const scrollToMain = () => {
    document.getElementById(HOME_MAIN_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      aria-label="Intro"
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#171717]"
      style={{ backgroundImage: `url(${POSTER_SRC})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      {/* Background video (hidden for users who prefer reduced motion; the poster stays) */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src={VIDEO_SRC}
        poster={POSTER_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Contrast + fade into the page color */}
      <div className="absolute inset-0 bg-black/25" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-b from-transparent via-[#171717]/70 to-[#171717]" />

      {/* Copy */}
      <div className="absolute inset-0 flex flex-col items-start justify-end px-6 pb-16 text-left sm:items-center sm:pb-20 sm:text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="text-5xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)] sm:text-6xl md:text-7xl"
        >
          For the love of living.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.7 }}
          className="mt-4 max-w-2xl text-base text-white/85 sm:text-lg md:text-xl"
        >
          Dreaming big, making it real, and enjoying every step with the people around me.
        </motion.p>

        <motion.button
          type="button"
          onClick={scrollToMain}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-black shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          See where it led me
          <ArrowDown className="h-4 w-4" />
        </motion.button>
      </div>
    </section>
  );
}
