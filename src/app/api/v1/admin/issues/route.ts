import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import type { SessionData } from "@/lib/auth";

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "font-checker-admin-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
  },
};

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.isLoggedIn || !session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);

  const where = status ? { status: status as "open" | "reviewed" | "resolved" | "dismissed" } : {};

  const [issues, total] = await Promise.all([
    prisma.issueReport.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        font: { select: { id: true, font_name: true, slug: true } },
      },
    }),
    prisma.issueReport.count({ where }),
  ]);

  return NextResponse.json({ issues, total, page, limit });
}
