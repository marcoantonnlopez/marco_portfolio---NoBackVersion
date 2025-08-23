"use client";

import { motion, easeOut } from "framer-motion";

type LeaderData = {
  videoUrl?: string;
  queHice?: string;
  highlights: string[];
  title?: string;
};

const fade = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

function getYouTubeEmbed(url?: string) {
  if (!url) return null;
  const m = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?rel=0` : null;
}

export default function LeaderRoleSection({ videoUrl, queHice, highlights, title = "My role as a leader." }: LeaderData) {
  const yt = getYouTubeEmbed(videoUrl);
  const hasVideo = !!(yt || videoUrl);

  return (
    <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]">
      {/* Card contenedor con glow suave */}
      <div className="rounded-[28px] border border-white/10 bg-[#121212]/90 shadow-[0_40px_120px_rgba(0,0,0,0.45)] ring-1 ring-white/5 p-6 sm:p-8 md:p-10">
        {/* Título */}
        <motion.h2
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 sm:mb-8 md:mb-10"
        >
          {title}
        </motion.h2>

        {/* Video / media */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="rounded-3xl bg-white/5 border border-white/10 overflow-hidden mx-auto"
        >
          <div className="aspect-[16/9]">
            {yt ? (
              <iframe
                src={yt}
                title="Leader video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : hasVideo ? (
              <video src={videoUrl} controls className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full grid place-items-center text-white/40">
                <span className="text-sm">No video available</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ¿Qué hice? + texto con divisor */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 md:mt-10"
        >
          <div className="md:grid md:grid-cols-[180px_1fr] md:gap-6 lg:gap-10">
            <div className="flex items-start gap-4 md:gap-0">
              <span className="whitespace-nowrap font-semibold text-white md:text-right">What did I do?</span>
              {/* divisor vertical en desktop */}
              <span className="hidden md:block w-px h-6 bg-white/30 translate-x-3" />
            </div>

            <div className="mt-4 md:mt-0 text-white/85 leading-relaxed text-base sm:text-lg">
              {queHice ? queHice : <span className="text-white/50">No description yet.</span>}
            </div>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10"
        >
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">Highlights</h3>
          {highlights?.length ? (
            <ul className="list-disc pl-6 space-y-2 text-white/85">
              {highlights.map((t, i) => (
                <li key={`${i}-${t.slice(0,16)}`} className="marker:text-white/50">{t}</li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60">No highlights yet.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
