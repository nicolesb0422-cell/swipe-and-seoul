"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  UserProfile,
  BudgetLevel,
  TransportPreference,
  TravelGroup,
  TravelPurpose,
  DietaryPreference,
} from "@/types";
import { storage } from "@/lib/storage";

// ── Step 1 data ────────────────────────────────────────────
const AREAS = [
  { id: "Hongdae", emoji: "🎵", desc: "Youth & nightlife" },
  { id: "Seongsu", emoji: "☕", desc: "Trendy & artsy" },
  { id: "Gangnam", emoji: "🛍️", desc: "Shopping & sleek" },
  { id: "Jongno", emoji: "🏯", desc: "History & culture" },
  { id: "Myeongdong", emoji: "🌆", desc: "City center" },
  { id: "Yeouido", emoji: "🏢", desc: "Han River & malls" },
  { id: "Itaewon", emoji: "🌍", desc: "International vibes" },
  { id: "Jamsil", emoji: "🎡", desc: "Theme park & towers" },
];

// ── Step 2 data ────────────────────────────────────────────
const TRANSPORT_OPTIONS: { value: TransportPreference; label: string; emoji: string; desc: string }[] = [
  { value: "Public Transport Only", label: "Public Transport", emoji: "🚇", desc: "Subway & bus only" },
  { value: "Taxi is Okay", label: "Taxi is OK", emoji: "🚕", desc: "Flexible with taxis" },
];
const BUDGET_OPTIONS: { value: BudgetLevel; label: string; emoji: string; desc: string }[] = [
  { value: "Budget", label: "Budget", emoji: "💸", desc: "Under ₩50k/day" },
  { value: "Moderate", label: "Moderate", emoji: "💳", desc: "₩50–150k/day" },
  { value: "Luxury", label: "Luxury", emoji: "💎", desc: "₩150k+/day" },
];
const GROUP_OPTIONS: { value: TravelGroup; label: string; emoji: string }[] = [
  { value: "Solo", label: "Solo", emoji: "🧍" },
  { value: "Couple", label: "Couple", emoji: "👫" },
  { value: "Friends", label: "Friends", emoji: "👯" },
  { value: "Family", label: "Family", emoji: "👨‍👩‍👧" },
];

// ── Step 3 data ────────────────────────────────────────────
const PURPOSE_OPTIONS: { value: TravelPurpose; emoji: string; label: string; desc: string }[] = [
  { value: "Rest", emoji: "😴", label: "Rest & Recharge", desc: "Take it slow, no rush" },
  { value: "Shopping", emoji: "🛍️", label: "Shopping", desc: "K-fashion, beauty, hauls" },
  { value: "Culture", emoji: "🏯", label: "Culture & History", desc: "Palaces, museums, hanok" },
  { value: "Cafe", emoji: "☕", label: "Café Hopping", desc: "Aesthetic cafés & roasters" },
  { value: "Food", emoji: "🍽️", label: "Food Adventures", desc: "Eating is the itinerary" },
  { value: "Instagram", emoji: "📸", label: "Instagrammable", desc: "Visual, photogenic spots" },
  { value: "Nightlife", emoji: "🎵", label: "Nightlife & Fun", desc: "Bars, clubs, late nights" },
  { value: "SlowLocal", emoji: "🌿", label: "Slow & Local", desc: "Off the tourist path" },
];

// ── Step 4 data ────────────────────────────────────────────
const DIETARY_OPTIONS: { value: DietaryPreference; emoji: string; label: string }[] = [
  { value: "No Restriction", emoji: "✅", label: "No restrictions" },
  { value: "Vegan", emoji: "🌱", label: "Vegan / plant-based" },
  { value: "Halal", emoji: "☪️", label: "Halal only" },
  { value: "No Spicy", emoji: "🧊", label: "No spicy food" },
];

function today() {
  return new Date().toISOString().split("T")[0];
}
function addDays(date: string, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

const STEP_LABELS = [
  "When & Where",
  "Trip Setup",
  "Travel Vibe",
  "Food & Style",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [arrivalDate, setArrivalDate] = useState(addDays(today(), 7));
  const [departureDate, setDepartureDate] = useState(addDays(today(), 13));
  const [baseArea, setBaseArea] = useState("");

  // Step 2
  const [transport, setTransport] = useState<TransportPreference | "">("");
  const [budget, setBudget] = useState<BudgetLevel | "">("");
  const [group, setGroup] = useState<TravelGroup | "">("");

  // Step 3
  const [purposes, setPurposes] = useState<TravelPurpose[]>([]);

  // Step 4
  const [dietary, setDietary] = useState<DietaryPreference[]>([]);

  const step1Valid = arrivalDate && departureDate && baseArea && departureDate > arrivalDate;
  const step2Valid = transport && budget && group;
  const step3Valid = purposes.length >= 1;
  const step4Valid = dietary.length > 0;

  function togglePurpose(v: TravelPurpose) {
    setPurposes((prev) =>
      prev.includes(v) ? prev.filter((p) => p !== v) : prev.length < 4 ? [...prev, v] : prev
    );
  }

  function toggleDietary(v: DietaryPreference) {
    if (v === "No Restriction") {
      setDietary(["No Restriction"]);
      return;
    }
    setDietary((prev) => {
      const without = prev.filter((d) => d !== "No Restriction");
      return without.includes(v) ? without.filter((d) => d !== v) : [...without, v];
    });
  }

  function handleNext() {
    if (step < 4) setStep((s) => s + 1);
  }

  function handleBack() {
    if (step > 1) setStep((s) => s - 1);
    else router.push("/");
  }

  function handleSubmit() {
    if (!step4Valid) return;
    const profile: UserProfile = {
      nationality: "",
      language: "English",
      arrivalDate,
      departureDate,
      baseArea,
      transportPreference: transport as TransportPreference,
      budgetLevel: budget as BudgetLevel,
      travelGroup: group as TravelGroup,
      travelPurposes: purposes,
      foodType: "Korean Focus",
      dietaryPreferences: dietary as DietaryPreference[],
      discoveryStyle: "Mix",
      generateCount: 0,
    };
    storage.setUserProfile(profile);
    router.push("/swipe");
  }

  const isCurrentStepValid =
    step === 1 ? step1Valid :
    step === 2 ? step2Valid :
    step === 3 ? step3Valid :
    step4Valid;

  return (
    <main className="flex flex-col min-h-dvh bg-white max-w-lg mx-auto w-full">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: "linear-gradient(160deg, #0d0d0d 0%, #1a0533 100%)" }}
      >
        {/* Nav row */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 text-lg"
          >
            ←
          </button>
          {/* Step pills */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-7 bg-rose-400" : s < step ? "w-4 bg-purple-400" : "w-4 bg-white/15"
                }`}
              />
            ))}
          </div>
          <div className="text-[11px] font-bold text-white/30 uppercase tracking-wider">
            {step}/4
          </div>
        </div>

        <p className="text-[11px] font-bold tracking-widest uppercase text-white/35 mb-1">
          {STEP_LABELS[step - 1]}
        </p>
        <h1 className="text-[22px] font-black text-white leading-snug">
          {step === 1 && "When are you\nvisiting Seoul?"}
          {step === 2 && "How do you like\nto travel?"}
          {step === 3 && "What's this\ntrip about?"}
          {step === 4 && "Food & discovery\npreferences"}
        </h1>
        <p className="text-[13px] text-white/35 mt-1">
          {step === 1 && "Your trip dates and base area."}
          {step === 2 && "This shapes how far and how much."}
          {step === 3 && "Pick up to 4. Your plan revolves around these."}
          {step === 4 && "We'll filter every recommendation around this."}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-6 overflow-y-auto">

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="flex flex-col gap-7">
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-1.5">Arrival</label>
                  <input
                    type="date"
                    value={arrivalDate}
                    min={today()}
                    onChange={(e) => {
                      setArrivalDate(e.target.value);
                      if (e.target.value >= departureDate) setDepartureDate(addDays(e.target.value, 3));
                    }}
                    className="w-full rounded-xl border-2 border-neutral-100 bg-neutral-50 px-3 py-3 text-[14px] font-semibold text-neutral-900 focus:border-purple-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-1.5">Departure</label>
                  <input
                    type="date"
                    value={departureDate}
                    min={addDays(arrivalDate, 1)}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full rounded-xl border-2 border-neutral-100 bg-neutral-50 px-3 py-3 text-[14px] font-semibold text-neutral-900 focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>
              {arrivalDate && departureDate && departureDate > arrivalDate && (
                <p className="text-[12px] text-purple-600 font-semibold text-center mt-2">
                  {Math.round((new Date(departureDate).getTime() - new Date(arrivalDate).getTime()) / 86400000)} nights in Seoul ✦
                </p>
              )}
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-3">Which area will you be based in?</label>
              <div className="grid grid-cols-2 gap-2.5">
                {AREAS.map((area) => {
                  const sel = baseArea === area.id;
                  return (
                    <button
                      key={area.id}
                      onClick={() => setBaseArea(area.id)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl border-2 text-left transition-all ${sel ? "border-purple-500 bg-purple-50" : "border-neutral-100 bg-neutral-50"}`}
                    >
                      <span className="text-xl">{area.emoji}</span>
                      <div>
                        <p className={`text-[13px] font-bold leading-tight ${sel ? "text-purple-900" : "text-neutral-800"}`}>{area.id}</p>
                        <p className={`text-[11px] ${sel ? "text-purple-500" : "text-neutral-400"}`}>{area.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="flex flex-col gap-7">
            <div>
              <label className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-3">Getting around</label>
              <div className="flex flex-col gap-2.5">
                {TRANSPORT_OPTIONS.map((opt) => {
                  const sel = transport === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setTransport(opt.value)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${sel ? "border-rose-400 bg-rose-50" : "border-neutral-100 bg-neutral-50"}`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <div className="flex-1">
                        <p className={`text-[14px] font-bold ${sel ? "text-rose-900" : "text-neutral-800"}`}>{opt.label}</p>
                        <p className={`text-[12px] ${sel ? "text-rose-500" : "text-neutral-400"}`}>{opt.desc}</p>
                      </div>
                      {sel && <div className="w-5 h-5 rounded-full bg-rose-400 flex items-center justify-center text-white text-[11px] font-black">✓</div>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-3">Daily budget</label>
              <div className="grid grid-cols-3 gap-2.5">
                {BUDGET_OPTIONS.map((opt) => {
                  const sel = budget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setBudget(opt.value)}
                      className={`flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 transition-all ${sel ? "border-amber-400 bg-amber-50" : "border-neutral-100 bg-neutral-50"}`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <p className={`text-[12px] font-bold ${sel ? "text-amber-800" : "text-neutral-700"}`}>{opt.label}</p>
                      <p className={`text-[10px] text-center px-1 ${sel ? "text-amber-500" : "text-neutral-400"}`}>{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-3">Traveling with</label>
              <div className="grid grid-cols-4 gap-2">
                {GROUP_OPTIONS.map((opt) => {
                  const sel = group === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setGroup(opt.value)}
                      className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 transition-all ${sel ? "border-sky-400 bg-sky-50" : "border-neutral-100 bg-neutral-50"}`}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <p className={`text-[11px] font-bold ${sel ? "text-sky-800" : "text-neutral-600"}`}>{opt.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-widest uppercase text-neutral-400">Pick up to 4</p>
              <p className={`text-[12px] font-bold ${purposes.length > 0 ? "text-purple-600" : "text-neutral-300"}`}>
                {purposes.length}/4 selected
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {PURPOSE_OPTIONS.map((opt) => {
                const sel = purposes.includes(opt.value);
                const maxed = purposes.length >= 4 && !sel;
                return (
                  <button
                    key={opt.value}
                    onClick={() => togglePurpose(opt.value)}
                    disabled={maxed}
                    className={`flex items-start gap-3 px-4 py-3.5 rounded-2xl border-2 text-left transition-all ${
                      sel
                        ? "border-purple-500 bg-purple-50"
                        : maxed
                        ? "border-neutral-100 bg-neutral-50 opacity-40"
                        : "border-neutral-100 bg-neutral-50"
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{opt.emoji}</span>
                    <div>
                      <p className={`text-[13px] font-bold leading-tight ${sel ? "text-purple-900" : "text-neutral-800"}`}>{opt.label}</p>
                      <p className={`text-[11px] mt-0.5 leading-snug ${sel ? "text-purple-500" : "text-neutral-400"}`}>{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            {purposes.length >= 4 && (
              <p className="text-center text-[11px] text-amber-500 font-semibold">Maximum 4 — deselect one to change</p>
            )}
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div className="flex flex-col gap-7">
            {/* Dietary */}
            <div>
              <label className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 block mb-3">Dietary notes</label>
              <div className="grid grid-cols-2 gap-2.5">
                {DIETARY_OPTIONS.map((opt) => {
                  const sel = dietary.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleDietary(opt.value)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl border-2 text-left transition-all ${sel ? "border-amber-400 bg-amber-50" : "border-neutral-100 bg-neutral-50"}`}
                    >
                      <span className="text-xl">{opt.emoji}</span>
                      <p className={`text-[13px] font-semibold ${sel ? "text-amber-800" : "text-neutral-700"}`}>{opt.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 px-5 py-4 bg-white/90 backdrop-blur-md border-t border-neutral-100">
        <button
          onClick={step < 4 ? handleNext : handleSubmit}
          disabled={!isCurrentStepValid}
          className="flex items-center justify-center gap-2 w-full font-black text-[15px] py-4 rounded-2xl text-white transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          style={isCurrentStepValid ? { background: "linear-gradient(90deg, #f43f5e, #a855f7)" } : { background: "#d1d5db" }}
        >
          {step < 4 ? "Next →" : "Find my Seoul style →"}
        </button>
        <p className="text-center text-[11px] text-neutral-400 mt-2">
          {step === 1 && (baseArea ? `Base: ${baseArea} ✓` : "Pick your base area to continue")}
          {step === 2 && `${[transport, budget, group].filter(Boolean).length}/3 selected`}
          {step === 3 && (purposes.length > 0 ? `${purposes.length} vibe${purposes.length > 1 ? "s" : ""} selected` : "Pick at least 1 to continue")}
          {step === 4 && (dietary.length > 0 ? `${dietary.length} dietary option${dietary.length > 1 ? "s" : ""} selected` : "Pick at least 1 to continue")}
        </p>
      </div>
    </main>
  );
}
