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
    maxAge: 0,
  },
};

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url));
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  session.destroy();
  return res;
}
