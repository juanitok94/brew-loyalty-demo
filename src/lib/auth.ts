import { NextRequest } from "next/server";

export function verifyAdminToken(req: NextRequest): boolean {
  const expected = process.env.ODDS_ADMIN_TOKEN;
  if (!expected) return true; // no token configured — open demo mode
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;
  return header.slice(7) === expected;
}
