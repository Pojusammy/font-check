import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.font.count();
    return NextResponse.json({ ok: true, count, db_url_set: !!process.env.DATABASE_URL, db_url_prefix: process.env.DATABASE_URL?.slice(0, 30) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message, db_url_set: !!process.env.DATABASE_URL, db_url_prefix: process.env.DATABASE_URL?.slice(0, 30) }, { status: 500 });
  }
}
