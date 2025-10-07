import { NextResponse, NextRequest } from "next/server";

// TODO: add more rules here in the future and also remove when going live??
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";

  // Block indexing if running on vercel.app
  if (host.endsWith(".vercel.app")) {
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  return NextResponse.next();
}
