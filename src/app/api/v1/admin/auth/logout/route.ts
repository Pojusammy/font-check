import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth";
import type { SessionData } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const res = NextResponse.json({ success: true });
    const session = await getIronSession<SessionData>(req, res, sessionOptions);
    await session.destroy();
    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
