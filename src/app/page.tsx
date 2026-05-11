"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { STAMPS_REQUIRED } from "../lib/constants";

export default function HomePage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  function formatDisplay(digits: string) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(formatDisplay(raw));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (firstName.trim().length < 3) {
      setNameError("Please enter a name or nickname of at least 3 characters.");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) {
      setError("Please enter a valid 10-digit US phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stamps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits, name: firstName || undefined }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push(`/card?phone=${encodeURIComponent(digits)}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <img
            src="/coffee-cup.svg"
            alt="Your Coffee Shop"
            className="mx-auto w-24 h-24 object-contain mb-4"
          />
          <h1 className="text-3xl font-bold tracking-tight text-[#8B1E1E]">
            Loyalty Card Sign-Up
          </h1>
          <p className="text-base" style={{ color: "var(--brown-light)" }}>
            Proudly independent. North Carolina grown.
          </p>
        </div>

        {/* Card Teaser */}
        <div
          className="rounded-2xl p-6 text-center space-y-1"
          style={{ background: "var(--cream)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--brown-light)" }}>
            Buy {STAMPS_REQUIRED} coffee/tea drinks
          </p>
          <p className="text-2xl font-bold text-[#8B1E1E]">
            Get the 10th FREE
          </p>
          <p className="text-xs" style={{ color: "var(--brown-light)" }}>
            No app download needed
          </p>
        </div>

        {/* Phone Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Your name or nickname
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="e.g. Sam, Jazz, or CoffeeKing (min 3 chars)"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setNameError(""); }}
              className="w-full px-4 py-3 rounded-xl border text-base outline-none transition-all"
              style={{
                borderColor: nameError ? "#dc2626" : "var(--stamp-empty)",
                background: "#fff",
                color: "var(--foreground)",
              }}
              autoFocus
            />
            {nameError && <p className="text-sm text-red-600">{nameError}</p>}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Enter your phone number to see your card
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="(828) 555-0123"
              value={phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border text-base outline-none transition-all"
              style={{
                borderColor: error ? "#dc2626" : "var(--stamp-empty)",
                background: "#fff",
                color: "var(--foreground)",
              }}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded accent-[#8B1E1E]"
            />
            <span className="text-sm" style={{ color: "var(--foreground)" }}>
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--brown)" }}
              >
                Terms &amp; Conditions
              </Link>
              . We only use your info to track your loyalty stamps.
            </span>
          </label>
          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full py-3 rounded-xl font-semibold text-white text-base transition-opacity disabled:opacity-60"
            style={{ background: "var(--brown)" }}
          >
            {loading ? "Loading..." : "See My Card"}
          </button>
          <p className="text-[14px] text-gray-500 mt-2 text-center">
            Not valid on smoothies or frappes. One stamp per drink
          </p>
        </form>
      </div>
    </main>
  );
}
