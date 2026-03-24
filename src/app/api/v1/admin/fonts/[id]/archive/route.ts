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
    const font = await prisma.font.findUnique({ where: { id } });
    if (!font) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.font.update({
      where: { id },
      data: { is_active: !font.is_active },
    });

    await prisma.auditLog.create({
      data: {
        actor_id: session.adminId,
        entity_type: "font",
        entity_id: id,
        action: updated.is_active ? "restore" : "archive",
        before_snapshot: font as unknown as object,
        after_snapshot: updated as unknown as object,
      },
    });

    return NextResponse.json({ font: updated });
  } catch (err) {
    console.error("Toggle archive error:", err);
    return NextResponse.json({ error: "Failed to toggle archive status" }, { status: 500 });
  }
}
