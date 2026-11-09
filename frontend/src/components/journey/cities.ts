// frontend/src/components/journey/cities.ts
// Edit names / notes here. Leave `note` empty when there's nothing to say yet.

export type LandmarkId = "cdmx" | "toronto" | "ny" | "sf" | "seoul" | "thailand" | "saopaulo" | "panama";

export type City = {
  id: LandmarkId;
  name: string;
  note: string;
  /** Position on the ground plane (x, z). */
  pos: [number, number];
  /** Height the camera looks at (roughly half the landmark). */
  lookY: number;
  /** Surrounding generic buildings. */
  density: number;
  maxHeight: number;
};

export const CITIES: City[] = [
  { id: "cdmx", name: "Mexico City", note: "", pos: [0, 0], lookY: 8, density: 46, maxHeight: 7 },
  {
    id: "toronto",
    name: "Toronto",
    note: "Global research internship · Mitacs @ York University",
    pos: [42, -32],
    lookY: 14,
    density: 40,
    maxHeight: 12,
  },
  { id: "ny", name: "New York", note: "", pos: [86, -8], lookY: 14, density: 60, maxHeight: 16 },
  { id: "sf", name: "San Francisco", note: "Domu · YC-backed startup", pos: [124, -44], lookY: 6, density: 26, maxHeight: 8 },
  {
    id: "seoul",
    name: "Seoul",
    note: "International semester · Dankook University",
    pos: [166, -18],
    lookY: 10,
    density: 44,
    maxHeight: 11,
  },
  { id: "thailand", name: "Thailand", note: "", pos: [204, -54], lookY: 7, density: 24, maxHeight: 5 },
  { id: "saopaulo", name: "São Paulo", note: "Work trip · Domu", pos: [244, -26], lookY: 8, density: 64, maxHeight: 15 },
  { id: "panama", name: "Panama City", note: "Work trip · Domu", pos: [282, -62], lookY: 12, density: 44, maxHeight: 14 },
];

/** Camera stops: overview → each city → final overview. */
export const STOP_COUNT = CITIES.length + 2;

const smooth = (f: number) => f * f * (3 - 2 * f);

/** Scroll progress (0–1) → position along the stops (u) and eased curve param (t), slowing at each stop. */
export function progressToStop(p: number) {
  const u = Math.min(Math.max(p, 0), 1) * (STOP_COUNT - 1);
  const seg = Math.min(Math.floor(u), STOP_COUNT - 2);
  return { u, t: (seg + smooth(u - seg)) / (STOP_COUNT - 1) };
}
