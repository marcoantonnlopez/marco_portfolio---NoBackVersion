"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutMePage() {
  return (
    <>
      {/* Hero Section */}
      <main className="relative w-full h-[150vh] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed inset-0"
        >
          <Image
            src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/1_me.svg"
            alt="Photo of me in the city at night"
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </motion.div>

        <div className="absolute top-[100vh] left-0 w-full h-[50vh] bg-gradient-to-b from-transparent to-[#171717]" />

        <div className="absolute top-[30vh] inset-x-0 flex flex-col items-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] text-white text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
          >
            Ok, so this is me...
          </motion.h1>

          <motion.p
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ delay: 0.5, duration: 1.8, ease: 'linear' }}
            className="mt-4 text-gray-200 text-lg sm:text-xl italic overflow-hidden whitespace-nowrap border-r-2 border-gray-200"
          >
            and this is <span className="text-primary font-semibold">my story</span>.
          </motion.p>
        </div>
      </main>

      {/* Golden Boy Section (responsive) */}
<section className="relative w-full min-h-[100svh] md:min-h-[100dvh] bg-[#171717] py-8 md:py-12">
  <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8">

    {/* Childhood Photo and Title */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl
                 aspect-[4/5] sm:aspect-[3/4] md:aspect-auto
                 md:min-h-[60svh] lg:min-h-[85svh]"
    >
      <Image
        src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/2_gradPrimaria.svg"
        alt="Young Golden Boy"
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      {/* Overlay + Title */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
          <h2 className="text-white font-bold leading-[0.9]">
            <span className="block text-[clamp(1.5rem,6vw,3rem)]">The</span>
            <span className="block font-serif italic text-[clamp(2.5rem,10vw,6rem)]">Golden Boy</span>
          </h2>
        </div>
      </div>
    </motion.div>

    {/* Graduation Photo and Story */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: 0.25, duration: 0.8 }}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl
                 aspect-[4/5] sm:aspect-[3/4] md:aspect-auto
                 md:min-h-[60svh] lg:min-h-[85svh]"
    >
      <Image
        src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/3_gradUni.svg"
        alt="Golden Boy Graduate"
        fill
        className="object-cover"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div className="absolute inset-0 bg-black/60" aria-hidden />
      <div className="absolute inset-0 flex items-end p-4 sm:p-6 md:p-8">
        <div className="text-white max-w-prose space-y-4 sm:space-y-5 md:space-y-6 leading-relaxed
                        text-[0.9rem] sm:text-base md:text-lg">
          <p>
            I used to <strong>win everything.</strong><br />
            Singing contests. Kung Fu tournaments. Spelling bees.
          </p>
          <p>
            Adults would smile at me and say, "<strong>Your future is bright.</strong>" And I believed them.
            I became the <strong>"Golden Boy"</strong>, the kid who always delivered, the one who couldn't fail.
          </p>
          <p>
            But no one told me what happens <strong>when life stops giving you trophies.</strong>
            That part, <strong>I had to learn on my own.</strong>
          </p>
        </div>
      </div>
    </motion.div>
  </div>
</section>


       {/* Dreamer Activist Section (responsive) */}
<section className="relative w-full min-h-[100svh] md:min-h-[100dvh] overflow-hidden bg-[#171717] py-10 md:py-14">
  {/* Background Image */}
  <motion.div
    initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    className="pointer-events-none absolute inset-0"
    aria-hidden
  >
    <Image
      src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/4_socialProjects.svg"
      alt="The Dreamer Activist"
      fill
      className="object-cover"
      priority
      sizes="100vw"
      unoptimized
    />
  </motion.div>

  {/* Gradients */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#171717]/90" aria-hidden />
  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#171717]/70" aria-hidden />

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 items-center"
  >
    {/* Title & Video (first on mobile, second on desktop) */}
    <div className="order-1 md:order-2 flex flex-col items-end text-right">
      <h2 className="text-white font-bold leading-[0.9]">
        <span className="block text-[clamp(1.75rem,6vw,3.5rem)]">The</span>
        <span className="block font-serif italic text-[clamp(2.25rem,10vw,5rem)]">Dreamer</span>
        <span className="block text-[clamp(1.75rem,6vw,3.5rem)]">Activist</span>
      </h2>

      {/* Responsive video */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        className="mt-5 sm:mt-6 w-full md:w-[85%] lg:w-[70%]"
      >
        <div className="relative pt-[56.25%] rounded-lg overflow-hidden drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
          <iframe
            className="filter absolute inset-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/c74oAYSY1So?start=18&rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </motion.div>
    </div>

    {/* Copy (second on mobile, first on desktop) */}
    <div className="order-2 md:order-1 text-white max-w-prose space-y-4 sm:space-y-5 md:space-y-6 leading-relaxed
                    text-[0.95rem] sm:text-base md:text-lg md:mt-10 lg:mt-16">
      <p>
        Me, an <strong>emotional teen</strong>. At 15, I used to see a lot of <strong>injustice everywhere</strong>, socially and environmental, so I <strong>started creating my own social projects</strong>.
      </p>
      <p>
        In less than a year, I helped launch over a <strong>dozen social projects</strong>. We reached schools, communities, and people who had never been asked <strong>what they needed</strong>.
      </p>
      <p>
        I learned that <strong>I love making impact</strong>, not just talking about it. And that I’m more capable than <strong>I ever thought</strong>.
      </p>
    </div>
  </motion.div>
</section>


       {/* Rejected Section (responsive) */}
<section className="relative w-full min-h-[100svh] md:min-h-[100dvh] overflow-hidden bg-[#171717] py-10 md:py-14">
  {/* Background Image */}
  <motion.div
    initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    className="pointer-events-none absolute inset-0"
    aria-hidden
  >
    <Image
      src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/5_rejected.jpg"
      alt="The "
      fill
      className="object-cover"
      priority
      sizes="100vw"
      unoptimized
    />
  </motion.div>

  {/* Gradients (vertical + horizontal) */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#171717]/90" aria-hidden />
  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#171717]/70" aria-hidden />

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.8 }}
    className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 items-center"
  >
    {/* Title & Video */}
    <div className="flex flex-col items-start">
      <h2 className="text-white font-bold leading-[0.9]">
        <span className="block text-[clamp(1.5rem,6vw,3rem)]">The</span>
        <span className="block font-serif italic text-[clamp(2.25rem,10vw,6rem)]">Rejected</span>
      </h2>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
        className="mt-5 sm:mt-6 w-full md:w-[85%] lg:w-[70%]"
      >
        <div className="relative pt-[56.25%] rounded-lg overflow-hidden drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
          <iframe
            className="absolute inset-0 w-full h-full rounded-lg filter"
            src="https://www.youtube.com/embed/aPy6f1WE5VA?start=4&rel=0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </motion.div>
    </div>

    {/* Paragraphs */}
    <div className="text-white max-w-prose space-y-4 sm:space-y-5 md:space-y-6 leading-relaxed
                    text-[0.95rem] sm:text-base md:text-lg">
      <p>
        At 16, I spent over a year preparing for a <strong>100% scholarship</strong> to one of the top universities in Mexico. I gave it everything. And I was <strong>rejected</strong>.
      </p>
      <p>
        I didn’t have money to pay the tuition, just a local university and a broken <strong>sense of worth</strong>.
      </p>
      <p>
        That rejection shaped me. It taught me that waiting for someone to “<strong>choose</strong>” me was a trap. So I stopped waiting. I started <strong>building spaces, projects, and chances</strong>, for others like me.
      </p>
      <p>
        For the ones who weren’t given permission to dream, but <strong>dared to do it anyway</strong>.
      </p>
    </div>
  </motion.div>
</section>


        {/* Studev Leader Section */}
<section className="relative w-full min-h-screen overflow-hidden bg-[#171717] py-16">
  {/* Imagen de fondo */}
  <motion.div
    initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ duration: 1.2, ease: 'easeOut' }}
    className="absolute inset-0"
  >
    <Image
      src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/6_studevLeader.svg"
      alt="The Studev Leader"
      fill
      className="object-cover"
      priority
      unoptimized
    />
  </motion.div>

  {/* Gradientes */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/90 via-transparent to-[#171717]/90" />
  <div className="absolute inset-0 bg-gradient-to-r from-[#171717]/90 via-transparent to-transparent" />

  {/* Contenido */}
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
    className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 px-6 md:px-12 lg:px-16 items-center"
  >
    {/* Video */}
    <div className="flex justify-center lg:justify-start">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-lg aspect-video"
      >
        <iframe
          className="absolute inset-0 w-full h-full rounded-xl shadow-xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0"
          title="The Studev Leader video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </div>

    {/* Texto */}
    <div className="text-white flex flex-col justify-center">
      {/* Título */}
      <h2 className="leading-tight mb-6 text-right lg:text-right">
        <span className="block text-5xl sm:text-6xl md:text-7xl font-bold">The</span>
        <span className="block text-4xl sm:text-5xl md:text-6xl italic font-serif">Studev</span>
        <span className="block text-5xl sm:text-6xl md:text-7xl font-bold">Leader</span>
      </h2>

      {/* Descripción */}
      <div className="text-sm md:text-base leading-relaxed space-y-4 max-w-xl text-right">
        <p>
          In college, I felt like something was missing. We had talent, but <strong>NO space to grow</strong>. So I built one.
        </p>
        <p>
          I created Studevs, a CS community with more than <strong>160 participants</strong>, more than <strong>13 hackathons</strong> participated, <strong>7 events</strong> created, <strong>11 MITACS scholarships</strong>, more than <strong>13 awards</strong> and a lot of people inspired and powered.
        </p>
        <p>
          In each face I saw someone who had been waiting for <strong>permission to lead</strong>, to build, to dream. And somehow, they found that <strong>permission in each other</strong>.
        </p>
      </div>
    </div>
  </motion.div>
</section>


      {/* International Weirdo Section */}
<section className="relative w-full min-h-screen overflow-hidden bg-[#171717] py-16">
  {/* Background & Overlays */}
  <motion.div
    initial={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ duration: 1, ease: 'easeOut' }}
    className="absolute inset-0"
  >
    <Image
      src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/7_international.svg"
      alt="The International Weirdo"
      fill
      className="object-cover"
      priority
      unoptimized
    />
  </motion.div>

  {/* Gradiente superior e inferior */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/90 via-[#171717]/30 to-[#171717]/100" />

  {/* Content Grid */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 px-6 md:px-12 lg:px-16 items-center"
  >
    {/* Title & Text */}
    <div className="order-1 flex flex-col justify-center text-white">
      <h2 className="leading-tight">
        <span className="block text-5xl sm:text-6xl md:text-7xl font-bold">The</span>
        <span className="block text-5xl sm:text-6xl md:text-7xl font-bold">International</span>
        <span className="block text-4xl sm:text-5xl md:text-6xl italic font-serif">Weirdo</span>
      </h2>

      <div className="mt-6 text-sm md:text-base leading-relaxed max-w-lg space-y-4">
        <p>
          I studied on the other side of the world. I worked and saved money for two years to make it happen, four months in South Korea.
        </p>
        <p>That experience changed me forever. I learned that:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Not everyone is like you, and that’s okay.</li>
          <li>You don’t need to fit in. You can break the mold and build yourself from scratch.</li>
          <li>Your culture, your education, they’re not cages. You can find your truth and live it freely.</li>
          <li>Love is the most important thing I have. That’s what I brought back. Not a degree. A new self.</li>
        </ul>
      </div>
    </div>

    {/* Video Embed */}
    <div className="order-2 flex justify-center lg:justify-end">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md md:max-w-lg aspect-video"
      >
        <iframe
          className="absolute inset-0 w-full h-full rounded-xl shadow-xl drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0"
          title="The International Weirdo video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </div>
  </motion.div>
</section>

{/* Impostor Intern Section */}
<section className="relative w-full min-h-screen overflow-hidden bg-[#171717] py-16">
  {/* Imagen de fondo */}
  <motion.div
    initial={{ opacity: 0, scale: 1.1, filter: 'blur(18px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ duration: 1.1, ease: 'easeOut' }}
    className="absolute inset-0"
  >
    <Image
      src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/8_mitacs.svg"
      alt="The Impostor Intern"
      fill
      className="object-cover"
      priority
      unoptimized
    />
  </motion.div>

  {/* Gradientes para legibilidad */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/100 via-transparent to-[#171717]/70" />
  <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_60%_30%,transparent_0%,transparent_20%,#171717_100%)]" />

  {/* Contenido */}
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="relative z-10 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[1.05fr_0.95fr] gap-10 px-6 md:px-12 lg:px-16 items-center"
  >
    {/* Título */}
    <div className="order-1 text-white flex flex-col justify-center lg:items-end">
      <h2 className="text-center lg:text-right leading-tight">
        <span className="block text-5xl sm:text-6xl md:text-7xl font-bold">The</span>
        <span className="block text-4xl sm:text-5xl md:text-6xl italic font-serif">Impostor</span>
        <span className="block text-5xl sm:text-6xl md:text-7xl font-bold">Intern</span>
      </h2>
    </div>

    {/* Video */}
    <div className="order-2 flex justify-center lg:justify-start w-full">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.55, ease: 'easeOut' }}
        className="relative z-20 w-full max-w-xl sm:max-w-lg lg:max-w-md min-w-[260px] aspect-video rounded-2xl overflow-hidden shadow-2xl "
      >
        <iframe
          className="absolute inset-0 w-full h-full shadow-[0_20px_80px_rgba(255,255,255,0.18)]"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0"
          title="Impostor Intern video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </motion.div>
    </div>

    {/* Texto */}
    <div className="order-3 text-white/90 text-sm md:text-base leading-relaxed max-w-2xl drop-shadow">
      <p>
        I was a Mitacs Global Research Intern. I grew up in a culture where we admired
        people from around the world while quietly feeling inferior, a collective trauma we never named.
      </p>
      <p className="mt-4">
        During my time abroad, I learned that we are just as valuable, just as capable.
        That we are unique, and our worth is not something given, it’s something we claim.
      </p>
    </div>
  </motion.div>
</section>

{/* Overcompensating Grad Section */}
<section className="relative w-full min-h-screen overflow-hidden bg-[#171717] py-16">
  {/* Background image */}
  <motion.div
    initial={{ opacity: 0, scale: 1.1, filter: 'blur(18px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    transition={{ duration: 1.1, ease: 'easeOut' }}
    className="absolute inset-0"
  >
    <Image
      // Cambia el src si tu asset tiene otro nombre/ruta
      src="https://raw.githubusercontent.com/marcoantonnlopez/portfolioContent/master/pages/2_aboutMe/9_TorontoCity.svg"
      alt="The Overcompensating Grad"
      fill
      className="object-cover"
      priority
      unoptimized
    />
  </motion.div>

  {/* Overlays: barra superior + viñeta radial + oscurecer inferior */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#171717]/85 via-transparent to-[#171717]/70" />
  <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_75%_55%,transparent_0%,transparent_55%,#171717_95%)]" />
  <div className="absolute inset-0 bg-black/10" />

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    className="relative z-10 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-[1.25fr_0.95fr] gap-10 px-6 md:px-12 lg:px-16"
  >
    {/* Left: Title + copy */}
    <div className="order-1 text-white pt-6 lg:pt-12">
      {/* Title */}
      <h2 className="leading-tight mb-8">
        <span className="block text-5xl sm:text-6xl md:text-7xl font-extrabold">The</span>
        <span className="block text-4xl sm:text-5xl md:text-6xl italic font-serif">Overcompensating</span>
        <span className="block text-5xl sm:text-6xl md:text-7xl font-extrabold">Grad</span>
      </h2>

      {/* Copy */}
      <div className="text-white/90 text-sm md:text-base leading-relaxed max-w-2xl space-y-4">
        <p>
          As a recent grad, I realized how hard it is to believe you “deserve” to be hired just because you
          worked hard, and how easy it is to believe you “don’t deserve” it just because you’re hurt.
        </p>
        <p>
          It hits you after applying to 100 companies and getting only rejections.
          Identity crisis. Market saturation. Constant comparison. You get all of it.
        </p>
        <p>
          But maybe, just maybe, it’s not about being chosen. Maybe there’s more than chasing an
          empty, traditional path. Maybe it’s not about what the world offers us, but about what we can
          offer the world.
        </p>
      </div>
    </div>

    {/* Right: Video (con glow) */}
    <div className="order-3 lg:order-2 flex items-start justify-center lg:justify-end pb-6">
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.55, ease: 'easeOut' }}
        className="relative z-20 w-full max-w-xl sm:max-w-lg lg:max-w-md min-w-[260px] aspect-video rounded-3xl overflow-hidden
                   shadow-[0_20px_80px_rgba(255,255,255,0.18)]"
      >
        <iframe
          className="absolute inset-0 w-full h-full"
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID?rel=0"
          title="Overcompensating Grad video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </motion.div>
    </div>
  </motion.div>

  {/* Orden móvil: título → texto → video */}
  <style jsx>{`
    @media (max-width: 1023px) {
      section :global(.order-3) { order: 3; }
    }
  `}</style>
</section>

    </>
  );
}