import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/stamps";

type CheckinWithShop = {
  shops: { slug: string } | { slug: string }[] | null;
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }

  const normalized = normalizePhone(phone);

  const { data: customer, error: customerError } = await db
    .from("customers")
    .select("id")
    .eq("phone", normalized)
    .maybeSingle();

  if (customerError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  if (!customer) {
    return NextResponse.json({ visited_slugs: [] });
  }

  const { data: checkins, error: checkinsError } = await db
    .from("passport_checkins")
    .select("shops(slug)")
    .eq("customer_id", customer.id);

  if (checkinsError) {
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }

  const visited_slugs = ((checkins ?? []) as CheckinWithShop[])
    .map((row) => {
      if (!row.shops) return undefined;
      return Array.isArray(row.shops) ? row.shops[0]?.slug : row.shops.slug;
    })
    .filter((slug): slug is string => typeof slug === "string");

  return NextResponse.json({ visited_slugs });
}
