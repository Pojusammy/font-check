import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
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
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

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
