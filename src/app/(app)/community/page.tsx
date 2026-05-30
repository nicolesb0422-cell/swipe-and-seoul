"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Review, Question, ReviewComment } from "@/types";
import { Suspense } from "react";

const PERSONAS = ["All", "Indoor Trend Seeker", "Culture Explorer", "Slow Healing Traveler", "Active Hotspot Hunter"];

const PERSONA_EMOJI: Record<string, string> = {
  "Indoor Trend Seeker": "✦",
  "Culture Explorer": "◈",
  "Slow Healing Traveler": "◌",
  "Active Hotspot Hunter": "◉",
};

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-400 text-[13px]">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

function CommentThread({ reviewId, onCountChange }: { reviewId: string; onCountChange: (id: string, n: number) => void }) {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("review_comments")
      .select("*")
      .eq("review_id", reviewId)
      .order("created_at", { ascending: true });
    const list = data ?? [];
    setComments(list);
    onCountChange(reviewId, list.length);
    setLoading(false);
  }, [reviewId, onCountChange]);

  useEffect(() => { load(); }, [load]);

  async function submit() {
    if (!nickname.trim() || !body.trim()) return;
    setSubmitting(true);
    await supabase.from("review_comments").insert({ review_id: reviewId, nickname: nickname.trim(), body: body.trim() });
    setBody("");
    await load();
    setSubmitting(false);
  }

  return (
    <div className="mt-3 pt-3 border-t border-white/6">
      {loading ? (
        <p className="text-[11px] text-white/20 py-2">Loading comments…</p>
      ) : (
        <>
          {comments.length > 0 && (
            <div className="flex flex-col gap-3 mb-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white/50 shrink-0 mt-0.5">
                    {c.nickname.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-white/60">{c.nickname} <span className="font-normal text-white/25">· {timeAgo(c.created_at)}</span></p>
                    <p className="text-[12px] text-white/55 leading-relaxed mt-0.5">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          <div className="flex flex-col gap-2">
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              placeholder="Your name (e.g. Emma from London)"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 outline-none focus:border-white/25"
            />
            <div className="flex gap-2">
              <input
                value={body}
                onChange={e => setBody(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                placeholder="Leave a comment…"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-white placeholder-white/20 outline-none focus:border-white/25"
              />
              <button
                onClick={submit}
                disabled={submitting || !nickname.trim() || !body.trim()}
                className="px-4 py-2 rounded-xl text-[12px] font-black text-white disabled:opacity-30 active:scale-95 transition-transform"
                style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}
              >
                {submitting ? "…" : "Post"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function CommunityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"reviews" | "qa">(
    searchParams.get("tab") === "qa" ? "qa" : "reviews"
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [personaFilter, setPersonaFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const loadReviews = useCallback(async () => {
    setLoading(true);
    let q = supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(50);
    if (personaFilter !== "All") q = q.eq("persona", personaFilter);
    const { data } = await q;
    setReviews(data ?? []);
    setLoading(false);
  }, [personaFilter]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("questions")
      .select("*, answers(count)")
      .order("created_at", { ascending: false })
      .limit(50);
    setQuestions((data ?? []).map((q: Question & { answers: { count: number }[] }) => ({
      ...q,
      answer_count: q.answers?.[0]?.count ?? 0,
    })));
    setLoading(false);
  }, []);

  useEffect(() => { if (tab === "reviews") loadReviews(); }, [tab, loadReviews]);
  useEffect(() => { if (tab === "qa") loadQuestions(); }, [tab, loadQuestions]);

  async function handleLike(r: Review) {
    if (likedIds.has(r.id)) return;
    setLikedIds(prev => new Set([...prev, r.id]));
    setReviews(prev => prev.map(x => x.id === r.id ? { ...x, likes_count: (x.likes_count || 0) + 1 } : x));
    await supabase.from("reviews").update({ likes_count: (r.likes_count || 0) + 1 }).eq("id", r.id);
  }

  function handleCommentCount(reviewId: string, count: number) {
    setCommentCounts(prev => ({ ...prev, [reviewId]: count }));
  }

  return (
    <main className="flex flex-col min-h-dvh bg-neutral-950 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 text-lg mb-5">←</button>
        <h1 className="text-[24px] font-black text-white">Community</h1>
        <p className="text-[13px] text-white/40 mt-0.5">Real travelers, real Seoul stories</p>
      </div>

      {/* Tabs */}
      <div className="flex mx-5 mb-4 rounded-xl bg-white/5 p-1">
        {(["reviews", "qa"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2.5 rounded-lg text-[13px] font-black transition-colors"
            style={{
              background: tab === t ? "rgba(255,255,255,0.1)" : "transparent",
              color: tab === t ? "white" : "rgba(255,255,255,0.4)",
            }}
          >
            {t === "reviews" ? "✦ Reviews" : "💬 Ask a Local"}
          </button>
        ))}
      </div>

      {/* ── REVIEWS TAB ── */}
      {tab === "reviews" && (
        <div className="flex-1 flex flex-col">
          {/* Persona filter pills */}
          <div className="flex gap-2 px-5 mb-4 overflow-x-auto no-scrollbar">
            {PERSONAS.map(p => (
              <button
                key={p}
                onClick={() => setPersonaFilter(p)}
                className="whitespace-nowrap text-[11px] font-black px-3 py-1.5 rounded-full border transition-colors shrink-0"
                style={{
                  borderColor: personaFilter === p ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)",
                  background: personaFilter === p ? "rgba(168,85,247,0.15)" : "transparent",
                  color: personaFilter === p ? "#c084fc" : "rgba(255,255,255,0.45)",
                }}
              >
                {p === "All" ? p : `${PERSONA_EMOJI[p]} ${p}`}
              </button>
            ))}
          </div>

          {/* Write review CTA */}
          <div className="mx-5 mb-4">
            <button
              onClick={() => router.push("/review")}
              className="w-full py-3 rounded-xl text-[13px] font-black text-white/70 border border-dashed border-white/15 bg-white/3 active:scale-95 transition-transform"
            >
              + Share your Seoul trip story
            </button>
          </div>

          {/* Reviews list */}
          <div className="px-5 flex flex-col gap-3 pb-10">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-white/20 text-[13px]">Loading…</div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="text-[36px]">✨</span>
                <p className="text-[14px] font-bold text-white/40">Be the first to review!</p>
                <p className="text-[12px] text-white/25">Share your Seoul experience</p>
              </div>
            ) : (
              reviews.map(r => (
                <div key={r.id} className="rounded-2xl bg-white/4 border border-white/8 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-[14px] font-black text-white">{r.nickname}</p>
                      <p className="text-[10px] text-white/30 font-semibold mt-0.5">
                        {PERSONA_EMOJI[r.persona]} {r.persona} · {timeAgo(r.created_at)}
                      </p>
                    </div>
                    <Stars n={r.rating} />
                  </div>
                  <p className="text-[13px] text-white/65 leading-relaxed">{r.body}</p>
                  {r.spots_visited?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {r.spots_visited.map(s => (
                        <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/6 text-white/40">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Like + Comment row */}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/6">
                    <button
                      onClick={() => handleLike(r)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors active:scale-95"
                      style={{ color: likedIds.has(r.id) ? "#f43f5e" : "rgba(255,255,255,0.3)" }}
                    >
                      {likedIds.has(r.id) ? "♥" : "♡"}
                      <span>{r.likes_count || 0}</span>
                    </button>
                    <button
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                      className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors"
                      style={{ color: expandedId === r.id ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}
                    >
                      💬
                      <span>{commentCounts[r.id] ?? 0} {(commentCounts[r.id] ?? 0) === 1 ? "comment" : "comments"}</span>
                    </button>
                  </div>

                  {expandedId === r.id && (
                    <CommentThread reviewId={r.id} onCountChange={handleCommentCount} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Q&A TAB ── */}
      {tab === "qa" && (
        <div className="flex-1 flex flex-col">
          {/* Ask button */}
          <div className="mx-5 mb-4">
            <button
              onClick={() => router.push("/ask")}
              className="w-full py-3.5 rounded-xl text-[14px] font-black text-white active:scale-95 transition-transform"
              style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}
            >
              Ask a Question →
            </button>
          </div>

          {/* Filter hint */}
          <p className="px-5 text-[11px] text-white/25 font-semibold mb-3">
            Questions answered by Korean locals & experienced travelers
          </p>

          {/* Questions list */}
          <div className="px-5 flex flex-col gap-3 pb-10">
            {loading ? (
              <div className="flex items-center justify-center py-16 text-white/20 text-[13px]">Loading…</div>
            ) : questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <span className="text-[36px]">🇰🇷</span>
                <p className="text-[14px] font-bold text-white/40">No questions yet</p>
                <p className="text-[12px] text-white/25">Ask anything about Seoul — locals will answer</p>
              </div>
            ) : (
              questions.map(q => (
                <button
                  key={q.id}
                  onClick={() => router.push(`/questions/${q.id}`)}
                  className="rounded-2xl bg-white/4 border border-white/8 p-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[14px] font-black text-white leading-snug">{q.title}</p>
                      <p className="text-[12px] text-white/45 mt-1 line-clamp-2">{q.body}</p>
                    </div>
                    <div className="text-center shrink-0">
                      <p className="text-[18px] font-black text-white/60">{q.answer_count ?? 0}</p>
                      <p className="text-[9px] text-white/30 font-bold uppercase">answers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <p className="text-[10px] text-white/30 font-semibold">{q.nickname} · {timeAgo(q.created_at)}</p>
                    {q.tags?.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/6 text-white/40">{t}</span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function CommunityPage() {
  return (
    <Suspense>
      <CommunityContent />
    </Suspense>
  );
}
