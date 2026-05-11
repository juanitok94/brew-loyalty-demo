"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { STAMPS_REQUIRED } from "../lib/constants";
import { CoffeeIcon } from "@/components/CoffeeIcon";

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

  const inputStyle = {
    height: "52px",
    fontSize: "16px", // prevents iOS auto-zoom
    background: "#fff",
    color: "var(--foreground)",
  };

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center page-wrapper">
      <div className="w-full max-w-[480px] space-y-7">

        {/* Header */}
        <div className="text-center space-y-2">
          <CoffeeIcon
            size={72}
            className="mx-auto mb-3"
            style={{ color: "var(--brown)" }}
          />
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--brown-dark)" }}>
            Loyalty Card Sign-Up
          </h1>
          <p className="text-base" style={{ color: "var(--brown-light)" }}>
            NC&apos;s independent cafe loyalty card
          </p>
        </div>

        {/* Offer teaser */}
        <div className="rounded-2xl p-5 text-center space-y-1" style={{ background: "var(--cream)" }}>
          <p className="text-sm font-medium" style={{ color: "var(--brown-light)" }}>
            Buy {STAMPS_REQUIRED} coffee/tea drinks
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--brown)" }}>
            Get the 10th FREE
          </p>
          <p className="text-xs" style={{ color: "var(--brown-light)" }}>
            No app download needed
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Your name or nickname
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="e.g. Sam, Jazz, or CoffeeKing (min 3 chars)"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setNameError(""); }}
              className="w-full px-4 rounded-xl border outline-none transition-all"
              style={{
                ...inputStyle,
                borderColor: nameError ? "#dc2626" : "var(--stamp-empty)",
              }}
              autoFocus
            />
            {nameError && <p className="text-sm text-red-600">{nameError}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="(828) 555-0123"
              value={phone}
              onChange={handleChange}
              className="w-full px-4 rounded-xl border outline-none transition-all"
              style={{
                ...inputStyle,
                borderColor: error ? "#dc2626" : "var(--stamp-empty)",
              }}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[#bf5a38]"
            />
            <span className="text-sm" style={{ color: "var(--foreground)" }}>
              I agree to the{" "}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: "var(--brown-dark)" }}
              >
                Terms &amp; Conditions
              </Link>
              . We only use your info to track your stamps.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !termsAccepted}
            className="w-full rounded-xl font-semibold text-white text-base transition-opacity disabled:opacity-50"
            style={{ background: "var(--brown)", height: "52px" }}
          >
            {loading ? "Loading..." : "See My Card"}
          </button>

          <p className="text-sm text-center" style={{ color: "var(--brown-light)" }}>
            One stamp per drink · No smoothies or frappes
          </p>
        </form>
      </div>
    </main>
  );
}
