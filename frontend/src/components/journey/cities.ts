// frontend/src/components/journey/cities.ts
// The 3D journey: districts are experiences (not a city tour). Edit copy here.

export type LandmarkId = "cdmx" | "toronto" | "seoul" | "thailand" | "saopaulo" | "panama";

export type District = {
  id: string;
  /** Center on the ground plane (x, z). */
  pos: [number, number];
  /** Landmarks placed in this district, offset from its center (x, z). */
  landmarks: { id: LandmarkId; offset: [number, number] }[];
  /** Height the camera looks at. */
  lookY: number;
  /** Camera distance multiplier (bigger districts need more room). */
  zoom: number;
  density: number;
  maxHeight: number;
};

export type StopCopy = {
  eyebrow: string;
  title: string;
  body: string;
  tag: string;
};

export type Stop = { district: District; copy: StopCopy };

const ASIA: District = {
  id: "asia",
  pos: [0, 0],
  landmarks: [
    { id: "seoul", offset: [-9, -2] },
    { id: "thailand", offset: [11, 5] },
  ],
  lookY: 9,
  zoom: 1.5,
  density: 46,
  maxHeight: 9,
};

const CDMX: District = {
  id: "cdmx",
  pos: [52, -34],
  landmarks: [{ id: "cdmx", offset: [0, 0] }],
  lookY: 9,
  zoom: 1.1,
  density: 50,
  maxHeight: 8,
};

const LATAM: District = {
  id: "latam",
  pos: [104, -6],
  landmarks: [
    { id: "saopaulo", offset: [-6, 2] },
    { id: "panama", offset: [12, -11] },
  ],
  lookY: 10,
  zoom: 1.45,
  density: 70,
  maxHeight: 15,
};

const TORONTO: District = {
  id: "toronto",
  pos: [154, -40],
  landmarks: [{ id: "toronto", offset: [0, 0] }],
  lookY: 15,
  zoom: 1.2,
  density: 44,
  maxHeight: 12,
};

export const DISTRICTS: District[] = [ASIA, CDMX, LATAM, TORONTO];

export const INTRO_COPY = {
  title: "I'm Marco López, a dream builder.",
  roles: "Product Designer & AI Engineer · Leader, developer and designer · English & Spanish",
};

export const STOPS: Stop[] = [
  {
    district: ASIA,
    copy: {
      eyebrow: "Across borders",
      title: "It led me across borders.",
      body: "A semester in Seoul, research in Toronto, work in São Paulo and Panama.",
      tag: "Dankook University · Global Business semester",
    },
  },
  {
    district: CDMX,
    copy: {
      eyebrow: "Leader",
      title: "I lead with heart.",
      body: "Communities, teams and programs built around people, not titles.",
      tag: "TrepCamp · Highest investment potential project",
    },
  },
  {
    district: LATAM,
    copy: {
      eyebrow: "Developer",
      title: "I ship what I dream.",
      body: "From hackathon MVPs to AI voice agents handling thousands of calls a day.",
      tag: "Domu · YC-backed startup · LATAM",
    },
  },
  {
    district: TORONTO,
    copy: {
      eyebrow: "Designer",
      title: "I make it useful and beautiful.",
      body: "Product thinking, design systems and decisions backed by data.",
      tag: "Mitacs @ York University · Head of UI Design",
    },
  },
];

export const OUTRO_COPY = {
  title: "Leader. Developer. Designer.",
  body: "Explore the projects behind each one.",
};

/** Camera stops: opening overview → each district → closing overview. */
export const STOP_COUNT = STOPS.length + 2;

const smooth = (f: number) => f * f * (3 - 2 * f);

/** Scroll progress (0–1) → position along the stops (u) and eased curve param (t), slowing at each stop. */
export function progressToStop(p: number) {
  const u = Math.min(Math.max(p, 0), 1) * (STOP_COUNT - 1);
  const seg = Math.min(Math.floor(u), STOP_COUNT - 2);
  return { u, t: (seg + smooth(u - seg)) / (STOP_COUNT - 1) };
}
