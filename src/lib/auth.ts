import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface SessionData {
  adminId?: string;
  adminEmail?: string;
  adminRole?: string;
  isLoggedIn: boolean;
}

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "font-checker-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function getSessionFromRequest(req: NextRequest) {
  const session = await getIronSession<SessionData>(req, new NextResponse(), sessionOptions);
  return session;
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.adminId) {
    return null;
  }
  return session;
}
