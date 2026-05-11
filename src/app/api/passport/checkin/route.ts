import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST() {
  return NextResponse.json({ success: true, shops_visited: 0 });
}
