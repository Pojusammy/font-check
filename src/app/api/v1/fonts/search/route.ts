import { NextRequest, NextResponse } from "next/server";
import { searchFonts } from "@/lib/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "5", 10), 20);

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchFonts(q, limit);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
