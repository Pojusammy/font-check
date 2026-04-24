import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";




export async function GET(req: NextRequest) {
  if (!req.headers.get("x-admin-id")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
  const from = (page - 1) * limit;

  let query = supabase
    .from("issue_reports")
    .select("*, font:fonts(id, font_name, slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data: issues, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ issues: issues ?? [], total: count ?? 0, page, limit });
}
