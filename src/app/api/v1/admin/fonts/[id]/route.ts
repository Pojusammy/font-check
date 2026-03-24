import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

  const { data: font, error } = await supabase
    .from("fonts")
    .select("*, aliases:font_aliases(*)")
    .eq("id", id)
    .single();

  if (error || !font) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ font });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAdmin(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();

    const { data: before, error: fetchError } = await supabase
      .from("fonts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !before) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
      last_verified_at: new Date().toISOString(),
    };

    if (font_name && font_name !== before.font_name) {
      updateData.font_name = font_name;
      updateData.normalized_name = font_name.toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    const { data: font, error } = await supabase
      .from("fonts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await supabase.from("audit_logs").insert({
      actor_id: session.adminId,
      entity_type: "font",
      entity_id: font.id,
      action: "update",
      before_snapshot: before,
      after_snapshot: font,
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
    const { data: font, error: fetchError } = await supabase
      .from("fonts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !font) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Soft delete
    const { error } = await supabase
      .from("fonts")
      .update({ is_active: false })
      .eq("id", id);

    if (error) throw new Error(error.message);

    await supabase.from("audit_logs").insert({
      actor_id: session.adminId,
      entity_type: "font",
      entity_id: id,
      action: "archive",
      before_snapshot: font,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Archive font error:", err);
    return NextResponse.json({ error: "Failed to archive font" }, { status: 500 });
  }
}
