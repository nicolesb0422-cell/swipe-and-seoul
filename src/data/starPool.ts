export type Star = {
  name: string;
  group: string;
  mbti: string;
  matchDesc: string;
};

export const STAR_POOL: Record<string, Star[]> = {
  "Indoor Trend Seeker": [
    { name: "Jennie",         group: "BLACKPINK",  mbti: "INFJ", matchDesc: "Fashion Icon Mood" },
    { name: "Rosé",           group: "BLACKPINK",  mbti: "ENFP", matchDesc: "Hip Café Vibe" },
    { name: "J-Hope",         group: "BTS",        mbti: "ENFJ", matchDesc: "Street Fashion King" },
    { name: "Jisoo",          group: "BLACKPINK",  mbti: "INTJ", matchDesc: "Cute Pop-up Explorer" },
    { name: "Karina",         group: "aespa",      mbti: "ENFP", matchDesc: "Gourmet Hunter" },
    { name: "Jang Wonyoung",  group: "IVE",        mbti: "ESFJ", matchDesc: "Princess Dessert Vibe" },
    { name: "Cha Eun-woo",    group: "ASTRO",      mbti: "INFJ", matchDesc: "Gallery Lover" },
    { name: "Han So-hee",     group: "Actor",      mbti: "INFP", matchDesc: "Indie Art Vibe" },
  ],
  "Culture Explorer": [
    { name: "IU",             group: "Singer · Actor", mbti: "INFJ", matchDesc: "Timeless Cultural Soul" },
    { name: "Park Bo-gum",    group: "Actor",       mbti: "ENFJ", matchDesc: "Historical Drama Energy" },
    { name: "RM",             group: "BTS",         mbti: "INFP", matchDesc: "Museum Wanderer" },
    { name: "Kim Go-eun",     group: "Actor",       mbti: "INFP", matchDesc: "Indie Literary Vibe" },
    { name: "Gong Yoo",       group: "Actor",       mbti: "ISTJ", matchDesc: "Classic Taste Personified" },
    { name: "Yoona",          group: "SNSD",        mbti: "ISFJ", matchDesc: "Graceful & Timeless" },
    { name: "Lee Joon-gi",    group: "Actor",       mbti: "INFJ", matchDesc: "Joseon Era Spirit" },
    { name: "Song Hye-kyo",   group: "Actor",       mbti: "ISFP", matchDesc: "Classic Beauty Energy" },
  ],
  "Slow Healing Traveler": [
    { name: "V",              group: "BTS",         mbti: "INFP", matchDesc: "Artistic Soul Healer" },
    { name: "Suzy",           group: "Singer · Actor", mbti: "ISFP", matchDesc: "Natural Healing Vibe" },
    { name: "Hyun Bin",       group: "Actor",       mbti: "ISTJ", matchDesc: "Calm & Composed" },
    { name: "Park Hyung-sik", group: "Actor",       mbti: "ENFJ", matchDesc: "Warm Gentle Energy" },
    { name: "Son Ye-jin",     group: "Actor",       mbti: "INFJ", matchDesc: "Quiet Sophistication" },
    { name: "Seulgi",         group: "Red Velvet",  mbti: "ISTP", matchDesc: "Understated Cool" },
    { name: "IU",             group: "Singer · Actor", mbti: "INFJ", matchDesc: "Healing Music Vibes" },
    { name: "Jimin",          group: "BTS",         mbti: "ENFJ", matchDesc: "Soft & Soulful" },
  ],
  "Active Hotspot Hunter": [
    { name: "Jungkook",       group: "BTS",         mbti: "ISFP", matchDesc: "Golden Energy All Night" },
    { name: "Lisa",           group: "BLACKPINK",   mbti: "ESFP", matchDesc: "Crowd Magnet" },
    { name: "Felix",          group: "Stray Kids",  mbti: "ENFP", matchDesc: "Sunshine Hotspot Vibes" },
    { name: "Hyunjin",        group: "Stray Kids",  mbti: "ENFP", matchDesc: "Artistic Street King" },
    { name: "Nayeon",         group: "TWICE",       mbti: "ESFJ", matchDesc: "Bubbly Night Explorer" },
    { name: "NCT Taeyong",    group: "NCT 127",     mbti: "INTJ", matchDesc: "Underground Cool" },
    { name: "BamBam",         group: "GOT7",        mbti: "ENTP", matchDesc: "Fashion Forward & Fun" },
    { name: "Ningning",       group: "aespa",       mbti: "ENFP", matchDesc: "Trendy Hotspot Queen" },
  ],
};

export function pickStars(persona: string, count = 2): Star[] {
  const pool = STAR_POOL[persona] ?? [];
  return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
}
