"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DonatePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-dvh max-w-lg mx-auto w-full" style={{ background: "#0f0a04" }}>

      {/* ── Back nav ── */}
      <div className="px-5 pt-10 pb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[13px] font-semibold transition-opacity hover:opacity-70"
          style={{ color: "#92816a" }}
        >
          ← Back
        </button>
      </div>

      {/* ── Hero statement ── */}
      <div className="px-5 pt-8 pb-10" style={{ borderBottom: "1px solid rgba(217,119,6,0.15)" }}>
        <p className="text-[11px] font-black tracking-[0.25em] uppercase mb-4" style={{ color: "#d97706" }}>
          From Toobie &amp; Woogie
        </p>
        <h1
          className="text-[2.4rem] font-black leading-[1.05] mb-5"
          style={{ fontFamily: "var(--font-playfair)", color: "#fef3c7" }}
        >
          Two Seoul locals<br />
          trying to help<br />
          <em>travelers like you.</em>
        </h1>
        <p className="text-[15px] leading-relaxed" style={{ color: "#a89070", maxWidth: "380px" }}>
          No budget. Just our evenings, weekends, and genuine care. If this helped you, buying us something would genuinely make our day.
        </p>
      </div>

      {/* ── Story ── */}
      <div className="px-5 py-10" style={{ borderBottom: "1px solid rgba(217,119,6,0.1)" }}>
        <p className="text-[11px] font-black tracking-[0.25em] uppercase mb-6" style={{ color: "#92816a" }}>Our story</p>

        <div className="space-y-5">
          <p className="text-[15px] leading-relaxed" style={{ color: "#d6c9a8" }}>
            Annyeonghaseyo!<br />
            I'm Toobie. I studied in the US for 5 years, and my boyfriend Woogie studied in Australia. We both know that feeling of landing in a foreign city, not speaking the language, and just feeling completely <em style={{ color: "#fef3c7", fontStyle: "italic" }}>lost</em>.
          </p>

          {/* Pull quote */}
          <div className="py-5 px-1" style={{ borderLeft: "3px solid #d97706" }}>
            <p className="text-[18px] font-black leading-snug pl-4" style={{ fontFamily: "var(--font-playfair)", color: "#fef3c7" }}>
              "Korea is incredible, but it's still pretty closed off. Most apps are Korean-only. The culture doesn't always roll out the welcome mat."
            </p>
          </div>

          <p className="text-[15px] leading-relaxed" style={{ color: "#d6c9a8" }}>
            We wanted to change that. Not with a big company or VC funding, just us two, on evenings and weekends, building something we genuinely wish had existed when we were traveling.
          </p>
          <p className="text-[15px] leading-relaxed" style={{ color: "#d6c9a8" }}>
            No ads. No subscription. Completely free. If it helped you find your corner of Seoul, please buy us something to eat.
          </p>
        </div>

        {/* Makers */}
        <div className="flex items-center gap-4 mt-8 p-4 rounded-2xl border" style={{ borderColor: "rgba(217,119,6,0.2)", background: "rgba(217,119,6,0.06)" }}>
          <div className="flex -space-x-2">
            <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl" style={{ borderColor: "#d97706", background: "#2d1f0a" }}>🇰🇷</div>
            <div className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl" style={{ borderColor: "#d97706", background: "#2d1f0a" }}>🇦🇺</div>
          </div>
          <div>
            <p className="text-[15px] font-black" style={{ color: "#fef3c7" }}>Toobie &amp; Woogie</p>
            <p className="text-[12px]" style={{ color: "#92816a" }}>Seoul locals · former expats · made this with ♥</p>
          </div>
        </div>
      </div>

      {/* ── Donation tiers ── */}
      <div className="px-5 py-10">
        <p className="text-[13px] leading-relaxed mb-6" style={{ color: "#d6c9a8" }}>If it helped you find your Seoul,<br />even a bubble tea means the world. 감사합니다 🙏</p>

        <div className="flex flex-col gap-3 mb-6">
          {[
            { emoji: "🧋", label: "Bubble Tea",    price: "$3",  desc: "A small thank-you" },
            { emoji: "🌶️", label: "Tteokbokki",   price: "$5",  desc: "Spicy appreciation 🔥" },
            { emoji: "🍲", label: "Kimchi Jjigae", price: "$10", desc: "You're basically family now" },
          ].map(tier => (
            <a
              key={tier.label}
              href="https://ko-fi.com/toobietoobers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 rounded-2xl border transition-all active:scale-95"
              style={{ borderColor: "rgba(217,119,6,0.25)", background: "rgba(217,119,6,0.07)" }}
            >
              <span className="text-3xl">{tier.emoji}</span>
              <div className="flex-1">
                <p className="text-[16px] font-black" style={{ color: "#fef3c7" }}>{tier.label}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "#92816a" }}>{tier.desc}</p>
              </div>
              <span className="text-[20px] font-black" style={{ color: "#d97706" }}>{tier.price}</span>
            </a>
          ))}
        </div>

        {/* Ko-fi CTA */}
        <a
          href="https://ko-fi.com/toobietoobers"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 rounded-2xl text-[15px] font-black text-center block transition-opacity active:opacity-80"
          style={{ background: "#FF5E5B", color: "#fff" }}
        >
          ☕ Support us on Ko-fi
        </a>

        <p className="text-center text-[11px] mt-3" style={{ color: "#5a4e3e" }}>
          PayPal · Credit card · Any amount means the world to us
        </p>
      </div>

      {/* ── Footer nav ── */}
      <div className="px-5 pb-12 flex flex-col gap-2 items-center" style={{ borderTop: "1px solid rgba(217,119,6,0.1)" }}>
        <div className="flex gap-6 pt-8">
          <Link href="/plan" className="text-[13px] font-semibold" style={{ color: "#5a4e3e" }}>My Plan</Link>
          <Link href="/community" className="text-[13px] font-semibold" style={{ color: "#5a4e3e" }}>Community</Link>
          <Link href="/" className="text-[13px] font-semibold" style={{ color: "#5a4e3e" }}>Home</Link>
        </div>
      </div>

    </main>
  );
}
