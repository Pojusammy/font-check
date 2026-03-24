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

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.isLoggedIn || !session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newStatus = body.status || "resolved";

    const validStatuses = ["open", "reviewed", "resolved", "dismissed"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const issue = await prisma.issueReport.update({
      where: { id },
      data: { status: newStatus },
    });

    return NextResponse.json({ issue });
  } catch (err) {
    console.error("Resolve issue error:", err);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}
