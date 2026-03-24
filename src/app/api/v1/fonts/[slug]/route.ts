import { NextRequest, NextResponse } from "next/server";
import { getFontBySlug } from "@/lib/search";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const font = await getFontBySlug(slug);
    if (!font) {
      return NextResponse.json({ error: "Font not found" }, { status: 404 });
    }
    return NextResponse.json({ font });
  } catch (err) {
    console.error("Font detail error:", err);
    return NextResponse.json({ error: "Failed to fetch font" }, { status: 500 });
  }
}
