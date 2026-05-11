"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { STAMPS_REQUIRED } from "@/lib/constants";
import { CoffeeIcon } from "@/components/CoffeeIcon";

type CustomerData = {
  phone: string;
  stamps: number;
  lastVisit: string;
  redeemed: number;
  name: string | null;
};

const TOTAL = STAMPS_REQUIRED;

function formatDisplay(digits: string) {
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function AdminCustomerPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [last4Input, setLast4Input] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [showFullInput, setShowFullInput] = useState(false);
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [collisions, setCollisions] = useState<CustomerData[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const last4Ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setToken("demo");
  }, []);

  useEffect(() => {
    if (token) last4Ref.current?.focus();
  }, [token]);

  function resetToIdle() {
    setCustomer(null);
    setCollisions([]);
    setLast4Input("");
    setPhoneInput("");
    setError("");
    setMessage("");
    setTimeout(() => last4Ref.current?.focus(), 50);
  }

  const lookupByLast4 = useCallback(async (digits: string) => {
    setLoading(true);
    setError("");
    setMessage("");
    setCustomer(null);
    setCollisions([]);
    try {
      const res = await fetch("/api/admin/lookup-last4", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ last4: digits }),
      });
      if (res.status === 401) { router.replace("/admin"); return; }
      if (res.status === 404) {
        setError("No customer found. Use full number below to create one.");
        setShowFullInput(true);
        return;
      }
      const data: CustomerData[] = await res.json();
      if (data.length === 1) setCustomer(data[0]);
      else setCollisions(data);
    } catch {
      setError("Lookup failed.");
    } finally {
      setLoading(false);
    }
  }, [token, router]);

  function handleLast4Change(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setLast4Input(digits);
    setError("");
    setCustomer(null);
    setCollisions([]);
    if (digits.length === 4) void lookupByLast4(digits);
  }

  function handleLast4Submit(e: React.FormEvent) {
    e.preventDefault();
    if (last4Input.length === 4) void lookupByLast4(last4Input);
  }

  async function loadCustomerByDigits(digits: string) {
    if (digits.length !== 10) { setError("Enter a valid 10-digit number."); return; }
    setLoading(true);
    setError("");
    setMessage("");
    setCustomer(null);
    setCollisions([]);
    try {
      const res = await fetch("/api/admin/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: digits }),
      });
      if (res.status === 401) { router.replace("/admin"); return; }
      if (res.status === 404) {
        const createRes = await fetch("/api/stamps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: digits }),
        });
        setCustomer(await createRes.json());
        setMessage("New customer created.");
      } else {
        setCustomer(await res.json());
      }
    } catch {
      setError("Lookup failed.");
    } finally {
      setLoading(false);
    }
  }

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhoneInput(formatDisplay(raw));
    setError("");
    setCustomer(null);
    setCollisions([]);
  }

  function handleFullLookup(e: React.FormEvent) {
    e.preventDefault();
    void loadCustomerByDigits(phoneInput.replace(/\D/g, ""));
  }

  async function addStamp() {
    if (!customer) return;
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: customer.phone.replace(/\D/g, "") }),
      });
      if (res.status === 401) { router.replace("/admin"); return; }
      const data: CustomerData = await res.json();
      setCustomer(data);
      setMessage(
        data.stamps >= TOTAL
          ? `Stamp added — ${data.stamps} / ${TOTAL} — Reward ready!`
          : `Stamp added — ${data.stamps} / ${TOTAL} stamps`
      );
    } catch {
      setError("Failed to add stamp.");
    } finally {
      setActionLoading(false);
    }
  }

  async function removeStamp() {
    if (!customer) return;
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/remove-stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: customer.phone.replace(/\D/g, "") }),
      });
      if (res.status === 401) { router.replace("/admin"); return; }
      if (!res.ok) { setError((await res.json()).error ?? "Remove stamp failed."); return; }
      const data: CustomerData = await res.json();
      setCustomer(data);
      setMessage(`Stamp removed — ${data.stamps} / ${TOTAL} stamps`);
    } catch {
      setError("Failed to remove stamp.");
    } finally {
      setActionLoading(false);
    }
  }

  async function redeemReward() {
    if (!customer) return;
    setActionLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ phone: customer.phone.replace(/\D/g, "") }),
      });
      if (res.status === 401) { router.replace("/admin"); return; }
      if (!res.ok) { setError((await res.json()).error ?? "Redeem failed."); return; }
      const data: CustomerData = await res.json();
      setCustomer(data);
      setMessage("Reward redeemed — card reset to 0 stamps.");
    } catch {
      setError("Failed to redeem.");
    } finally {
      setActionLoading(false);
    }
  }

  const isReady = customer && customer.stamps >= TOTAL;
  const last4 = customer?.phone.slice(-4) ?? "";
  const displayName = customer?.name ?? "Loyalty Customer";

  const actionBtn = "rounded-xl font-semibold text-sm disabled:opacity-40 transition-opacity";
  const actionH = { minHeight: "52px" };

  return (
    <main className="min-h-[100dvh] overflow-y-auto flex flex-col items-center page-wrapper">
      <div className="w-full max-w-[480px] space-y-6">

        {/* Header */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <CoffeeIcon size={48} style={{ color: "var(--brown)" }} />
          <h1 className="text-lg font-bold" style={{ color: "var(--brown-dark)" }}>
            Your Coffee Shop — Barista
          </h1>
        </div>

        {/* Last-4 lookup */}
        <form onSubmit={handleLast4Submit} className="space-y-3">
          <label className="block text-sm font-medium text-center" style={{ color: "var(--foreground)" }}>
            Enter Last 4 Digits of Customer Phone
          </label>
          <div className="flex gap-2 w-full min-w-0">
            <input
              ref={last4Ref}
              type="tel"
              inputMode="numeric"
              placeholder="Last 4 digits"
              value={last4Input}
              onChange={handleLast4Change}
              maxLength={4}
              disabled={loading}
              className="flex-1 min-w-0 px-4 rounded-xl border text-4xl text-center tracking-widest outline-none font-mono disabled:opacity-50"
              style={{
                height: "64px",
                fontSize: "32px",
                borderColor: error ? "#dc2626" : "var(--stamp-empty)",
                background: "#fff",
                color: "var(--foreground)",
              }}
            />
            <button
              type="submit"
              disabled={loading || last4Input.length !== 4}
              className="px-5 rounded-xl font-semibold text-white disabled:opacity-40"
              style={{ background: "var(--brown)", minHeight: "64px" }}
            >
              {loading ? "…" : "Go"}
            </button>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        </form>

        {/* Collision picker */}
        {collisions.length > 1 && (
          <div
            className="rounded-2xl p-4 space-y-2"
            style={{ background: "#fff", border: "1.5px solid var(--stamp-empty)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--brown-light)" }}>
              Multiple matches — tap the right customer:
            </p>
            {collisions.map((c) => {
              const formatted = c.phone.replace(/^\+1(\d{3})(\d{3})(\d{4})$/, "($1) $2-$3");
              return (
                <button
                  key={c.phone}
                  onClick={() => { setCustomer(c); setCollisions([]); setMessage(""); }}
                  className="w-full text-left px-4 py-3 rounded-xl font-medium text-sm"
                  style={{ background: "var(--cream)", color: "var(--brown-dark)", minHeight: "52px" }}
                >
                  {c.name ?? "Loyalty Customer"} — {formatted} — {c.stamps} / {TOTAL} stamps
                </button>
              );
            })}
          </div>
        )}

        {/* Customer card */}
        {customer && (
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{ background: "#fff", border: "1.5px solid var(--stamp-empty)" }}
          >
            <div className="space-y-0.5">
              <p className="text-lg font-semibold" style={{ color: "var(--brown-dark)" }}>{displayName}</p>
              <p className="text-sm" style={{ color: "var(--brown-light)" }}>Phone ending in {last4}</p>
              <p className="text-xs" style={{ color: "var(--brown-light)" }}>
                Last visit: {customer.lastVisit} · {customer.redeemed} free drink{customer.redeemed !== 1 ? "s" : ""} earned
              </p>
            </div>

            {isReady && (
              <div
                className="rounded-xl p-3 text-center space-y-0.5"
                style={{ background: "var(--brown)", color: "#fff" }}
              >
                <p className="font-semibold text-base">Reward ready</p>
                <p className="text-sm opacity-90">Customer has earned a free drink.</p>
              </div>
            )}

            {/* Stamp grid */}
            <div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: TOTAL }).map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-full flex items-center justify-center text-xl mx-auto"
                    style={{
                      background: i < customer.stamps ? "var(--stamp-filled)" : "var(--stamp-empty)",
                      color: i < customer.stamps ? "#fff" : "var(--brown-light)",
                    }}
                  >
                    {i < customer.stamps ? "☕" : ""}
                  </div>
                ))}
              </div>
              <p className="text-xs text-center mt-2" style={{ color: "var(--brown-light)" }}>
                {customer.stamps} / {TOTAL} stamps
              </p>
            </div>

            {message && (
              <p className="text-sm font-medium text-center" style={{ color: "#16a34a" }}>
                {message}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              {isReady ? (
                <>
                  <button
                    onClick={redeemReward}
                    disabled={actionLoading}
                    className={`w-full ${actionBtn}`}
                    style={{ background: "var(--brown)", color: "#fff", ...actionH }}
                  >
                    {actionLoading ? "…" : "Redeem Reward"}
                  </button>
                  <button
                    onClick={removeStamp}
                    disabled={actionLoading}
                    className={`w-full ${actionBtn}`}
                    style={{ background: "var(--cream)", color: "var(--brown-dark)", ...actionH }}
                  >
                    {actionLoading ? "…" : "− Remove Stamp"}
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={addStamp}
                    disabled={actionLoading}
                    className={`flex-1 ${actionBtn}`}
                    style={{ background: "var(--brown)", color: "#fff", ...actionH }}
                  >
                    {actionLoading ? "…" : "+ Add Stamp"}
                  </button>
                  <button
                    onClick={removeStamp}
                    disabled={actionLoading || customer.stamps === 0}
                    className={`flex-1 ${actionBtn}`}
                    style={{ background: "var(--cream)", color: "var(--brown-dark)", ...actionH }}
                  >
                    {actionLoading ? "…" : "− Remove Stamp"}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={resetToIdle}
              className="w-full text-xs text-center underline pt-1"
              style={{ color: "var(--brown-light)", minHeight: "36px" }}
            >
              Search Another Customer
            </button>
          </div>
        )}

        {/* Full number fallback */}
        {!customer && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowFullInput((v) => !v)}
              className="text-xs underline w-full text-center"
              style={{ color: "var(--brown-light)", minHeight: "36px" }}
            >
              {showFullInput ? "✕ Cancel" : "Use full number instead"}
            </button>
            {showFullInput && (
              <form onSubmit={handleFullLookup} className="mt-3 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="(828) 555-0123"
                    value={phoneInput}
                    onChange={handlePhoneChange}
                    className="flex-1 px-4 rounded-xl border outline-none"
                    style={{
                      height: "52px",
                      fontSize: "16px",
                      borderColor: "var(--stamp-empty)",
                      background: "#fff",
                      color: "var(--foreground)",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 rounded-xl font-semibold text-white disabled:opacity-60"
                    style={{ background: "var(--brown)", minHeight: "52px" }}
                  >
                    {loading ? "…" : "Look Up"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Logout */}
        <div className="pt-2 text-center pb-4">
          <button
            type="button"
            onClick={() => { sessionStorage.removeItem("adminToken"); router.push("/admin"); }}
            className="text-xs underline"
            style={{ color: "var(--brown-light)", minHeight: "36px" }}
          >
            Logout of barista mode
          </button>
        </div>

      </div>
    </main>
  );
}
