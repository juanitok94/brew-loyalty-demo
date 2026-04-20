import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.ODDS_ADMIN_TOKEN;
  return NextResponse.json({
    tokenSet: Boolean(token),
    tokenLength: token?.length ?? 0,
    tokenFirst4: token ? token.slice(0, 4) : null,
  });
}
