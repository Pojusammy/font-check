import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/auth";

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "font-checker-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8,
  },
};

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true });
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.destroy();
  return res;
}
