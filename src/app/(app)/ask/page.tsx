"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { storage } from "@/lib/storage";

const ALL_TAGS = ["Transport", "Food", "Shopping", "Nightlife", "Culture", "K-beauty", "Accommodation", "Budget"];

export default function AskPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const profile = storage.getSignupProfile();
    if (profile?.firstName) {
      const parts = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
      setNickname(parts + " from ");
    }
  }, []);

  function toggleTag(t: string) {
    setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  }

  async function handleSubmit() {
    if (!nickname.trim() || !title.trim() || body.trim().length < 10) return;
    setSubmitting(true);
    const { error } = await supabase.from("questions").insert({
      nickname: nickname.trim(),
      title: title.trim(),
      body: body.trim(),
      tags,
    });
    setSubmitting(false);
    if (!error) setDone(true);
  }

  if (done) {
    return (
      <main className="flex flex-col min-h-dvh bg-neutral-950 items-center justify-center px-6 text-center gap-6 max-w-lg mx-auto w-full">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl" style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}>
          🇰🇷
        </div>
        <h1 className="text-[26px] font-black text-white">Question posted!</h1>
        <p className="text-[14px] text-white/50 leading-relaxed">Korean locals and experienced travelers will answer soon.</p>
        <button
          onClick={() => router.push("/community?tab=qa")}
          className="w-full py-4 rounded-2xl text-[15px] font-black text-white"
          style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}
        >
          See all questions →
        </button>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-dvh bg-neutral-950 pb-10 max-w-lg mx-auto w-full">
      <div className="px-5 pt-12 pb-4">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 text-lg mb-5">←</button>
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">🇰🇷 Ask a Local</p>
        <h1 className="text-[24px] font-black text-white">What do you want to know?</h1>
        <p className="text-[13px] text-white/40 mt-1">Korean locals & travel veterans will answer</p>
      </div>

      <div className="px-5 flex flex-col gap-5">
        {/* Nickname */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">Your name / nickname</label>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="e.g. James from London"
            maxLength={30}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/25"
          />
        </div>

        {/* Title */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">Question title</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Best late-night eats near Hongdae?"
            maxLength={80}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/25"
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">More details</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Any context that helps? (budget, time of day, group size…)"
            rows={4}
            maxLength={400}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/25 resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-3">Topic tags</label>
          <div className="flex flex-wrap gap-2">
            {ALL_TAGS.map(t => (
              <button
                key={t}
                onClick={() => toggleTag(t)}
                className="text-[12px] font-black px-3 py-1.5 rounded-full border transition-colors"
                style={{
                  borderColor: tags.includes(t) ? "rgba(244,63,94,0.5)" : "rgba(255,255,255,0.1)",
                  background: tags.includes(t) ? "rgba(244,63,94,0.12)" : "transparent",
                  color: tags.includes(t) ? "#fb7185" : "rgba(255,255,255,0.45)",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || !nickname.trim() || !title.trim() || body.trim().length < 10}
          className="w-full py-4 rounded-2xl text-[15px] font-black text-white active:scale-95 transition-transform mt-2 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}
        >
          {submitting ? "Posting…" : "Ask the Community →"}
        </button>
      </div>
    </main>
  );
}
