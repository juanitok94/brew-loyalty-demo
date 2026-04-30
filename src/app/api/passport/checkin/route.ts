import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { normalizePhone } from "@/lib/stamps";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phone, shop_slug } = body;

  if (!phone || !shop_slug) {
    return NextResponse.json({ error: "phone and shop_slug required" }, { status: 400 });
  }

  const normalized = normalizePhone(phone);

  // Find or create customer
  const { data: existing, error: findError } = await db
    .from("customers")
    .select("id")
    .eq("phone", normalized)
    .maybeSingle();

  if (findError) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  let customerId: string;

  if (existing) {
    customerId = existing.id as string;
  } else {
    const { data: created, error: createError } = await db
      .from("customers")
      .insert({ phone: normalized })
      .select("id")
      .single();

    if (createError || !created) {
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 });
    }
    customerId = created.id as string;
  }

  // Find shop
  const { data: shop, error: shopError } = await db
    .from("shops")
    .select("id")
    .eq("slug", shop_slug)
    .maybeSingle();

  if (shopError || !shop) {
    return NextResponse.json({ error: `Shop not found: ${shop_slug}` }, { status: 404 });
  }

  // Insert checkin — 23505 means already checked in, which is fine
  const { error: checkinError } = await db
    .from("passport_checkins")
    .insert({ customer_id: customerId, shop_id: shop.id });

  if (checkinError && checkinError.code !== "23505") {
    return NextResponse.json({ error: "Failed to record checkin" }, { status: 500 });
  }

  // Total shops visited by this customer
  const { count, error: countError } = await db
    .from("passport_checkins")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", customerId);

  if (countError) {
    return NextResponse.json({ error: "Failed to count visits" }, { status: 500 });
  }

  return NextResponse.json({ success: true, shops_visited: count ?? 0 });
}
