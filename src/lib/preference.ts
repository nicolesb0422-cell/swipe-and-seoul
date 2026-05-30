import { PreferenceScore, PreferenceResult, TravelPersona } from "@/types";

export function calculatePersona(score: PreferenceScore): PreferenceResult {
  const isIndoor = score.indoor >= score.outdoor;
  const isTrendy = score.trendy >= score.classic;
  const isShopping = score.shopping >= score.experience;

  const key = `${isIndoor ? "indoor" : "outdoor"}-${isTrendy ? "trendy" : "classic"}-${isShopping ? "shopping" : "experience"}`;

  const personas: Record<string, PreferenceResult> = {
    "indoor-trendy-shopping": {
      persona: "Indoor Trend Seeker",
      description:
        "You prefer comfortable indoor spaces, trendy neighborhoods, and visually interesting places like concept stores, pop-ups, malls, and aesthetic cafés.",
      topTags: ["Indoor", "Trendy", "Shopping"],
      vibe: "Sleek, visual, and on-trend",
    },
    "indoor-trendy-experience": {
      persona: "Indoor Trend Seeker",
      description:
        "You love discovering the latest in Korean culture — immersive exhibits, concept spaces, and indoor experiences with a modern edge.",
      topTags: ["Indoor", "Trendy", "Experience"],
      vibe: "Curious, creative, and contemporary",
    },
    "outdoor-classic-experience": {
      persona: "Culture Explorer",
      description:
        "You're drawn to the layers of Korean history and culture — palaces, hanok villages, traditional markets, and authentic local food.",
      topTags: ["Outdoor", "Classic", "Experience"],
      vibe: "Thoughtful, curious, and grounded",
    },
    "outdoor-classic-shopping": {
      persona: "Culture Explorer",
      description:
        "You enjoy wandering traditional neighborhoods and picking up meaningful souvenirs — the kind of shopping that tells a story.",
      topTags: ["Outdoor", "Classic", "Shopping"],
      vibe: "Relaxed, authentic, and curious",
    },
    "indoor-classic-experience": {
      persona: "Slow Healing Traveler",
      description:
        "You travel to unwind. You prefer calm, quiet places — a pottery class, a traditional tea house, a slow morning at a local café.",
      topTags: ["Indoor", "Calm", "Experience"],
      vibe: "Peaceful, restorative, and intentional",
    },
    "indoor-classic-shopping": {
      persona: "Slow Healing Traveler",
      description:
        "You find joy in quiet browsing — artisan shops, traditional crafts, and peaceful indoor spaces away from the crowds.",
      topTags: ["Indoor", "Calm", "Shopping"],
      vibe: "Gentle, reflective, and unhurried",
    },
    "outdoor-trendy-experience": {
      persona: "Active Hotspot Hunter",
      description:
        "You want to be where things are happening. Street culture, pop-ups, crowds, energy — you thrive in the buzz of Seoul's trendiest outdoor spots.",
      topTags: ["Outdoor", "Trendy", "Experience"],
      vibe: "Bold, social, and always in the know",
    },
    "outdoor-trendy-shopping": {
      persona: "Active Hotspot Hunter",
      description:
        "You hunt for the newest drops, limited-edition finds, and outdoor markets. Shopping is an adventure, not a chore.",
      topTags: ["Outdoor", "Trendy", "Shopping"],
      vibe: "Energetic, stylish, and spontaneous",
    },
  };

  return personas[key] ?? personas["indoor-trendy-shopping"];
}

export function getPersonaEmoji(persona: TravelPersona): string {
  const map: Record<TravelPersona, string> = {
    "Indoor Trend Seeker": "✦",
    "Culture Explorer": "◈",
    "Slow Healing Traveler": "◌",
    "Active Hotspot Hunter": "◉",
  };
  return map[persona];
}
