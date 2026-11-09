import { StatsItem } from "../molecules/StatsItem";

const stats = [
  { value: "+10", label: "Projects and MVPs shipped" },
  { value: "4",   label: "Countries worked & studied abroad" },
  { value: "6",   label: "Professional experiences" },
  { value: "+10", label: "Awards earned" },
];

export default function StatsBar() {
  return (
    <section className="relative z-10 flex min-h-[40svh] items-center bg-black py-8">
      <div
        className="
          max-w-6xl mx-auto w-full
          grid grid-cols-2 md:grid-cols-4
          gap-x-12 gap-y-4
          justify-items-center
        "
      >
        {stats.map(({ value, label }) => (
          <StatsItem key={label} value={value} label={label} />
        ))}
      </div>
    </section>
  );
}
