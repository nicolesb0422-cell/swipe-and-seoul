"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import swipePlaces from "@/data/swipePlaces.json";
import { SwipePlace, PreferenceScore } from "@/types";
import { storage } from "@/lib/storage";

const ALL_PLACES = swipePlaces as SwipePlace[];
const COMMIT_THRESHOLD = 90; // px drag needed to commit

function getPlacesForArea(baseArea: string): SwipePlace[] {
  const inArea = ALL_PLACES.filter(p => p.area === baseArea);
  const others = ALL_PLACES.filter(p => p.area !== baseArea);
  return [...inArea, ...others].slice(0, 4);
}

function calcScore(results: Record<string, boolean>, places: SwipePlace[]): PreferenceScore {
  const score: PreferenceScore = {
    indoor: 0, outdoor: 0,
    energetic: 0, calm: 0,
    trendy: 0, classic: 0,
    shopping: 0, experience: 0,
  };
  for (const place of places) {
    if (!results[place.id]) continue;
    for (const tag of place.tags) {
      const t = tag.toLowerCase() as keyof PreferenceScore;
      if (t in score) score[t]++;
    }
  }
  return score;
}

export default function SwipePage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [places, setPlaces] = useState<SwipePlace[]>(() => getPlacesForArea(""));

  // Load base area from profile on mount
  useEffect(() => {
    const profile = storage.getUserProfile();
    setPlaces(getPlacesForArea(profile?.baseArea ?? ""));
  }, []);

  const TOTAL = places.length;

  // drag state
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  // exit animation
  const [exitDir, setExitDir] = useState<"like" | "dislike" | null>(null);

  const done = index >= TOTAL;
  const current = places[index];
  const next = places[index + 1];

  const rotation = dragX * 0.07;
  const likeOpacity = Math.min(1, Math.max(0, dragX / COMMIT_THRESHOLD));
  const nopeOpacity = Math.min(1, Math.max(0, -dragX / COMMIT_THRESHOLD));

  function commit(liked: boolean) {
    if (exitDir) return;
    const dir = liked ? "like" : "dislike";
    setExitDir(dir);
    setResults((prev) => ({ ...prev, [current.id]: liked }));
    setDragX(liked ? 400 : -400);
    setTimeout(() => {
      setIndex((i) => i + 1);
      setExitDir(null);
      setDragX(0);
    }, 320);
  }

  // pointer events
  function onPointerDown(e: React.PointerEvent) {
    if (exitDir) return;
    startXRef.current = e.clientX;
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging) return;
    setDragX(e.clientX - startXRef.current);
  }
  function onPointerUp() {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > COMMIT_THRESHOLD) commit(true);
    else if (dragX < -COMMIT_THRESHOLD) commit(false);
    else setDragX(0);
  }

  // save & navigate when done
  useEffect(() => {
    if (!done) return;
    storage.setSwipeResults(results);
    storage.setPreferenceScore(calcScore(results, places));
    router.push("/result");
  }, [done]);

  if (done) return null;

  return (
    <main className="flex flex-col h-dvh bg-neutral-950 overflow-hidden select-none max-w-lg mx-auto w-full">
      {/* ── Top bar ───────────────────────────── */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3 z-10">
        <button
          onClick={() => router.push("/onboarding")}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 text-lg"
        >
          ←
        </button>
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[12px] font-bold text-white/50">
            {index + 1} <span className="text-white/25">/ {TOTAL}</span>
          </p>
          {/* Progress dots */}
          <div className="flex gap-1">
            {places.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i < index
                    ? "w-3 bg-purple-400"
                    : i === index
                    ? "w-5 bg-rose-400"
                    : "w-3 bg-white/15"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="w-9" />
      </div>

      {/* ── Card stack ───────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4 pb-2 relative">
        {/* Next card (behind) */}
        {next && (
          <div
            className="absolute inset-x-4 top-0 bottom-0 rounded-3xl overflow-hidden"
            style={{ transform: "scale(0.93) translateY(16px)", zIndex: 0 }}
          >
          <Image
              src={next.imageUrl}
              alt={next.name}
              fill
              className="object-cover"
              sizes="480px"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 35%, transparent 65%)" }} />
          </div>
        )}

        {/* Current card */}
        <div
          ref={cardRef}
          className="absolute inset-x-4 top-0 bottom-0 rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing"
          style={{
            zIndex: 1,
            transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
            transition: isDragging ? "none" : "transform 0.32s cubic-bezier(0.25,0.8,0.25,1)",
            transformOrigin: "center 70%",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* Photo */}
          <Image
            src={current.imageUrl}
            alt={current.name}
            fill
            className="object-cover pointer-events-none"
            sizes="480px"
            priority
            draggable={false}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)" }}
          />

          {/* LIKE indicator */}
          <div
            className="absolute top-10 left-6 px-4 py-2 rounded-xl border-4 border-emerald-400 rotate-[-20deg]"
            style={{ opacity: likeOpacity }}
          >
            <span className="text-[22px] font-black text-emerald-400 tracking-wider">LIKE</span>
          </div>

          {/* NOPE indicator */}
          <div
            className="absolute top-10 right-6 px-4 py-2 rounded-xl border-4 border-rose-400 rotate-[20deg]"
            style={{ opacity: nopeOpacity }}
          >
            <span className="text-[22px] font-black text-rose-400 tracking-wider">NOPE</span>
          </div>

          {/* Place info overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {current.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20 text-white/90 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Name */}
            <h2 className="text-[26px] font-black text-white leading-tight tracking-tight">
              {current.name}
            </h2>

            {/* Location */}
            <p className="text-[13px] font-semibold text-white/60 mt-1 flex items-center gap-1">
              <span>📍</span> {current.area}
            </p>

            {/* Description */}
            <p className="text-[13px] text-white/70 mt-2 leading-relaxed line-clamp-2">
              {current.description}
            </p>
          </div>
        </div>
      </div>

      {/* ── Buttons ──────────────────────────── */}
      <div className="flex items-center justify-center gap-6 px-8 py-5">
        {/* Dislike */}
        <button
          onClick={() => commit(false)}
          disabled={!!exitDir}
          className="w-16 h-16 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-transform disabled:opacity-40"
        >
          ✕
        </button>

        {/* Center hint */}
        <div className="flex-1 text-center">
          <p className="text-[11px] text-white/25 font-semibold">swipe or tap</p>
        </div>

        {/* Like */}
        <button
          onClick={() => commit(true)}
          disabled={!!exitDir}
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg active:scale-90 transition-transform disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7)" }}
        >
          ♥
        </button>
      </div>
    </main>
  );
}
