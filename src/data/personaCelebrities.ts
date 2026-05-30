export type PersonaCelebs = {
  female: { name: string; group: string };
  male: { name: string; group: string };
  matchLine: string;
};

export const PERSONA_CELEBS: Record<string, PersonaCelebs> = {
  "Indoor Trend Seeker": {
    matchLine: "Style icons who live for the aesthetic ✦",
    female: { name: "Jang Wonyoung", group: "IVE" },
    male: { name: "Cha Eun-woo", group: "ASTRO" },
  },
  "Culture Explorer": {
    matchLine: "Cultural souls who feel history deeply ✦",
    female: { name: "IU", group: "Singer · Actor" },
    male: { name: "Park Bo-gum", group: "Actor" },
  },
  "Slow Healing Traveler": {
    matchLine: "Calm spirits who travel for the soul ✦",
    female: { name: "Suzy", group: "Singer · Actor" },
    male: { name: "V", group: "BTS" },
  },
  "Active Hotspot Hunter": {
    matchLine: "High-energy icons who light up every room ✦",
    female: { name: "Rosé", group: "BLACKPINK" },
    male: { name: "Jungkook", group: "BTS" },
  },
};
