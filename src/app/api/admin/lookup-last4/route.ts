import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";
import { store } from "@/lib/stamps";

export async function POST(req: NextRequest) {
  if (!verifyAdminToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { last4 } = body as { last4?: string };

  if (!last4 || !/^\d{4}$/.test(last4)) {
    return NextResponse.json({ error: "last4 must be exactly 4 digits" }, { status: 400 });
  }

  const matches = Array.from(store.values()).filter((entry) => entry.phone.endsWith(last4));

  if (matches.length === 0) {
    return NextResponse.json({ error: "No customers found" }, { status: 404 });
  }

  const results = matches.map((entry) => ({
    phone: entry.phone,
    name: entry.name,
    stamps: entry.stamps,
    lastVisit: entry.lastVisit,
    redeemed: entry.redeemed,
  }));

  return NextResponse.json(results);
}
