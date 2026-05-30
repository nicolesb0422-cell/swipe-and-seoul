"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import tripPlans from "@/data/tripPlans.json";

type PlanStop = { name?: string; transit?: string };

const PERSONA_EMOJI: Record<string, string> = {
  "Indoor Trend Seeker": "✦",
  "Culture Explorer": "◈",
  "Slow Healing Traveler": "◌",
  "Active Hotspot Hunter": "◉",
};

export default function ReviewPage() {
  const router = useRouter();
  const [persona, setPersona] = useState("");
  const [planId, setPlanId] = useState("");
  const [stops, setStops] = useState<string[]>([]);
  const [nickname, setNickname] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [visited, setVisited] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const profile = storage.getSignupProfile();
    if (profile?.firstName) {
      const parts = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
      setNickname(parts + " from ");
    }

    const score = storage.getPreferenceScore();
    if (!score) { router.replace("/swipe"); return; }
    const { calculatePersona } = require("@/lib/preference");
    const result = calculatePersona(score);
    setPersona(result.persona);

    const personaToId: Record<string, string> = {
      "Indoor Trend Seeker": "plan-indoor-trend",
      "Culture Explorer": "plan-culture-explorer",
      "Slow Healing Traveler": "plan-slow-healing",
      "Active Hotspot Hunter": "plan-active-hunter",
    };
    const id = personaToId[result.persona] ?? "plan-indoor-trend";
    setPlanId(id);
    const plan = (tripPlans as { id: string; stops: PlanStop[] }[]).find(p => p.id === id);
    if (plan) {
      setStops(plan.stops.filter(s => s.name && !s.transit).map(s => s.name!));
    }
  }, []);

  function toggleVisited(name: string) {
    setVisited(v => v.includes(name) ? v.filter(x => x !== name) : [...v, name]);
  }

  async function handleSubmit() {
    if (!nickname.trim() || rating === 0 || body.trim().length < 10) return;
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      nickname: nickname.trim(),
      persona,
      plan_id: planId,
      rating,
      body: body.trim(),
      spots_visited: visited,
    });
    setSubmitting(false);
    if (!error) setDone(true);
  }

  if (done) {
    return (
    <main className="flex flex-col min-h-dvh bg-neutral-950 items-center justify-center px-6 text-center gap-6 max-w-lg mx-auto w-full">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}>
          🎉
        </div>
        <h1 className="text-[26px] font-black text-white">Review posted!</h1>
        <p className="text-[14px] text-white/50 leading-relaxed">Your trip story helps other travelers explore Seoul with confidence.</p>
        <button
          onClick={() => router.push("/community")}
          className="w-full py-4 rounded-2xl text-[15px] font-black text-white"
          style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}
        >
          See the community →
        </button>
        <button onClick={() => router.push("/plan")} className="text-[13px] text-white/30 font-semibold">
          Back to my plan
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-dvh bg-neutral-950 pb-10 max-w-lg mx-auto w-full">
      <div className="px-5 pt-12 pb-4">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 text-lg mb-5">←</button>
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">
          {PERSONA_EMOJI[persona]} {persona}
        </p>
        <h1 className="text-[24px] font-black text-white">How was your trip?</h1>
        <p className="text-[13px] text-white/40 mt-1">Share your experience with the next traveler</p>
      </div>

      <div className="px-5 flex flex-col gap-5">
        {/* Nickname */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">Your name / nickname</label>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="e.g. Sarah from NYC"
            maxLength={30}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/25"
          />
        </div>

        {/* Star rating — half-star (0.5) precision */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-3">Overall rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => {
              const fill = rating >= n ? "full" : rating >= n - 0.5 ? "half" : "empty";
              return (
                <div key={n} className="relative" style={{ width: 40, height: 40 }}>
                  {/* empty star */}
                  <div className="absolute inset-0 flex items-center justify-center text-[30px] pointer-events-none"
                    style={{ color: "rgba(255,255,255,0.15)" }}>★</div>
                  {/* filled overlay — clips to 100%, 50%, or 0% */}
                  <div className="absolute overflow-hidden pointer-events-none"
                    style={{ left: 0, top: 0, bottom: 0, width: fill === "full" ? "100%" : fill === "half" ? "50%" : "0%" }}>
                    <div className="flex items-center justify-center text-[30px]"
                      style={{ color: "#fbbf24", width: 40, height: 40 }}>★</div>
                  </div>
                  {/* left half → n - 0.5 */}
                  <button onClick={() => setRating(n - 0.5)}
                    className="absolute left-0 top-0 w-1/2 h-full" aria-label={`${n - 0.5} stars`} />
                  {/* right half → n */}
                  <button onClick={() => setRating(n)}
                    className="absolute right-0 top-0 w-1/2 h-full" aria-label={`${n} stars`} />
                </div>
              );
            })}
            {rating > 0 && (
              <span className="ml-2 text-[15px] font-black text-amber-400">
                {Number.isInteger(rating) ? `${rating}.0` : rating} ★
              </span>
            )}
          </div>
        </div>

        {/* Review body */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">Your review</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="What was the highlight? Any tips? What surprised you?"
            rows={5}
            maxLength={600}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/25 resize-none"
          />
          <p className="text-right text-[11px] text-white/20 mt-1">{body.length}/600</p>
        </div>

        {/* Spots visited */}
        {stops.length > 0 && (
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-3">Which stops did you visit?</label>
            <div className="flex flex-col gap-2">
              {stops.map(s => (
                <button
                  key={s}
                  onClick={() => toggleVisited(s)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors"
                  style={{
                    borderColor: visited.includes(s) ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)",
                    background: visited.includes(s) ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.03)",
                  }}
                >
                  <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-black"
                    style={{ borderColor: visited.includes(s) ? "#a855f7" : "rgba(255,255,255,0.2)", color: "#a855f7" }}>
                    {visited.includes(s) ? "✓" : ""}
                  </span>
                  <span className="text-[13px] font-semibold text-white/80">{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !nickname.trim() || rating === 0 || body.trim().length < 10}
          className="w-full py-4 rounded-2xl text-[15px] font-black text-white active:scale-95 transition-transform mt-2 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}
        >
          {submitting ? "Posting…" : "Post My Review ✦"}
        </button>
      </div>
    </main>
  );
}
