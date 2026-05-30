import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

async function getCommunitySnapshot() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
    );
    const { data: reviews } = await supabase
      .from("reviews").select("nickname,persona,rating,body")
      .order("created_at", { ascending: false }).limit(1);
    return { review: reviews?.[0] ?? null };
  } catch {
    return { review: null };
  }
}

export default async function LandingPage() {
  const { review } = await getCommunitySnapshot();

  return (
    <div className="min-h-screen bg-neutral-950 text-white" style={{ fontFamily: "var(--font-geist-sans)" }}>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-neutral-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black text-xs">S</div>
            <span className="text-sm font-bold tracking-wider text-white/70 uppercase">Swipe &amp; Seoul</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/community" className="hidden sm:block text-[13px] font-semibold text-white/50 hover:text-white/80 transition-colors">
              Community
            </Link>
            <Link href="/donate" className="hidden sm:block text-[13px] font-semibold text-white/40 hover:text-white/70 transition-colors">
              🧋 Support us
            </Link>
            <Link
              href="/signup"
              className="text-[13px] font-black text-white px-4 py-2 rounded-xl transition-opacity active:opacity-80"
              style={{ background: "#e11d48" }}
            >
              Start Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO — full-bleed palace photo ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "calc(100vh - 56px)" }}>

        {/* Background photo */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1768006273859-ff7ffb56f4d2?auto=format&fit=crop&w=1920&q=85')`,
            backgroundPosition: "center 35%"
          }}
        />

        {/* Overlay layers */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.93) 100%)"
        }} />
        {/* Warm amber tint — echoes palace lantern light */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, rgba(140,70,0,0.3) 0%, transparent 55%)"
        }} />
        {/* Left fade for desktop text legibility */}
        <div className="absolute inset-0 hidden lg:block" style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, transparent 80%)"
        }} />

        {/* Content — pinned to bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-6xl mx-auto px-6 pb-16 lg:pb-24">
            <div className="max-w-xl">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] mb-5" style={{ color: "#f59e0b" }}>Seoul · Personalized</p>
              <h1
                className="text-[3.5rem] lg:text-[5.5rem] font-black leading-[0.93] tracking-tight text-white mb-5"
                style={{ fontFamily: "var(--font-playfair)", textShadow: "0 2px 40px rgba(0,0,0,0.5)" }}
              >
                Your Seoul.<br />
                <em style={{
                  fontStyle: "italic",
                  background: "linear-gradient(90deg,#fbbf24,#f59e0b)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>Your way.</em>
              </h1>
              <p className="text-[15px] lg:text-[17px] leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.65)", maxWidth: "420px" }}>
                Swipe 4 places — get a day plan built around your vibe, budget, and base. Ask Korean locals. Read real reviews.
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 font-black text-[15px] px-8 py-4 rounded-2xl text-white transition-opacity active:opacity-80"
                  style={{ background: "#e11d48" }}
                >
                  Find My Seoul →
                </Link>
                <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>Free · Under a minute</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top-right: floating feature pills (desktop only) */}
        <div className="absolute top-8 right-6 hidden lg:flex flex-col gap-2 items-end">
          {["✦ Persona match", "📅 Day itinerary", "🇰🇷 Ask a local", "💬 Community"].map(v => (
            <span key={v} className="text-[12px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-md" style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.75)"
            }}>{v}</span>
          ))}
        </div>

      </section>

      {/* ── HOW IT WORKS — cream section ── */}
      <section style={{ background: "#f5f0e8", color: "#1a1a1a" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-[11px] font-black tracking-[0.25em] uppercase mb-3" style={{ color: "#9333ea" }}>How it works</p>
          <h2 className="text-[2rem] lg:text-[2.75rem] font-black leading-tight mb-12" style={{ fontFamily: "var(--font-playfair)", color: "#1a1a1a" }}>
            Seoul in four steps.
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "01", icon: "🗺️", label: "Tell us your trip", detail: "Base area, budget, travel style." },
              { n: "02", icon: "👆", label: "Swipe 4 places",  detail: "Like or skip. Under 60 seconds." },
              { n: "03", icon: "✦",  label: "Get your plan",   detail: "Full day itinerary matched to your vibe." },
              { n: "04", icon: "🇰🇷", label: "Ask locals & share", detail: "Q&A with Korean locals + community reviews." },
            ].map(s => (
              <div key={s.n}>
                <p className="text-[3rem] font-black leading-none mb-3" style={{ color: "#e5ddd0", fontFamily: "var(--font-playfair)" }}>{s.n}</p>
                <span className="text-2xl block mb-2">{s.icon}</span>
                <p className="text-[15px] font-black leading-snug mb-1" style={{ color: "#1a1a1a" }}>{s.label}</p>
                <p className="text-[13px] leading-snug" style={{ color: "#6b5e4e" }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY — dark section ── */}
      <section className="bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-[11px] font-black tracking-[0.25em] uppercase text-rose-500 mb-3">Beyond the plan</p>
          <h2 className="text-[2rem] lg:text-[2.75rem] font-black text-white mb-10 leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>
            Ask a Korean local.<br /><em>Read real trip stories.</em>
          </h2>

          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
              <span className="text-3xl mb-4 block">🇰🇷</span>
              <p className="text-[15px] font-black text-white">Ask a Local</p>
              <p className="text-[13px] text-white/40 mt-2 leading-relaxed">Real answers from Koreans who live in Seoul: transport, food, nightlife, hidden spots.</p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
              <span className="text-3xl mb-4 block">✦</span>
              <p className="text-[15px] font-black text-white">Trip Reviews by Persona</p>
              <p className="text-[13px] text-white/40 mt-2 leading-relaxed">Stories from travelers who share your persona: what worked, what to skip, hidden gems.</p>
            </div>
            <div className="rounded-2xl bg-white/4 border border-white/8 p-6 flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-black text-white/25 uppercase tracking-widest mb-3">
                  {review ? "Latest review" : "Example"}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-black text-white">{review?.nickname ?? "Emma from London"}</span>
                  <span className="text-amber-400 text-[13px]">{"★".repeat(Math.round(review?.rating ?? 5))}</span>
                </div>
                <p className="text-[13px] text-white/55 leading-relaxed line-clamp-3">
                  &ldquo;{review?.body ?? "The Seongsu pop-up street was insane — 3 hours just vanished. Exactly my kind of day."}&rdquo;
                </p>
              </div>
              <Link href="/community" className="mt-4 text-[12px] font-black text-purple-400 hover:text-purple-300 transition-colors">
                Read all reviews →
              </Link>
            </div>
          </div>

          <Link
            href="/community"
            className="inline-flex items-center gap-2 py-3.5 px-6 rounded-xl text-[13px] font-black text-white/70 border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
          >
            Browse the Community →
          </Link>
        </div>
      </section>

      {/* ── DONATE — warm cream section ── */}
      <section style={{ background: "#1c1208" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="lg:grid lg:grid-cols-5 lg:gap-16 lg:items-start">

            {/* Left: story (3 cols) */}
            <div className="lg:col-span-3 mb-10 lg:mb-0">
              <p className="text-[11px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: "#d97706" }}>From the makers</p>
              <h2
                className="text-[2rem] lg:text-[2.75rem] font-black leading-tight mb-6"
                style={{ fontFamily: "var(--font-playfair)", color: "#fef3c7" }}
              >
                Two Seoul locals<br />
                <em>trying to help travelers.</em>
              </h2>
              <p className="text-[13px] font-black uppercase tracking-widest mb-8" style={{ color: "#92816a" }}>No budget. Just our evenings and weekends.</p>

              <div className="space-y-4 mb-8">
                <p className="text-[15px] leading-relaxed" style={{ color: "#d6c9a8" }}>
                  Annyeonghaseyo!<br />
                  I'm Toobie, I studied in the US for 5 years. My boyfriend Woogie studied in Australia. We both know what it feels like to land somewhere foreign and just feel <em style={{ color: "#fef3c7" }}>lost</em>.
                </p>
                <p className="text-[15px] leading-relaxed" style={{ color: "#d6c9a8" }}>
                  Korea is incredible, but it's still pretty closed off for visitors. Most apps, signs, menus are Korean-only. The culture doesn't always roll out the welcome mat.
                </p>
                <p className="text-[15px] leading-relaxed" style={{ color: "#d6c9a8" }}>
                  We wanted to change that. So we built this, just the two of us, on evenings and weekends, with zero budget. If it helped you find your Seoul, even a bubble tea means the world.
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl border" style={{ borderColor: "rgba(217,119,6,0.25)", background: "rgba(217,119,6,0.08)" }}>
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg" style={{ borderColor: "#d97706", background: "#2d1f0a" }}>🇰🇷</div>
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg" style={{ borderColor: "#d97706", background: "#2d1f0a" }}>🇦🇺</div>
                </div>
                <div>
                  <p className="text-[14px] font-black" style={{ color: "#fef3c7" }}>Toobie &amp; Woogie</p>
                  <p className="text-[12px]" style={{ color: "#92816a" }}>Seoul locals · former expats · made this with ♥</p>
                </div>
              </div>
            </div>

            {/* Right: tiers (2 cols) */}
            <div className="lg:col-span-2 flex flex-col gap-3">
              <p className="text-[11px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: "#92816a" }}>If it helped you find your Seoul,<br />even a bubble tea means the world. 감사합니다 🙏</p>
              {[
                { emoji: "🧋", label: "Bubble Tea",    price: "$3",  desc: "A small thank-you" },
                { emoji: "🌶️", label: "Tteokbokki",   price: "$5",  desc: "Spicy appreciation 🔥" },
                { emoji: "🍲", label: "Kimchi Jjigae", price: "$10", desc: "You're basically family now" },
              ].map(tier => (
                <a
                  key={tier.label}
                  href={`https://ko-fi.com/toobietoobers`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95 hover:border-amber-600/50"
                  style={{ borderColor: "rgba(217,119,6,0.2)", background: "rgba(217,119,6,0.06)" }}
                >
                  <span className="text-3xl">{tier.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[15px] font-black" style={{ color: "#fef3c7" }}>{tier.label}</p>
                    <p className="text-[12px]" style={{ color: "#92816a" }}>{tier.desc}</p>
                  </div>
                  <span className="text-[18px] font-black" style={{ color: "#d97706" }}>{tier.price}</span>
                </a>
              ))}
              <Link
                href="/donate"
                className="mt-2 text-center py-4 rounded-2xl text-[14px] font-black transition-opacity active:opacity-80"
                style={{ background: "linear-gradient(90deg,#d97706,#b45309)", color: "#1c1208" }}
              >
                ☕ Support us on Ko-fi →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ background: "#f5f0e8", borderTop: "1px solid #e5ddd0" }}>
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[22px] font-black leading-snug" style={{ fontFamily: "var(--font-playfair)", color: "#1a1a1a" }}>
              Ready to plan your Seoul trip?
            </p>
            <p className="text-[14px] mt-1" style={{ color: "#6b5e4e" }}>Free · No sign-up required · Under a minute</p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 inline-flex items-center gap-2 font-black text-[15px] px-8 py-4 rounded-2xl text-white transition-opacity active:opacity-80"
            style={{ background: "#e11d48" }}
          >
            Find My Seoul →
          </Link>
        </div>
        <div className="max-w-6xl mx-auto px-6 pb-8 flex items-center justify-between">
          <p className="text-[12px]" style={{ color: "#9e8e7e" }}>Made with ♥ by Seoul locals who love visitors</p>
          <Link href="/donate" className="text-[12px] font-semibold transition-colors" style={{ color: "#9e8e7e" }}>
            🧋 Buy us a bubble tea
          </Link>
        </div>
      </section>

    </div>
  );
}
