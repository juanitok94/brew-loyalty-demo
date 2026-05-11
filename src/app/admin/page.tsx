"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/customer");
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p style={{ color: "var(--brown-light)" }}>Loading…</p>
    </main>
  );
}
