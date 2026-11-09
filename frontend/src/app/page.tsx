import StatsBar        from "../components/organisms/StatsBar";
import PassionSection from "../components/organisms/PassionSection";
import TrustSection from "../components/organisms/TrustSection";
import LeaderCarousel from "../components/organisms/LeaderCarousel";
import DevCarousel from "../components/organisms/DevCarousel";
import DesignCarousel from "../components/organisms/DesignCarousel";
import ChatTeaser from "../components/chat/ChatTeaser";
import IntroHero from "../components/organisms/IntroHero";
import JourneySection from "../components/journey/JourneySection";
import ClosingPhoto from "../components/organisms/ClosingPhoto";

const TRUST_DATA = [
  {
    logoSrc: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/mitacs.svg",
    logoAlt: "Mitacs logo",
    title: "Mitacs",
    subtitle: "Global Internship",
    description: "Global Research Intern, 100% scholarship, 2024",
    link: "https://www.linkedin.com/pulse/mitacs-route-marco-l%C3%B3pez-studevs-zon0c",
    meta: "Fellowship", 
  },
  {
    logoSrc: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/makers.svg",
    logoAlt: "Makers Fellowship logo",
    title: "Makers",
    subtitle: "Fellowship",
    description: "Makers Business fellowship, Batch August 2024",
    link: "https://www.linkedin.com/posts/marco-antonn_if-someone-asked-me-why-i-recommend-makers-activity-7246559662903373826-8piR",
    meta: "Fellowship",
  },
  {
    logoSrc: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/trepcamp.svg",
    logoAlt: "TrepCamp logo",
    title: "TrepCamp",
    subtitle: "100% Entrepreneurial simulator scholarship",
    description: "🏆 Project with the highest investment potential, 2022. ",
    link: "https://www.linkedin.com/posts/marco-antonn_la-primera-puerta-abierta-de-muchas-m%C3%A1s-activity-6944867974952488960-dlV2",
    meta: "Award",
  },
  {
    logoSrc: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/aiesec.svg",
    logoAlt: "AIESEC logo",
    title: "AIESEC",
    subtitle: "Member",
    description: "AIESEC Marketing Area member, 2022",
    link: "https://aiesec.org",
    meta: "Community",
  },
];

const STUDIES_DATA = [
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/uaslp.svg",
    logoAlt: "UASLP logo",
    title: "UASLP",
    subtitle: "Universidad Autónoma de San Luis Potosí",
    description: "Intelligent Systems Engineering, 2020 - 2025",
    link: "https://www.ingenieria.uaslp.mx/CienciasComputacion/Paginas/Oferta-Academica/4453",
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/cityu.svg",
    logoAlt: "CityU logo",
    title: "CityU",
    subtitle: "City University of Seattle",
    description: "Bachelor of Arts in Management, 50% scholarship, 2021 - 2025",
    link: "https://www.cityu.edu/",
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/dku.svg",
    logoAlt: "Dankook logo",
    title: "Dankook",
    subtitle: "Dankook University",
    description: "Global Business international semester, spring 2024",
    link: "https://www.linkedin.com/posts/marco-antonn_im-thrilled-to-announce-that-ive-completed-activity-7222030311587540992-9Y8G?utm_source=share&utm_medium=member_desktop&rcm=ACoAADF7u4IBk6QyZwrDi-50qCf-zu_bTWtR8t4",
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/yorku.svg",
    logoAlt: "YorkU logo",
    title: "YorkU",
    subtitle: "York University",
    description: "Global Summer Internship in 2024",
    link: "https://www.linkedin.com/posts/marco-antonn_im-glad-to-announce-that-i-had-the-opportunity-activity-7269864845460602880-B92q?utm_source=share&utm_medium=member_desktop&rcm=ACoAADF7u4IBk6QyZwrDi-50qCf-zu_bTWtR8t4",
  },
];


const EXPERIENCE_DATA = [
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/domu.png",
    logoAlt: "Domu logo",
    company: "Domu",
    companyMeta: "YC-backed startup · Full-time",
    location: "San Luis Potosí, Mexico (Remote)",
    link: "https://domu.ai",
    roles: [
      {
        title: "Platform Prompt Engineer",
        dateRange: "Jul 2026 - Oct 2026 · 4 mos",
        description:
          "Raised accuracy on sensitive voice AI conversations from ~70% to ~99%, and on tasks like date calculations from 60% to 98%, by building agent tool calling, call-state detection and automated evaluation. Kept up to 14 production agents running for LATAM fintech and lending clients, with the busiest peaking at ~45,000 calls a day, and guided configuration decisions with SQL-driven A/B tests.",
      },
      {
        title: "Technical Account Manager",
        dateRange: "Mar 2026 - Jul 2026 · 5 mos",
        description:
          "Lifted promise-to-pay conversion ~7 points (24.6% → 31.5%) on Domu's top-priority LATAM account with SQL-driven A/B tests while scaling outreach from 5,000 to 12,000 contacts. Nearly doubled right-party contact (~4% → 7–8%) with time-of-day greetings, and automated daily reporting for ~15,000 calls a day per client, removing the need for a dedicated reporting hire.",
      },
    ],
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/globalset.png",
    logoAlt: "GlobalSet logo",
    title: "Technical Support Engineer, Internal Systems",
    subtitle: "GlobalSet · Oct 2025 - Mar 2026 · Remote",
    description:
      "Moved internal financial-system workflows and screens from a legacy codebase to a new platform as part of a six-person engineering team, resolving ~3 tickets a week with no regressions across QA and production. Built database tables, SQL queries and frontend-to-backend connections, and documented ~25 screens and features to speed up knowledge transfer.",
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/aiaPartners.svg",
    logoAlt: "AIA logo",
    title: "Frontend Developer",
    subtitle: "AIA Partners · Jun 2023 - Oct 2023",
    description:
      "Designed and built a new investor dashboard feature in Vue 3 that lifted engagement ~25%. Worked directly with the CEO to shape and present the TESLAIA business model, which drew investor interest, and sped up new projects with Figma mockups based on Atomic Design.",
    link: "https://www.aiapartner.com/es-MX",
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/lassondeYorkU.svg",
    logoAlt: "Lassonde logo",
    title: "Global Research Intern · Head of UI Design",
    subtitle: "Mitacs @ York University, Lassonde School of Engineering · Toronto · 100% scholarship",
    description:
      "Led UI design for a mobile game during a 3-month research internship in Toronto. Lifted user acceptance ~40% through a full UX process, from buyer personas to high-fidelity prototypes, and raised team productivity ~30% by running Scrum with Jira, Confluence, Slack and Figma.",
    link: "https://lassonde.yorku.ca/",
  },
  {
    logoSrc: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/trepcamp.svg",
    logoAlt: "Trepcamp logo",
    title: "Web Development Freelancer",
    subtitle: "TrepCamp",
    description:
      "Opened the platform to non-Spanish-speaking users by translating the website and its database from Spanish to English with HTML, CSS, PHP and MySQL.",
    link: "https://www.trepcamp.org/",
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/cityu.svg",
    logoAlt: "CityU logo",
    title: "Full-stack Developer",
    subtitle: "UASLP · City University of Seattle dual-degree program",
    description:
      "Cut staff's manual workload ~60% for a dual-degree program serving ~100 students by refactoring contract-generation workflows and PDF output with PHP and MySQL.",
    link: "https://www.cityu.edu/",
  },
  {
    logoSrc: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/aiesec.svg",
    logoAlt: "AIESEC logo",
    title: "Marketing Intern",
    subtitle: "AIESEC",
    description: "Created content and analyzed marketing strategy for the local chapter.",
    link: "https://aiesec.org",
  },
];

export default async function HomePage() {
  return (
      <main>
      <IntroHero />
      {/* "See where it led me" scrolls here */}
      <div id="home-main">
        <StatsBar />
      </div>
      <JourneySection />
      <ChatTeaser />
      <PassionSection />
      {/* <TrustSection/> */}
      <TrustSection
        title={<span>Trusted by people & programs I admire.</span>}
        items={TRUST_DATA}
      />
      <LeaderCarousel />
      <TrustSection
        title={<span>Learning to build what matters.</span>}
        items={STUDIES_DATA}
      />
      <DevCarousel/>
      {/* <ExperienceSection/> */}
      <TrustSection
        title={<span>Companies I have collaborated with.</span>}
        items={EXPERIENCE_DATA}
        layout="sequence"
        maxWidth="130vh"
      />
      <DesignCarousel/>
      <ClosingPhoto />

    </main>
  );
}
