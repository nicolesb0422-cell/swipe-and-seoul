"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Question, Answer } from "@/types";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

export default function QuestionPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [nickname, setNickname] = useState("");
  const [body, setBody] = useState("");
  const [isLocal, setIsLocal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data: q }, { data: a }] = await Promise.all([
        supabase.from("questions").select("*").eq("id", id).single(),
        supabase.from("answers").select("*").eq("question_id", id).order("created_at", { ascending: true }),
      ]);
      if (q) setQuestion(q);
      if (a) setAnswers(a);
    }
    load();
  }, [id]);

  async function handleAnswer() {
    if (!nickname.trim() || body.trim().length < 5) return;
    setSubmitting(true);
    const { data, error } = await supabase.from("answers").insert({
      question_id: id,
      nickname: nickname.trim(),
      body: body.trim(),
      is_local: isLocal,
    }).select().single();
    setSubmitting(false);
    if (!error && data) {
      setAnswers(prev => [...prev, data]);
      setBody("");
      setNickname("");
    }
  }

  if (!question) {
    return (
      <main className="flex min-h-dvh bg-neutral-950 items-center justify-center">
        <p className="text-white/30 text-[13px]">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-dvh bg-neutral-950 pb-10">
      <div className="px-5 pt-12 pb-4">
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white/60 text-lg mb-5">←</button>
      </div>

      {/* Question */}
      <div className="mx-5 rounded-2xl bg-white/5 border border-white/10 p-5 mb-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-2">
          {question.nickname} · {timeAgo(question.created_at)}
        </p>
        <h1 className="text-[20px] font-black text-white leading-snug mb-3">{question.title}</h1>
        <p className="text-[14px] text-white/60 leading-relaxed">{question.body}</p>
        {question.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {question.tags.map(t => (
              <span key={t} className="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Answers */}
      <div className="px-5">
        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-3">
          {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {answers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[13px] text-white/30">Be the first to answer ↓</p>
            </div>
          ) : (
            answers.map(a => (
              <div key={a.id} className="rounded-2xl bg-white/4 border border-white/8 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[13px] font-black text-white">{a.nickname}</p>
                  {a.is_local && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      🇰🇷 Korean Local
                    </span>
                  )}
                  <span className="text-[10px] text-white/25 ml-auto">{timeAgo(a.created_at)}</span>
                </div>
                <p className="text-[13px] text-white/65 leading-relaxed">{a.body}</p>
              </div>
            ))
          )}
        </div>

        {/* Answer form */}
        <div className="rounded-2xl bg-white/4 border border-white/8 p-4">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-3">Write an Answer</p>

          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Your name / nickname"
            maxLength={30}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/25 mb-3"
          />
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Share what you know…"
            rows={3}
            maxLength={500}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/25 resize-none mb-3"
          />

          {/* Korean local toggle */}
          <button
            onClick={() => setIsLocal(v => !v)}
            className="flex items-center gap-2.5 mb-4"
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-black border"
              style={{
                borderColor: isLocal ? "rgba(52,211,153,0.6)" : "rgba(255,255,255,0.15)",
                background: isLocal ? "rgba(52,211,153,0.15)" : "transparent",
                color: "#34d399",
              }}
            >
              {isLocal ? "✓" : ""}
            </div>
            <span className="text-[12px] font-semibold text-white/50">I&apos;m a Korean local 🇰🇷</span>
          </button>

          <button
            onClick={handleAnswer}
            disabled={submitting || !nickname.trim() || body.trim().length < 5}
            className="w-full py-3.5 rounded-xl text-[14px] font-black text-white active:scale-95 transition-transform disabled:opacity-40"
            style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}
          >
            {submitting ? "Posting…" : "Post Answer"}
          </button>
        </div>
      </div>
    </main>
  );
}
