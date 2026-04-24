import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";




export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!req.headers.get("x-admin-id")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


  try {
    const { data: font, error: fetchError } = await supabase
      .from("fonts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !font) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: updated, error } = await supabase
      .from("fonts")
      .update({ is_active: !font.is_active })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    await supabase.from("audit_logs").insert({
      id: randomUUID(),
      actor_id: req.headers.get("x-admin-id") ?? "unknown",
      created_at: new Date().toISOString(),
      entity_type: "font",
      entity_id: id,
      action: updated.is_active ? "restore" : "archive",
      before_snapshot: font,
      after_snapshot: updated,
    });

    return NextResponse.json({ font: updated });
  } catch (err) {
    console.error("Toggle archive error:", err);
    return NextResponse.json({ error: "Failed to toggle archive status" }, { status: 500 });
  }
}
