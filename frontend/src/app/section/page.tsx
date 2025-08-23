import SectionProjectsGrid from "@/components/organisms/SectionProjectsGrid";
import SectionHero from "./SectionHero";

type Area = "liderazgo" | "desarrollo" | "diseno";

const ALIASES: Record<string, Area> = {
  // Liderazgo
  leader: "liderazgo",
  founder: "liderazgo",
  liderazgo: "liderazgo",
  // Desarrollo
  dev: "desarrollo",
  engineer: "desarrollo",
  desarrollo: "desarrollo",
  // Diseño
  designer: "diseno",
  design: "diseno",
  diseno: "diseno",
};

export default function SectionPage({
  searchParams,
}: {
  searchParams: { type?: string };
}) {
  const raw = searchParams.type?.toLowerCase();
  const area: Area = (raw && ALIASES[raw]) || "liderazgo"; // default opcional

  return (
    <div className="bg-[#121212] min-h-screen text-white">
      <SectionHero area={area} />
      <SectionProjectsGrid area={area} />
    </div>
  );
}
