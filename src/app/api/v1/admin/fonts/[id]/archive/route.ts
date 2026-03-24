import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth";
import type { SessionData } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.isLoggedIn || !session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
      actor_id: session.adminId,
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
