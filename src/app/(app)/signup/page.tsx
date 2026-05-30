"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

const NATIONALITIES = [
  "American", "Australian", "British", "Canadian", "Chinese", "French",
  "German", "Hong Konger", "Indian", "Indonesian", "Japanese", "Malaysian",
  "New Zealander", "Singaporean", "Spanish", "Taiwanese", "Thai", "Vietnamese",
  "Other",
];

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const existing = storage.getSignupProfile();
    if (existing) {
      setFirstName(existing.firstName);
      setLastName(existing.lastName);
      setNationality(existing.nationality);
      setAge(existing.age);
      setEmail(existing.email);
    }
  }, []);

  function handleSubmit() {
    if (!firstName.trim() || !email.trim()) return;
    const profile = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      nationality,
      age,
      email: email.trim(),
    };
    storage.setSignupProfile(profile);
    supabase.from("signups").insert({
      first_name: profile.firstName,
      last_name: profile.lastName,
      nationality: profile.nationality,
      age: profile.age,
      email: profile.email,
    }).then(() => {});
    router.push("/onboarding");
  }

  const isValid = firstName.trim().length > 0 && email.trim().includes("@");

  return (
    <main className="flex flex-col min-h-dvh bg-neutral-950 pb-10 max-w-lg mx-auto w-full">
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg bg-rose-500 flex items-center justify-center text-white font-black text-xs">S</div>
          <span className="text-sm font-bold tracking-wider text-white/50 uppercase">Swipe &amp; Seoul</span>
        </div>

        <p className="text-[11px] font-black uppercase tracking-widest text-white/30 mb-1">Welcome</p>
        <h1 className="text-[28px] font-black text-white leading-tight">Quick intro<br />before we start.</h1>
        <p className="text-[13px] text-white/40 mt-2">We'll use this to personalise your experience and pre-fill community posts.</p>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">First name</label>
            <input
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Sarah"
              maxLength={30}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">Last name</label>
            <input
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Kim"
              maxLength={30}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* Nationality */}
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">Nationality</label>
          <select
            value={nationality}
            onChange={e => setNationality(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-white/30 appearance-none"
            style={{ color: nationality ? "white" : "rgba(255,255,255,0.2)" }}
          >
            <option value="" disabled style={{ background: "#171717" }}>Select your country</option>
            {NATIONALITIES.map(n => (
              <option key={n} value={n} style={{ background: "#171717", color: "white" }}>{n}</option>
            ))}
          </select>
        </div>

        {/* Age + Email row */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">Age</label>
            <input
              value={age}
              onChange={e => setAge(e.target.value.replace(/\D/g, ""))}
              placeholder="28"
              maxLength={3}
              inputMode="numeric"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-white/30"
            />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-white/40 block mb-2">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="sarah@gmail.com"
              type="email"
              maxLength={80}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[14px] text-white placeholder:text-white/20 outline-none focus:border-white/30"
            />
          </div>
        </div>

        <div className="mt-2 rounded-xl bg-white/3 border border-white/6 px-4 py-3">
          <p className="text-[11px] text-white/30 leading-relaxed">
            🔒 Your info is stored locally on your device. Email is only used if you want trip updates — never shared.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full py-4 rounded-2xl text-[15px] font-black text-white active:scale-95 transition-transform disabled:opacity-40 mt-1"
          style={{ background: "linear-gradient(135deg,#f43f5e,#a855f7)" }}
        >
          Get Started →
        </button>

        <button
          onClick={() => router.push("/onboarding")}
          className="text-center text-[13px] text-white/25 font-semibold py-2"
        >
          Skip for now
        </button>
      </div>
    </main>
  );
}
