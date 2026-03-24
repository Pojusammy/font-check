import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth";
import type { SessionData } from "@/lib/auth";

async function requireAdmin(req: NextRequest, res: NextResponse) {
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.isLoggedIn || !session.adminId) return null;
  return session;
}

export async function GET(req: NextRequest) {
  const res = new NextResponse();
  const session = await requireAdmin(req, res);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
  const q = searchParams.get("q") || "";
  const from = (page - 1) * limit;

  let query = supabase
    .from("fonts")
    .select("*, aliases:font_aliases(*)", { count: "exact" })
    .order("font_name")
    .range(from, from + limit - 1);

  if (q) {
    query = query.or(`font_name.ilike.%${q}%,vendor_name.ilike.%${q}%`);
  }

  const { data: fonts, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ fonts: fonts ?? [], total: count ?? 0, page, limit });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function POST(req: NextRequest) {
  const res = new NextResponse();
  const session = await requireAdmin(req, res);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
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
    } = body;

    if (!font_name) {
      return NextResponse.json({ error: "font_name is required" }, { status: 400 });
    }

    const slug = slugify(font_name);
    const normalized_name = normalize(font_name);

    const { data: font, error } = await supabase
      .from("fonts")
      .insert({
        slug,
        font_name,
        normalized_name,
        family_name,
        vendor_name,
        source_type,
        official_source_url,
        official_license_url,
        purchase_url,
        personal_use_status: personal_use_status || "unknown",
        commercial_use_status: commercial_use_status || "unknown",
        simplified_summary,
        internal_notes,
        confidence_level: confidence_level || "medium",
        last_verified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Log audit
    await supabase.from("audit_logs").insert({
      actor_id: session.adminId,
      entity_type: "font",
      entity_id: font.id,
      action: "create",
      after_snapshot: font,
    });

    return NextResponse.json({ font }, { status: 201 });
  } catch (err) {
    console.error("Create font error:", err);
    return NextResponse.json({ error: "Failed to create font" }, { status: 500 });
  }
}
