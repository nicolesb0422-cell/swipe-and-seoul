"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { calculatePersona, getPersonaEmoji } from "@/lib/preference";
import { PreferenceResult } from "@/types";
import { pickStars, Star } from "@/data/starPool";

type PersonaTheme = {
  gradient: string;
  glow: string;
  accent: string;
  tagBg: string;
};

const THEMES: Record<string, PersonaTheme> = {
  "Indoor Trend Seeker":    { gradient: "135deg, #f43f5e, #a855f7", glow: "244,63,94",   accent: "#f43f5e", tagBg: "rgba(244,63,94,0.15)" },
  "Culture Explorer":       { gradient: "135deg, #f59e0b, #f43f5e", glow: "245,158,11",  accent: "#f59e0b", tagBg: "rgba(245,158,11,0.15)" },
  "Slow Healing Traveler":  { gradient: "135deg, #2dd4bf, #6366f1", glow: "45,212,191",  accent: "#2dd4bf", tagBg: "rgba(45,212,191,0.15)" },
  "Active Hotspot Hunter":  { gradient: "135deg, #a855f7, #ec4899", glow: "168,85,247",  accent: "#a855f7", tagBg: "rgba(168,85,247,0.15)" },
};

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<PreferenceResult | null>(null);
  const [phase, setPhase] = useState(0); // 0=hidden 1=hero 2=cards 3=full
  const [stars, setStars] = useState<Star[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const score = storage.getPreferenceScore();
    if (!score) { router.replace("/swipe"); return; }
    const r = calculatePersona(score);
    setResult(r);
    setStars(pickStars(r.persona));
    setTimeout(() => setPhase(1), 80);
    setTimeout(() => setPhase(2), 480);
    setTimeout(() => setPhase(3), 820);
  }, []);

  async function handleShare() {
    if (!shareCardRef.current || isSharing || !result) return;
    setIsSharing(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(shareCardRef.current, { quality: 1, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "my-seoul-persona.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `I'm a ${result.persona}!`,
          text: `${result.vibe} 🇰🇷 Find your Seoul travel type!`,
          files: [file],
        });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl; a.download = "my-seoul-persona.png"; a.click();
      }
    } catch { /* cancelled */ } finally { setIsSharing(false); }
  }

  if (!result) return null;
  const emoji = getPersonaEmoji(result.persona);
  const theme = THEMES[result.persona] ?? THEMES["Indoor Trend Seeker"];

  return (
    <main className="flex flex-col min-h-dvh bg-neutral-950 overflow-x-hidden">
      <style>{`
        @keyframes pop { 0%{transform:scale(0.4);opacity:0} 60%{transform:scale(1.12)} 80%{transform:scale(0.96)} 100%{transform:scale(1);opacity:1} }
        @keyframes slideUp { from{transform:translateY(28px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .pop { animation: pop 0.55s cubic-bezier(.34,1.56,.64,1) both; }
        .slide-up { animation: slideUp 0.5s ease both; }
        .fade-in { animation: fadeIn 0.5s ease both; }
      `}</style>

      {/* ── HERO ────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center text-center px-6 pt-14 pb-10"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 0%, rgba(${theme.glow},0.28) 0%, transparent 75%), #080010`,
        }}
      >
        {/* Branding */}
        <p
          className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 fade-in"
          style={{ color: "rgba(255,255,255,0.3)", animationDelay: "0.05s", animationPlayState: phase >= 1 ? "running" : "paused" }}
        >
          ✦ &nbsp;SWIPE &amp; SEOUL&nbsp; ✦
        </p>

        {/* Big emoji */}
        <div
          className="relative mb-5"
          style={{ animationPlayState: phase >= 1 ? "running" : "paused" }}
        >
          {/* glow ring */}
          <div
            className="absolute inset-0 rounded-[28px] blur-xl"
            style={{ background: `linear-gradient(${theme.gradient})`, transform: "scale(1.3)", opacity: 0.6 }}
          />
          <div
            className="relative pop w-24 h-24 rounded-[28px] flex items-center justify-center text-5xl shadow-2xl"
            style={{ background: `linear-gradient(${theme.gradient})`, animationDelay: "0.1s", animationPlayState: phase >= 1 ? "running" : "paused" }}
          >
            {emoji}
          </div>
        </div>

        {/* Persona name */}
        <p
          className="text-[11px] font-black uppercase tracking-[0.25em] mb-2 fade-in"
          style={{ color: "rgba(255,255,255,0.4)", animationDelay: "0.2s", animationPlayState: phase >= 1 ? "running" : "paused" }}
        >
          Your Travel Persona
        </p>
        <h1
          className="slide-up font-black leading-none tracking-tight text-white"
          style={{ fontSize: "clamp(34px,9vw,44px)", animationDelay: "0.25s", animationPlayState: phase >= 1 ? "running" : "paused" }}
        >
          {result.persona}
        </h1>
        <p
          className="mt-3 text-[14px] font-semibold italic fade-in"
          style={{ color: theme.accent, animationDelay: "0.35s", animationPlayState: phase >= 1 ? "running" : "paused", opacity: phase >= 1 ? undefined : 0 }}
        >
          {result.vibe}
        </p>

        {/* Tags */}
        <div
          className="flex flex-wrap gap-2 justify-center mt-5 fade-in"
          style={{ animationDelay: "0.45s", animationPlayState: phase >= 1 ? "running" : "paused", opacity: phase >= 1 ? undefined : 0 }}
        >
          {result.topTags.map((tag) => (
            <span
              key={tag}
              className="text-[12px] font-black px-3.5 py-1.5 rounded-full"
              style={{ background: theme.tagBg, color: theme.accent, border: `1px solid ${theme.accent}40` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── CELEBRITY MATCH ─────────────────────── */}
      <div
        className="mx-4 mt-4 rounded-3xl overflow-hidden slide-up"
        style={{
          animationDelay: "0.1s",
          animationPlayState: phase >= 2 ? "running" : "paused",
          opacity: phase >= 2 ? undefined : 0,
          border: `1px solid rgba(${theme.glow},0.2)`,
          background: `linear-gradient(160deg, rgba(${theme.glow},0.1) 0%, rgba(0,0,0,0) 60%), rgba(255,255,255,0.03)`,
        }}
      >
        <div className="px-5 pt-5 pb-1">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, rgba(${theme.glow},0.4))` }} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap" style={{ color: theme.accent }}>
              Your Celeb Energy Match
            </p>
            <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, rgba(${theme.glow},0.4))` }} />
          </div>
        </div>

        <div className="flex gap-3 px-4 py-4">
          {stars.map((star, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center gap-3 py-5 px-3 rounded-2xl"
              style={{ background: `rgba(${theme.glow},0.06)`, border: `1px solid rgba(${theme.glow},0.15)` }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white"
                style={{
                  background: `linear-gradient(135deg, rgba(${theme.glow},0.6), rgba(${theme.glow},0.2))`,
                  boxShadow: `0 4px 20px rgba(${theme.glow},0.3)`,
                  border: `1.5px solid rgba(${theme.glow},0.5)`,
                }}
              >
                {star.name[0]}
              </div>
              <div className="text-center">
                <p className="text-[14px] font-black text-white leading-tight">{star.name}</p>
                <p className="text-[11px] font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{star.group}</p>
              </div>
              <div
                className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide"
                style={{ background: `rgba(${theme.glow},0.15)`, color: theme.accent }}
              >
                {star.matchDesc}
              </div>
            </div>
          ))}
        </div>
        {stars.length > 0 && (
          <p className="text-center text-[11px] italic pb-4" style={{ color: "rgba(255,255,255,0.25)" }}>
            MBTI {stars.map(s => s.mbti).join(" · ")} — you&apos;re in rare company ✦
          </p>
        )}
      </div>

      {/* ── DESCRIPTION ─────────────────────────── */}
      <div
        className="mx-4 mt-3 rounded-2xl p-5 border border-white/6 slide-up"
        style={{ background: "rgba(255,255,255,0.03)", animationDelay: "0.2s", animationPlayState: phase >= 2 ? "running" : "paused", opacity: phase >= 2 ? undefined : 0 }}
      >
        <p className="text-[14px] text-white/65 leading-relaxed">{result.description}</p>
      </div>

      {/* ── SHARE + CTA ─────────────────────────── */}
      <div
        className="mx-4 mt-5 mb-8 flex flex-col gap-3 slide-up"
        style={{ animationDelay: "0.1s", animationPlayState: phase >= 3 ? "running" : "paused", opacity: phase >= 3 ? undefined : 0 }}
      >
        {/* Share — hero button */}
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="w-full py-4 rounded-2xl text-[15px] font-black text-white tracking-wide active:scale-95 transition-transform flex items-center justify-center gap-2.5 disabled:opacity-60"
          style={{ background: `linear-gradient(${theme.gradient})`, boxShadow: `0 6px 30px rgba(${theme.glow},0.35)` }}
        >
          <span className="text-[18px]">📸</span>
          {isSharing ? "Generating…" : "Share My Persona"}
        </button>
        <p className="text-center text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.2)" }}>
          Instagram · TikTok · 카카오톡
        </p>

        {/* Generate plan */}
        <button
          onClick={() => router.push("/plan")}
          className="w-full py-4 rounded-2xl text-[15px] font-black text-white/85 tracking-wide border border-white/12 bg-white/5 active:scale-95 transition-transform mt-1"
        >
          Generate My Day Plan →
        </button>
        <button
          onClick={() => router.push("/swipe")}
          className="w-full py-2.5 text-[12px] font-semibold text-white/30"
        >
          Retake the test
        </button>
      </div>

      {/* ── HIDDEN SHARE CARD ───────────────────── */}
      <div
        ref={shareCardRef}
        style={{
          position: "fixed", left: "-9999px", top: 0,
          width: "390px", height: "693px", overflow: "hidden",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background: `radial-gradient(ellipse 100% 60% at 50% 0%, rgba(${theme.glow},0.35) 0%, transparent 65%), #060010`,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "36px 28px 28px", boxSizing: "border-box",
        }}
      >
        {/* Bottom glow */}
        <div style={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, borderRadius: "50%", background: `radial-gradient(circle, rgba(${theme.glow},0.2) 0%, transparent 70%)`, pointerEvents: "none" }} />

        <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 26 }}>
          ✦ SWIPE &amp; SEOUL ✦
        </p>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
          YOUR TRAVEL PERSONA
        </p>

        <div style={{ position: "relative", marginBottom: 18 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 24, filter: "blur(16px)", background: `linear-gradient(${theme.gradient})`, transform: "scale(1.4)", opacity: 0.7 }} />
          <div style={{ position: "relative", width: 88, height: 88, borderRadius: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, background: `linear-gradient(${theme.gradient})`, boxShadow: `0 10px 40px rgba(${theme.glow},0.5)` }}>
            {emoji}
          </div>
        </div>

        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -0.5, textAlign: "center", lineHeight: 1.05, marginBottom: 8 }}>
          {result.persona}
        </h1>
        <p style={{ fontSize: 14, fontWeight: 600, fontStyle: "italic", color: theme.accent, marginBottom: 22, textAlign: "center" }}>
          {result.vibe}
        </p>

        <div style={{ width: "100%", height: 1, background: `rgba(${theme.glow},0.25)`, marginBottom: 20 }} />

        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: `rgba(${theme.glow.split(",").join(",")},0.7)`, marginBottom: 16 }}>
          CELEB ENERGY MATCH
        </p>

        {stars.length > 0 && (
          <div style={{ display: "flex", gap: 20, marginBottom: 22 }}>
            {stars.map((star, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 76, height: 76, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 900, color: "white", background: `linear-gradient(135deg, rgba(${theme.glow},0.6), rgba(${theme.glow},0.15))`, border: `2px solid rgba(${theme.glow},0.55)`, boxShadow: `0 4px 20px rgba(${theme.glow},0.3)` }}>
                  {star.name[0]}
                </div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "white", margin: 0, textAlign: "center" }}>{star.name}</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: theme.accent, margin: 0 }}>{star.matchDesc}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: "auto" }}>
          {result.topTags.map((tag) => (
            <span key={tag} style={{ fontSize: 12, fontWeight: 700, padding: "5px 14px", borderRadius: 100, background: theme.tagBg, color: theme.accent, border: `1px solid rgba(${theme.glow},0.3)` }}>
              {tag}
            </span>
          ))}
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "rgba(255,255,255,0.25)", marginTop: 18 }}>
          swipe-and-seoul.vercel.app
        </p>
      </div>
    </main>
  );
}
