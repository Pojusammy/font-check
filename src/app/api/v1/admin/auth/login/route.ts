import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth";
import type { SessionData } from "@/lib/auth";

// In-memory brute-force protection: 5 attempts per IP per 15 min
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}

function clearLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const { allowed, retryAfterSec } = checkLoginRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${retryAfterSec} seconds.` },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSec) },
      }
    );
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (email.length > 254 || password.length > 256) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Always run bcrypt compare to prevent timing-based user enumeration
    const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
    const dummyHash = "$2b$12$invalidsaltinvalidsaltinvalidsa.invalidsaltinvalid";
    const hashToCompare = admin ? admin.password_hash : dummyHash;
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!admin || !valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Successful login — clear rate limit for this IP
    clearLoginAttempts(ip);

    const res = NextResponse.json({ success: true, email: admin.email, role: admin.role });
    const session = await getIronSession<SessionData>(req, res, sessionOptions);

    session.adminId = admin.id;
    session.adminEmail = admin.email;
    session.adminRole = admin.role;
    session.isLoggedIn = true;
    await session.save();

    return res;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
