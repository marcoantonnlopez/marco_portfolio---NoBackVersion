import HeroCarousel    from "../components/organisms/HeroCarousel/HeroCarousel";
import StatsBar        from "../components/organisms/StatsBar";
import PassionSection from "../components/organisms/PassionSection";
import TrustSection from "../components/organisms/TrustSection";
import LeaderCarousel from "../components/organisms/LeaderCarousel";
import DevCarousel from "../components/organisms/DevCarousel";
import DesignCarousel from "../components/organisms/DesignCarousel";

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
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/aiaPartners.svg",
    logoAlt: "AIA logo",
    title: "Frontend Developer",
    subtitle: "AIA Partners",
    description: "Increased project efficiency by creating mockups for new projects using Figma, based on atomic design principles. Collaborated with the CEO to develop a compelling business model for TESLAIA, resulting in a presentation that attracted investor interest. Helped to develop a new investor dashboard feature by designing and implementing web solutions with Vue3, HTML, CSS, and JavaScript, enhancing user engagement by 25%.",
    link: "https://www.aiapartner.com/es-MX",
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/lassondeYorkU.svg",
    logoAlt: "Lassonde logo",
    title: "Global internship, Head of UI design",
    subtitle: "Mitacs @YorkU Lassonde School of engineering",
    description: " Increased team productivity by 30% by implementing SCRUM methodologies across the project, using tools like, Jira, Slack, Confluence, and Figma,  Improved user acceptance by 40% through a comprehensive UX process for a mobile gaming app, including creating buyer personas and high-fidelity prototypes",
    link: "https://lassonde.yorku.ca/",
  },
  {
    logoSrc: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/trepcamp.svg",    
    logoAlt: "Trepcamp logo",
    title: "Web Development Freelancer",
    subtitle: "Trepcamp",
    description: "Expanded audience by translating the website and database from Spanish to English, enabling accessibility for non Spanish-speaking users, using HTML, CSS, PHP and mySQL.",
    link: "https://www.trepcamp.org/",
  },
  {
    logoSrc:
      "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/cityu.svg",
    logoAlt: "CityU logo",
    title: "Fullstack developer",
    subtitle: "UASLP - City University of Seattle",
    description: "Improved administrative efficiency for a dual-degree program serving ~100 students by refactoring internal contract generation workflows using PHP and MySQL, reducing manual workload for staff by 60% and streamlining PDF output",
    link: "https://www.cityu.edu/",
  },
  {
    logoSrc: "https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/1_Home/logos/aiesec.svg",
    logoAlt: "AIESEC logo",
    title: "Marketing intern",
    subtitle: "AIESEC",
    description: "Content creator and strategy analyst",
    link: "https://aiesec.org",
    meta: "Community",
  },
];

export default async function HomePage() {
  return (
      <main>
      <HeroCarousel />
      <div className="-mt-16 sm:-mt-20">
        <StatsBar />
      </div>
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
      />
      <DesignCarousel/>

    </main>
  );
}
