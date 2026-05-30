"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { calculatePersona } from "@/lib/preference";
import { TravelPersona } from "@/types";
import tripPlans from "@/data/tripPlans.json";
import swipePlaces from "@/data/swipePlaces.json";

const MAX_GENERATES = 3;

// Dietary alternatives — keys must match the English stop names in tripPlans.json exactly
const VEGAN_ALTERNATIVES: Record<string, Partial<PlanStop>> = {
  // Yeouido ─ The Hyundai B2 Food Hall → PLANT
  "The Hyundai B2 Food Hall": {
    name: "PLANT (The Hyundai Seoul B2)",
    description:
      "Seoul's best in-mall vegan restaurant, right inside The Hyundai Seoul B2. 100% plant-based burgers, vegan taco salads, and brunch plates — no compromises.",
    tip: "The plant-based burger with cashew cheese and the grain bowl are bestsellers. Look for the green signage on the B2 south wing.",
    budget: "Moderate",
    naverQuery: "플랜트 더현대서울",
  },

  // Jongno ─ Euljiro Beer Alley → Maru Natural Kimbap
  "Euljiro Nogaridari (Beer Alley)": {
    name: "Maru Natural Kimbap (Insadong)",
    description:
      "Seoul's original vegan kimbap shop in Insadong. No processed ham — tofu, soy protein, and carrots instead. No MSG, no animal products, just clean Korean street food.",
    tip: "The sea vegetable roll and sesame tofu kimbap are the must-orders. Cash only, small shop — arrive before 7 PM.",
    budget: "Budget",
    naverQuery: "마루자연식김밥 인사동",
  },

  // Jongno ─ Tongin Market: mostly plant-based already; update tip only
  "Tongin Market Dosirak Café": {
    tip: "Vegan-friendly tip: Most stalls offer naturally plant-based options — pick 떡 (rice cakes), 두부조림 (braised tofu), 김치전 (kimchi pancake), 잡채 (glass noodles). Avoid the fish cake (어묵) stalls. Point and smile — vendors are used to dietary questions.",
  },

  // Gangnam ─ Gangnam Gyoja → Gosari Express
  "Gangnam Gyoja": {
    name: "Gosari Express",
    description:
      "Michelin Bib Gourmand — and 100% vegan. Gosari (fernbrake fern) tteokbokki in perilla oil is the signature, alongside a vegan gosari stew. One of the best plant-based meals in Gangnam.",
    tip: "The gosari tteokbokki in perilla oil is the star — rich and deeply savory with zero animal products. Everything on the menu is fully plant-based.",
    budget: "Budget",
    naverQuery: "고사리 익스프레스 강남",
  },

  // Gangnam ─ Gangnam Dinner (generic) → update search query
  "Gangnam Dinner": {
    tip: "Vegan pick: Gosari Express (Michelin Bib, 10 min walk) is the area's top plant-based spot. Or search '가로수길 비건' on Naver Map for current vegan options along Garosu-gil.",
    naverQuery: "가로수길 비건 맛집",
  },

  // Hongdae ─ Tuk Tuk Noodle Thai → Sukara
  "Tuk Tuk Noodle Thai": {
    name: "Sukara",
    description:
      "A macrobiotic vegan café in the same Yeonnam-dong alleyways as Tuk Tuk. Organic brown rice plates, seasonal vegetable courses, and fermented sides — slow food done seriously.",
    tip: "The seasonal vegetable plate with brown rice and miso soup is the core order. Wholesome portions, perfect for a relaxed lunch.",
    budget: "Moderate",
    naverQuery: "수카라 연남동",
  },

  // Jamsil ─ Lotte World Mall Food Hall → guide to vegan options
  "Lotte World Mall Food Hall": {
    tip: "Vegan tip: Head to the grain bowl and fresh salad counters on the basement food floor. Japanese tofu and Korean vegetable bibimbap stalls are usually available. Ask staff for 비건 (vegan) — Lotte's tourist-facing staff are used to the question.",
    naverQuery: "롯데월드몰 비건",
  },

  // Jamsil ─ Jamsil Dinner (generic)
  "Jamsil Dinner": {
    tip: "Vegan tip: Search '잠실 비건 맛집' on Naver Map. The Seokchon Lake area has grown quickly — new plant-based options have opened near 잠실나루역.",
    naverQuery: "잠실 비건 맛집",
  },

  // Myeongdong ─ Myeongdong Kyoja → Osekyehyang
  "Myeongdong Kyoja": {
    name: "Osekyehyang",
    description:
      "Seoul's most beloved vegetarian Korean restaurant, a short walk from Myeongdong. Vegan bulgogi ssambap (lettuce-wrap \"beef\" made from soy protein), plant-based doenjang stew, and a seasonal namul set.",
    tip: "The vegan bulgogi ssambap and the seasonal namul set are the highlights. Ask specifically for the plant-based doenjang jjigae.",
    budget: "Moderate",
    naverQuery: "오세계향 명동",
  },

  // Myeongdong ─ Myeongdong Dinner (generic)
  "Myeongdong Dinner": {
    tip: "Vegan pick: Osekyehyang (10 min walk) is Seoul's top vegan Korean restaurant — best dinner option in this area. Or search '명동 비건' on Naver Map.",
    naverQuery: "명동 비건 맛집",
  },

  // Seongsu ─ Seongsu-dong Dinner (generic)
  "Seongsu-dong Dinner": {
    tip: "Vegan tip: Seongsu's creative food scene has several plant-based options. Search '성수동 비건 맛집' on Naver Map — the area around 뚝섬역 has the best density.",
    naverQuery: "성수동 비건 맛집",
  },
};

const HALAL_ALTERNATIVES: Record<string, Partial<PlanStop>> = {
  // Yeouido ─ The Hyundai B2 Food Hall → Maharaja Yeouido
  "The Hyundai B2 Food Hall": {
    name: "Maharaja Yeouido",
    description:
      "KMF halal-certified Indian restaurant near IFC Mall, run by a Muslim chef. Butter chicken, palak paneer, and garlic naan are the signatures. A 5-minute walk from The Hyundai Seoul.",
    tip: "The butter chicken and garlic naan are the must-orders. Fully KMF halal-certified. Walk toward IFC Mall — it's right in the complex.",
    budget: "Moderate",
    naverQuery: "마하라자 여의도",
  },

  // Jongno ─ Tongin Market → Couscous (Seochon)
  "Tongin Market Dosirak Café": {
    name: "Couscous (Seochon)",
    description:
      "A halal-certified Tunisian restaurant 5 minutes from Tongin Market in Seochon. Lamb couscous with vegetable stew is the signature, and spice levels are fully customizable.",
    tip: "The couscous with lamb stew is the signature. Ask for mild spice (맵지 않게 해주세요). One of the few North African restaurants in Seoul.",
    budget: "Moderate",
    naverQuery: "쿠스쿠스 서촌",
  },

  // Jongno ─ Euljiro Beer Alley → Kandahar
  "Euljiro Nogaridari (Beer Alley)": {
    name: "Kandahar",
    description:
      "Central Asian and Afghan halal cuisine in Jongno. Lamb shashlik and kabuli pulao (Afghan rice with carrots and raisins) are the standouts. Mild spice by default — works for No Spicy travelers too.",
    tip: "The lamb shashlik and kabuli pulao are the signature dishes. Halal-certified and spice level is customizable.",
    budget: "Moderate",
    naverQuery: "칸다하르 종로",
  },

  // Gangnam ─ Gangnam Gyoja → The Halal Guys
  "Gangnam Gyoja": {
    name: "The Halal Guys Gangnam",
    description:
      "The New York halal institution's Gangnam outpost. Chicken over rice, falafel platter, and the iconic white sauce combo — KMF halal-certified, 5 minutes from Gangnam Station.",
    tip: "The chicken over rice with white sauce is the classic order. Ask for extra white sauce on the side. Fully KMF halal-certified.",
    budget: "Budget",
    naverQuery: "할랄가이즈 강남",
  },

  // Gangnam ─ Gangnam Dinner (generic)
  "Gangnam Dinner": {
    tip: "Halal picks: The Halal Guys Gangnam (KMF certified, Budget) or Luna Asia (Muslim-owned Indian curry, ₩50–150k) are both nearby. Search '강남 할랄' on Naver Map for more.",
    naverQuery: "강남 할랄 맛집",
  },

  // Hongdae ─ Tuk Tuk Noodle Thai → New Shalimar
  "Tuk Tuk Noodle Thai": {
    name: "New Shalimar",
    description:
      "Authentic Pakistani and Indian cuisine near Hongdae main gate — the go-to halal spot for Seoul's Muslim community. Lamb curry, tandoori chicken, and dahi puri are the signatures. 100% halal meat, no exceptions.",
    tip: "The lamb curry and tandoori chicken are the highlights. Run by a Pakistani owner — halal certification is absolute, not just Muslim-friendly.",
    budget: "Moderate",
    naverQuery: "뉴샬리마 홍대",
  },

  // Jamsil ─ Lotte World Mall Food Hall
  "Lotte World Mall Food Hall": {
    tip: "Halal tip: Lotte World caters extensively to Muslim tourists. Ask at the 1F Information Desk for the current halal-certified restaurants (할랄 식당 어디 있어요?). The food court usually has at least one KMF-certified stall.",
    naverQuery: "롯데월드몰 할랄",
  },

  // Jamsil ─ Jamsil Dinner (generic)
  "Jamsil Dinner": {
    tip: "Halal tip: The Lotte World area has multiple certified halal restaurants catering to Muslim visitors. Search '잠실 할랄 맛집' on Naver Map or ask at your hotel.",
    naverQuery: "잠실 할랄 맛집",
  },

  // Myeongdong ─ Myeongdong Kyoja → Ilji Hanbang Samgyetang
  "Myeongdong Kyoja": {
    name: "Ilji Hanbang Samgyetang",
    description:
      "Myeongdong's officially certified Muslim-friendly samgyetang restaurant. Halal-certified chicken brewed with ginseng, jujube, and sticky rice — mild, nourishing, and naturally spice-free.",
    tip: "The classic samgyetang is mild, deeply nourishing, and KMF halal-certified. Add extra sticky rice into the pot at the end — it soaks up the broth beautifully.",
    budget: "Moderate",
    naverQuery: "일지한방삼계탕 명동",
  },

  // Myeongdong ─ Myeongdong Dinner (generic)
  "Myeongdong Dinner": {
    tip: "Halal picks: Kampung Koo (halal K-chicken and tteokbokki, Budget) and Ilji Hanbang Samgyetang (KMF certified) are both in this area. Search '명동 할랄' on Naver Map.",
    naverQuery: "명동 할랄 맛집",
  },

  // Seongsu ─ Seongsu-dong Dinner (generic)
  "Seongsu-dong Dinner": {
    tip: "Halal tip: Search '성수동 할랄 맛집' on Naver Map. The Seongsu food scene has grown rapidly — new halal options open frequently near 뚝섬역 and the pop-up district.",
    naverQuery: "성수동 할랄 맛집",
  },
};

function resolveStop(stop: PlanStop, dietary: string[]): PlanStop {
  if (!stop.name || stop.type !== "food") return stop;
  if (dietary.includes("Vegan") && VEGAN_ALTERNATIVES[stop.name]) {
    return { ...stop, ...VEGAN_ALTERNATIVES[stop.name] };
  }
  if (dietary.includes("Halal") && HALAL_ALTERNATIVES[stop.name]) {
    return { ...stop, ...HALAL_ALTERNATIVES[stop.name] };
  }
  return stop;
}

type AlternativeStop = {
  type: string;
  name: string;
  description: string;
  tip?: string;
  budget?: string;
  naverQuery?: string;
};

const AREA_ALTERNATIVES: Record<string, AlternativeStop[]> = {
  Jongno: [
    { type: "experience", name: "Changdeokgung Secret Garden", description: "A hidden Joseon-era garden tucked behind Changdeokgung Palace — pavilions, lotus ponds, and 300-year-old trees. Guided tours only, limited slots per hour.", tip: "Book online in advance. The Injeongjeon throne hall and the moon gate leading to the garden are the highlights.", budget: "Budget", naverQuery: "창덕궁 후원" },
    { type: "cafe", name: "Cafe Bora", description: "Insadong's most photographed café — charcoal black soft-serve with indigo hues. Minimalist hanok exterior and some of the most Instagrammable drinks in Seoul.", tip: "The charcoal soft-serve cone is the signature. Arrive early — the line forms fast on weekends.", budget: "Budget", naverQuery: "카페보라 인사동" },
    { type: "shopping", name: "Gwangjang Market", description: "Seoul's oldest traditional market. Raw silk fabrics on the upper floors, and the famous night food hall below — bindaetteok (mung bean pancake) stands run by the same grandmothers for 30 years.", tip: "The 2F textile section is calm; the basement food stalls are packed but worth it. The mayak kimbap (addictive rice rolls) are legendary.", budget: "Budget", naverQuery: "광장시장" },
    { type: "attraction", name: "Seochon Village", description: "The quieter, more residential twin of Bukchon — narrow alleys, indie cafés in converted hanok, and a neighborhood feel that tourist Seoul rarely shows.", tip: "Explore without a map — the alleys between Gyeongbokgung and Inwangsan are the best part. The mural alley near Jahamun-ro is worth finding.", budget: "Free", naverQuery: "서촌 한옥마을" },
  ],
  Gangnam: [
    { type: "experience", name: "COEX Starfield Library", description: "One of the largest libraries in Asia — 13m-tall bookshelves, a dramatic atrium, and completely free to visit. Technically inside a mall but feels like another world.", tip: "Visit on a weekday morning for the best atmosphere. The café inside the library is a great spot to sit and absorb the scale.", budget: "Free", naverQuery: "별마당 도서관" },
    { type: "cafe", name: "Fritz Coffee Gangnam", description: "Seoul's most beloved specialty roaster — single origin pour-overs, house-made pastries, and an obsessively curated space. The Gangnam branch is the flagship.", tip: "The almond croissant and the seasonal single origin are the orders. Arrive before 11 AM on weekends.", budget: "Budget", naverQuery: "프릳츠 커피 강남" },
    { type: "shopping", name: "Garosu-gil", description: "Gangnam's tree-lined fashion street — boutique concept stores, Korean designer labels, and the best window-shopping in the area. One of the few streets in Seoul that feels genuinely beautiful to walk.", tip: "Explore the side alleys off the main strip — the best independent shops are tucked away. The strip between Sinnonhyeon station and Garosu-gil exit is the core.", budget: "Free", naverQuery: "가로수길" },
    { type: "attraction", name: "Bongeunsa Temple", description: "A Buddhist temple complex in the middle of Gangnam — the contrast between the modern skyline and the 1,200-year-old temple grounds is striking.", tip: "The giant Mireuk statue behind the main hall is 23 meters tall. Temple Stay programs run on weekends. Free entry, calm even on busy days.", budget: "Free", naverQuery: "봉은사" },
  ],
  Hongdae: [
    { type: "experience", name: "Hongdae Free Market", description: "A weekend artist market where independent creators sell directly — jewelry, ceramics, prints, and one-of-a-kind pieces you won't find anywhere else in Seoul.", tip: "Runs Saturday afternoons near Hongik University main gate. The work is genuinely handmade — prices reflect that. Show up with cash.", budget: "Free", naverQuery: "홍대 프리마켓" },
    { type: "cafe", name: "Anthracite Hongdae", description: "A former shoe factory converted into a multi-level specialty coffee space — exposed concrete, 10-meter ceilings, and some of the most serious espresso in Seoul.", tip: "The cold brew and the espresso tonic are the signatures. The upper level has a great view of the factory structure.", budget: "Budget", naverQuery: "앤트러사이트 홍대" },
    { type: "shopping", name: "Aha! Vintage", description: "The best curated vintage shop in the Hongdae area — 1990s Japanese streetwear, vintage Levi's, and Korean retro pieces at prices that still make sense.", tip: "Arrive early for the best selection. The staff speak some English. Items are organized by era, not just type.", budget: "Budget", naverQuery: "아하 빈티지 홍대" },
    { type: "attraction", name: "Yeonnam-dong Alleyways", description: "The neighborhood the locals moved to when Hongdae got too busy — lower-key cafés, independent restaurants, and a weekend pop-up culture that changes every week.", tip: "The area between Gyeongui Line Forest Park and Donggyo-ro is the core. Walk without a plan — the best spots are the unmarked ones.", budget: "Free", naverQuery: "연남동 골목길" },
  ],
  Yeouido: [
    { type: "experience", name: "IFC Seoul Sky Lobby", description: "Free access to the Sky Lobby on the 55th floor of IFC Tower 3 — one of the best free views in Seoul, with floor-to-ceiling glass facing the Han River.", tip: "Take the express elevator to floor 55. Late afternoon gives you both the city view and the golden hour light on the river.", budget: "Free", naverQuery: "IFC 서울 스카이로비" },
    { type: "cafe", name: "Bespoke Coffee Roasters", description: "A serious third-wave roastery near Yeouido Park — seasonal single origins, immaculate pour-overs, and a clean minimal space that's the opposite of Instagram-trap coffee.", tip: "Ask the barista what's on the filter bar that day. The seasonal single origin is always the right order.", budget: "Budget", naverQuery: "베스포크 커피 여의도" },
    { type: "shopping", name: "IFC Mall", description: "Yeouido's high-end indoor mall — international brands, a strong food basement, and direct subway access. Less crowded than COEX with a more local office-worker crowd.", tip: "The B2 food hall has some of the best prepared food in the area. The atrium gets good light on clear days.", budget: "Moderate", naverQuery: "IFC몰 여의도" },
    { type: "attraction", name: "Yeouido Hangang Park", description: "The main Han River park on Yeouido — wide open lawns, rental bikes along 10km of riverside, and a very local weekend vibe of picnics and cycling families.", tip: "Bike rental is at the entrance near the main gate (₩3,000/hour). The best stretch is heading south toward the bridges — quieter and better views.", budget: "Free", naverQuery: "여의도 한강공원" },
  ],
  Seongsu: [
    { type: "experience", name: "Seoul Forest", description: "A 595,000㎡ urban park with deer in an enclosed meadow, outdoor theater, and a family zone that feels nothing like city Seoul.", tip: "The deer are in the ecological garden on the east side. Free entry, great for a slow morning walk. The Han River bike path starts here.", budget: "Free", naverQuery: "서울숲" },
    { type: "cafe", name: "Daelim Changgo", description: "A converted industrial warehouse turned coffee and lifestyle space — rotating pop-up brands, a serious coffee bar, and the largest interior in the Seongsu pop-up district.", tip: "The espresso drinks are consistently good. The space reconfigures every few months so what you see is always fresh.", budget: "Budget", naverQuery: "대림창고 성수" },
    { type: "shopping", name: "Seongsu-dong Boutique District", description: "Korea's answer to London's Shoreditch — former tannery and factory buildings converted into independent fashion ateliers, design studios, and concept stores.", tip: "Walk along Seongsuil-ro 4-gil for the highest density of interesting stores. Many shops are open from noon and close by 8 PM.", budget: "Budget", naverQuery: "성수동 편집샵" },
    { type: "attraction", name: "Ttukseom Resort Hangang Park", description: "The riverfront park directly below Seongsu — kayak and bike rentals, open swimming in summer, and a view of the city that no rooftop bar can match.", tip: "The kayak rental (₩10,000/30 min) runs until sunset. The stretch of river facing Jamsil is the best angle for photos.", budget: "Free", naverQuery: "뚝섬 한강공원" },
  ],
  Jamsil: [
    { type: "experience", name: "Lotte World Adventure", description: "Korea's largest indoor theme park — ice skating rink, folk museum, and the full park rides in a single complex. Worth it even just for the indoor section.", tip: "The Folk Museum on the lower floors is free with park entry. The log flume and gyro drop are the highest-capacity rides — do these first.", budget: "Moderate", naverQuery: "롯데월드 어드벤처" },
    { type: "cafe", name: "Café Noriter", description: "A Seokchon Lake-facing café with one of the best terraces in Jamsil — the view of the lake and Lotte Tower together is as good as any in the area.", tip: "Grab a window or terrace seat. The signature lattes are solid. This is the place to slow down after the Lotte Tower rush.", budget: "Budget", naverQuery: "카페 노리터 석촌호수" },
    { type: "shopping", name: "Lotte World Mall", description: "Eight floors of retail above Seokchon Lake — Korean brands, international flagships, and a well-curated lifestyle section on the upper floors.", tip: "The 5F and 6F have the best mix of Korean design brands. The basement food hall is excellent for a quick meal.", budget: "Moderate", naverQuery: "롯데월드몰" },
    { type: "attraction", name: "Seokchon Lake Walk", description: "A 2.5km loop around the twin lakes flanking Lotte Tower — the classic daytime walk in Jamsil, with the tower reflection in the water as the payoff.", tip: "The east lake (smaller) is less crowded. The cherry blossoms in spring make this one of Seoul's most famous walks.", budget: "Free", naverQuery: "석촌호수" },
  ],
  Myeongdong: [
    { type: "experience", name: "Namsan Seoul Tower", description: "The tower on the hill above Myeongdong — the walk up through Namsan Park is as good as the view. Lock culture on the fences has made the deck an institution.", tip: "The cable car runs from below Myeongdong station. Walk down rather than back up — the Namsangol Hanok Village at the base is worth seeing.", budget: "Budget", naverQuery: "남산서울타워" },
    { type: "cafe", name: "Coffee Bay Myeongdong", description: "A calm rooftop café above Myeongdong street level — the best escape from the street crowd, with a clear view over the main strip.", tip: "Find the elevator entrance off the main Myeongdong pedestrian street. Tables on the terrace go fast — arrive early.", budget: "Budget", naverQuery: "커피베이 명동" },
    { type: "shopping", name: "Myeongdong Underground Shopping Center", description: "The vast underground network beneath Myeongdong — Korean fashion basics, accessories, and the best prices on everyday items without the street-level premium.", tip: "The underground mall runs from Myeongdong station toward Eulji-ro. Best for basics — hoodies, socks, bags at half the street price.", budget: "Budget", naverQuery: "명동 지하쇼핑센터" },
    { type: "attraction", name: "Namsangol Hanok Village", description: "Five restored hanok at the foot of Namsan — more residential and authentic than Bukchon, with a traditional performance stage and seasonal events.", tip: "Free entry. The late afternoon light on the hanok rooftops is beautiful. The folk performance schedule is posted at the entrance gate.", budget: "Free", naverQuery: "남산골 한옥마을" },
  ],
  Itaewon: [
    { type: "experience", name: "War Memorial of Korea", description: "One of the most impressive free museums in Seoul — outdoor exhibits of tanks, fighter jets, and warships alongside the comprehensive indoor Korean War history.", tip: "Free entry. The outdoor exhibits alone take an hour. The main hall's scale models of historical battles are unexpectedly gripping.", budget: "Free", naverQuery: "전쟁기념관" },
    { type: "cafe", name: "Passion 5", description: "A multi-floor patisserie and café in the Hangangjin area — French-trained pastry chefs, seasonal cakes, and an interior designed around the production kitchen.", tip: "The seasonal layer cake and croissants are the standouts. The B1 bakery section has the best selection. Weekend mornings are busiest.", budget: "Moderate", naverQuery: "패션5 한남동" },
    { type: "shopping", name: "Hannam-dong Boutiques", description: "The neighborhood connecting Itaewon and Gangnam — Korea's highest concentration of multi-brand fashion boutiques, design galleries, and concept stores.", tip: "Walk along Itaewon-ro 55-gil and the surrounding blocks. The area from Hangangjin station to Hannam-dong main street has the best density.", budget: "Moderate", naverQuery: "한남동 편집샵" },
    { type: "attraction", name: "Leeum Samsung Museum of Art", description: "Korea's most important private art collection — traditional Korean ceramics and Buddhist art in one building, contemporary Korean and international art in the other.", tip: "Free to enter the courtyard and gift shop. Paid admission covers both galleries. The outdoor sculpture garden has work by Koons and Serra.", budget: "Moderate", naverQuery: "리움미술관" },
  ],
};

function getAlternative(stop: PlanStop, rejectedIndex: number, existingNames: Set<string>): AlternativeStop | null {
  const alternatives = AREA_ALTERNATIVES[stop.area ?? ""];
  if (!alternatives) return null;
  const filtered = alternatives.filter((a) => a.type !== stop.type && !existingNames.has(a.name));
  const pool = filtered.length > 0 ? filtered : alternatives.filter((a) => !existingNames.has(a.name));
  if (pool.length === 0) return null;
  return pool[rejectedIndex % pool.length] ?? null;
}

const areaToPlaneId: Record<string, string> = {
  "Yeouido": "plan-yeouido",
  "Jongno": "plan-jongno",
  "Seongsu": "plan-seongsu",
  "Gangnam": "plan-gangnam",
  "Hongdae": "plan-hongdae",
  "Jamsil": "plan-jamsil",
  "Myeongdong": "plan-myeongdong",
  "Itaewon": "plan-itaewon",
};

// Maps swipe place names that don't exactly match plan stop names
const SWIPE_TO_PLAN_NAMES: Record<string, string[]> = {
  "Han River Picnic": ["Yeouido Han River Park", "Han River Night Picnic"],
  "63 Building & Art Museum": ["63 Building Sky Art"],
  "K-Beauty Flagship Store": ["Olive Young Gangnam Town"],
  "Hongdae Street": ["Hongdae Main Street"],
  "Seokchon Lake Park": ["Seokchon Lake Morning Walk"],
  "Myeongdong Street": ["Myeongdong K-Beauty District"],
  "Haebangchon (HBC)": ["Haebangchon (HBC) Café Crawl"],
  "Itaewon Cocktail Bar Alley": ["Itaewon Craft Cocktail Bars"],
};

const typeColors: Record<string, string> = {
  cafe: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  food: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  shopping: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  attraction: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  experience: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  bar: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

const typeLabel: Record<string, string> = {
  cafe: "Café",
  food: "Food",
  shopping: "Shopping",
  attraction: "Must-See",
  experience: "Experience",
  bar: "Nightlife",
};

type PlanStop = {
  time?: string;
  type?: string;
  name?: string;
  area?: string;
  description?: string;
  tip?: string;
  budget?: string;
  naverQuery?: string;
  todayOnly?: boolean;
  transit?: string;
};

export default function PlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<(typeof tripPlans)[0] | null>(null);
  const [generateCount, setGenerateCount] = useState(0);
  const [persona, setPersona] = useState<TravelPersona | null>(null);
  const [visible, setVisible] = useState(false);
  const [dietary, setDietary] = useState<string[]>([]);
  const [rejectedPlanNames, setRejectedPlanNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    const score = storage.getPreferenceScore();
    if (!score) { router.replace("/swipe"); return; }

    const result = calculatePersona(score);
    setPersona(result.persona);

    const profile = storage.getUserProfile();
    const planId = areaToPlaneId[profile?.baseArea ?? ""] ?? "plan-gangnam";
    const matched = (tripPlans as (typeof tripPlans)).find((p) => p.id === planId);
    setPlan(matched ?? tripPlans[0]);
    setDietary(profile?.dietaryPreferences ?? []);

    const swipeResults = storage.getSwipeResults();
    if (swipeResults) {
      const rejected = new Set<string>();
      (swipePlaces as typeof swipePlaces).forEach((place) => {
        if (swipeResults[place.id] === false) {
          rejected.add(place.name);
          SWIPE_TO_PLAN_NAMES[place.name]?.forEach((n) => rejected.add(n));
        }
      });
      setRejectedPlanNames(rejected);
    }

    const count = storage.getGenerateCount();
    if (count === 0) {
      // First time viewing plan = 1 generate used
      storage.incrementGenerateCount();
      setGenerateCount(1);
    } else {
      setGenerateCount(count);
    }

    setTimeout(() => setVisible(true), 60);
  }, []);

  function handleGenerate() {
    if (generateCount >= MAX_GENERATES) return;
    const next = storage.incrementGenerateCount();
    setGenerateCount(next);
    setVisible(false);
    setTimeout(() => setVisible(true), 100);
  }

  if (!plan || !persona) return null;

  const stops = plan.stops as PlanStop[];
  const isAtLimit = generateCount >= MAX_GENERATES;
  const planStopNames = new Set(stops.map((s) => s.name).filter(Boolean) as string[]);

  return (
    <main className="flex flex-col min-h-dvh bg-neutral-950 pb-10 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 text-lg mb-5"
        >
          ←
        </button>

        <p className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-1">
          {persona}
        </p>
        <h1 className="text-[26px] font-black text-white leading-tight">
          {plan.title}
        </h1>
        <p className="text-[13px] text-white/50 mt-1 flex items-center gap-1">
          <span>📍</span> {plan.baseArea}
        </p>

        {/* Fit reason pill */}
        <div className="mt-3 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
          <p className="text-[12px] text-purple-300 leading-snug">{plan.fitReason}</p>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="flex-1 px-5"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {stops.map((stop, i) => {
          if (stop.transit) {
            return (
              <div key={i} className="flex items-center gap-3 my-1 px-1">
                <div className="flex flex-col items-center">
                  <div className="w-px h-4 bg-white/10" />
                  <div className="w-6 h-6 rounded-full bg-white/6 flex items-center justify-center">
                    <span className="text-[9px]">🚶</span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                </div>
                <p className="text-[11px] text-white/30 font-semibold">{stop.transit}</p>
              </div>
            );
          }

          const resolved = resolveStop(stop, dietary);
          const colorClass = typeColors[resolved.type ?? "attraction"];
          const isRejected = stop.name ? rejectedPlanNames.has(stop.name) : false;

          if (isRejected) {
            const rejectedIndex = stops.slice(0, i).filter((s) => s.name && rejectedPlanNames.has(s.name)).length;
            const alt = getAlternative(stop, rejectedIndex, planStopNames);
            const altColorClass = typeColors[alt?.type ?? "attraction"];
            return (
              <div key={i} className="flex gap-3 mb-1">
                <div className="flex flex-col items-center pt-1" style={{ minWidth: "60px" }}>
                  <span className="text-[11px] font-bold text-white/20 whitespace-nowrap">{stop.time}</span>
                  {i < stops.length - 2 && (
                    <div className="w-px flex-1 bg-white/8 mt-1" style={{ minHeight: "40px" }} />
                  )}
                </div>
                {alt ? (
                  <div className="flex-1 mb-3 rounded-2xl bg-white/3 border border-dashed border-white/15 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border opacity-60 ${altColorClass}`}>
                        {typeLabel[alt.type ?? "attraction"]}
                      </span>
                      <span className="text-[10px] font-semibold text-white/25 uppercase tracking-wider">Alternative</span>
                    </div>
                    <h3 className="text-[14px] font-bold text-white/60 leading-tight">{alt.name}</h3>
                    <p className="text-[11px] text-white/30 font-semibold mt-0.5 mb-2">📍 {stop.area}</p>
                    <p className="text-[11px] text-white/35 leading-relaxed">{alt.description}</p>
                    {alt.budget && (
                      <p className="text-[11px] text-white/20 mt-2">{alt.budget}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 mb-3 rounded-2xl bg-white/2 border border-dashed border-white/10 p-4 flex items-center gap-3">
                    <span className="text-lg opacity-30">✕</span>
                    <div>
                      <p className="text-[12px] font-bold text-white/20">You passed on this</p>
                      <p className="text-[11px] text-white/15 mt-0.5">Free time around {stop.area ?? "this area"}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={i} className="flex gap-3 mb-1">
              {/* Left: time + line */}
              <div className="flex flex-col items-center pt-1" style={{ minWidth: "60px" }}>
                <span className="text-[11px] font-bold text-white/40 whitespace-nowrap">
                  {resolved.time}
                </span>
                {i < stops.length - 2 && (
                  <div className="w-px flex-1 bg-white/8 mt-1" style={{ minHeight: "40px" }} />
                )}
              </div>

              {/* Right: card */}
              <div className="flex-1 mb-3 rounded-2xl bg-white/4 border border-white/8 p-4">
                {/* Type badge + Today Only */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${colorClass}`}>
                    {typeLabel[resolved.type ?? "attraction"]}
                  </span>
                  {resolved.todayOnly && (
                    <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse inline-block" />
                      TODAY ONLY
                    </span>
                  )}
                  {resolved.name !== stop.name && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-300">
                      {dietary.includes("Vegan") ? "🌱 Vegan" : "🥩 Halal"}
                    </span>
                  )}
                </div>

                <h3 className="text-[15px] font-bold text-white leading-tight">{resolved.name}</h3>
                <p className="text-[11px] text-white/40 font-semibold mt-0.5 mb-2">
                  📍 {resolved.area ?? stop.area}
                  {resolved.budget && resolved.budget !== "Free" && (
                    <span className="ml-2 text-white/25">· {resolved.budget}</span>
                  )}
                  {resolved.budget === "Free" && (
                    <span className="ml-2 text-emerald-400/70">· Free</span>
                  )}
                </p>

                <p className="text-[13px] text-white/65 leading-relaxed">{resolved.description}</p>

                {resolved.tip && (
                  <div className="mt-2 flex gap-2">
                    <span className="text-[11px] text-amber-400/80">💡</span>
                    <p className="text-[11px] text-white/40 leading-relaxed">{resolved.tip}</p>
                  </div>
                )}

                {resolved.naverQuery && (
                  <a
                    href={`https://map.naver.com/p/search/${encodeURIComponent(resolved.naverQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-green-400/80 hover:text-green-300"
                  >
                    🗺 Naver Map
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="px-5 mt-4">
        {!isAtLimit && (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleGenerate}
              className="w-full py-4 rounded-2xl text-[15px] font-black text-white/90 tracking-wide border border-white/15 bg-white/6 active:scale-95 transition-transform"
            >
              Regenerate Plan
            </button>
            <p className="text-center text-[11px] text-white/20">
              {MAX_GENERATES - generateCount} regeneration{MAX_GENERATES - generateCount !== 1 ? "s" : ""} left
            </p>
          </div>
        )}

        {/* Community CTAs */}
        <div className="rounded-2xl border border-white/8 bg-white/3 p-4 mt-1">
          <p className="text-[12px] font-black uppercase tracking-widest text-white/30 mb-3">Join the Community</p>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/review")}
              className="flex-1 py-3.5 rounded-xl text-[13px] font-black text-white border border-white/15 bg-white/6 active:scale-95 transition-transform"
            >
              📝 Write a Review
            </button>
            <button
              onClick={() => router.push("/community?tab=qa")}
              className="flex-1 py-3.5 rounded-xl text-[13px] font-black text-white bg-rose-500 active:scale-95 transition-transform"
            >
              💬 Ask a Local
            </button>
          </div>
          <p className="text-[11px] text-white/25 text-center mt-3 leading-relaxed">
            Real travelers. Real Seoul stories. Questions answered by locals.
          </p>
        </div>

        {/* Donate */}
        <button
          onClick={() => router.push("/donate")}
          className="w-full mt-2 py-3.5 rounded-2xl text-[13px] font-black text-white/50 border border-white/8 bg-white/3 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          ☕ This helped me — buy Toobie & Woogie a bubble tea 🧋
        </button>
      </div>
    </main>
  );
}
