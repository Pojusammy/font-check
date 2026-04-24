import { SignJWT, jwtVerify } from "jose";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "fc-admin";

function getJwtSecret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be ≥ 32 chars");
  return new TextEncoder().encode(s);
}

export interface SessionData {
  adminId: string;
  adminEmail: string;
  adminRole: string;
  isLoggedIn: true;
}

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/** Create a signed JWT and attach it as a cookie to the given response. */
export async function setSessionCookie(
  res: NextResponse,
  payload: Omit<SessionData, "isLoggedIn">
): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());

  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

/** Verify a JWT token string. Returns null on failure. */
export async function verifyToken(token: string): Promise<Omit<SessionData, "isLoggedIn"> | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const { adminId, adminEmail, adminRole } = payload as Record<string, string>;
    if (!adminId) return null;
    return { adminId, adminEmail: adminEmail ?? "", adminRole: adminRole ?? "admin" };
  } catch {
    return null;
  }
}

/** Clear the session cookie (logout). */
export function clearSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}

export { COOKIE_NAME };

/**
 * Used in server components/pages. Reads x-admin-id injected by middleware.
 * If the header is present, the user is authenticated (middleware already verified the JWT).
 */
export async function requireAdminSession(): Promise<SessionData | null> {
  try {
    const h = await headers();
    const adminId = h.get("x-admin-id");
    if (!adminId) return null;
    return {
      isLoggedIn: true,
      adminId,
      adminEmail: h.get("x-admin-email") ?? "",
      adminRole: h.get("x-admin-role") ?? "admin",
    };
  } catch {
    return null;
  }
}

// Keep these for any API routes that still use them
export const sessionOptions = {};
export async function getSession() { return null; }
export async function getSessionFromRequest(_req: NextRequest) { return null; }
