import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("fonts")
    .select(
      "id, slug, font_name, vendor_name, source_type, family_name, personal_use_status, commercial_use_status, confidence_level, simplified_summary"
    )
    .eq("is_active", true)
    .order("font_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ fonts: data ?? [] });
}
