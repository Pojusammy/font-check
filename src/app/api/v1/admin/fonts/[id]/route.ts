import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth";
import type { SessionData } from "@/lib/auth";

async function requireAdmin(req: NextRequest) {
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.isLoggedIn || !session.adminId) return null;
  return session;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const font = await prisma.font.findUnique({
    where: { id },
    include: { aliases: true },
  });

  if (!font) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ font });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const before = await prisma.font.findUnique({ where: { id } });
    if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const {
      font_name,
      family_name,
      vendor_name,
      source_type,
      official_source_url,
      official_license_url,
      purchase_url,
      personal_use_status,
      commercial_use_status,
      simplified_summary,
      internal_notes,
      confidence_level,
      is_active,
    } = body;

    const updateData: Record<string, unknown> = {
      family_name,
      vendor_name,
      source_type,
      official_source_url,
      official_license_url,
      purchase_url,
      personal_use_status,
      commercial_use_status,
      simplified_summary,
      internal_notes,
      confidence_level,
      is_active,
      last_verified_at: new Date(),
    };

    if (font_name && font_name !== before.font_name) {
      updateData.font_name = font_name;
      updateData.normalized_name = font_name.toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    const font = await prisma.font.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        actor_id: session.adminId!,
        entity_type: "font",
        entity_id: font.id,
        action: "update",
        before_snapshot: before as unknown as object,
        after_snapshot: font as unknown as object,
      },
    });

    return NextResponse.json({ font });
  } catch (err) {
    console.error("Update font error:", err);
    return NextResponse.json({ error: "Failed to update font" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const font = await prisma.font.findUnique({ where: { id } });
    if (!font) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Soft delete
    await prisma.font.update({
      where: { id },
      data: { is_active: false },
    });

    await prisma.auditLog.create({
      data: {
        actor_id: session.adminId!,
        entity_type: "font",
        entity_id: id,
        action: "archive",
        before_snapshot: font as unknown as object,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Archive font error:", err);
    return NextResponse.json({ error: "Failed to archive font" }, { status: 500 });
  }
}
