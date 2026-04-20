"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok" | "denied">("checking");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setStatus("denied");
      return;
    }

    // Verify token server-side before storing
    fetch("/api/admin/verify", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          sessionStorage.setItem("adminToken", token); // store verified token
          router.replace(`/admin/customer${window.location.search}`);
        } else {
          setStatus("denied");
        }
      })
      .catch(() => setStatus("denied"));
  }, [router]);

  if (status === "checking") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--brown-light)" }}>Verifying access…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <p className="text-sm font-medium text-red-600">Access denied.</p>
    </main>
  );
}
