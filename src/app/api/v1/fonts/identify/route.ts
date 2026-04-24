import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ─── Font name normalization ──────────────────────────────────────────────────

// Weight/style words to strip when extracting the base family
const WEIGHT_STYLE_WORDS = new Set([
  "thin", "hairline", "extralight", "ultralight", "light",
  "regular", "normal", "book", "roman",
  "medium", "semibold", "demibold", "bold", "extrabold", "ultrabold",
  "black", "heavy", "fat",
  "italic", "oblique", "slanted",
  "condensed", "compressed", "narrow", "extended", "expanded", "wide",
  "display", "text", "caption", "subhead", "headline", "poster",
  "variable", "vf",
]);

// Technical suffixes that are part of font naming but not the family identity
const TECH_SUFFIXES = new Set([
  "pro", "std", "lt", "mt", "ps", "of", "ltstd", "mtstd",
  "ce", "cyr", "cyrillic", "arabic", "hebrew", "thai",
  "sc", "osf", "lf", "tf",
]);

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Generate all plausible family name candidates from raw font metadata.
 * The goal: "HelveticaNeue-BoldItalic" → ["HelveticaNeue-BoldItalic", "HelveticaNeue", "Helvetica Neue", "Helvetica", ...]
 */
function generateCandidates(name: string, fullName?: string): string[] {
  const seen = new Set<string>();
  const results: string[] = [];

  function add(s: string) {
    const trimmed = s.trim();
    if (!trimmed) return;
    const key = normalize(trimmed);
    if (key && !seen.has(key)) {
      seen.add(key);
      results.push(trimmed);
    }
  }

  // Raw inputs first
  if (name) add(name);
  if (fullName) add(fullName);

  // Work with each raw input
  for (const raw of [name, fullName].filter(Boolean) as string[]) {
    let working = raw.replace(/\.(ttf|otf|woff2?)$/i, "").trim();

    // Split on hyphen — family part is before first hyphen (e.g. "HelveticaNeue-Bold" → "HelveticaNeue")
    const hyphenParts = working.split("-");
    if (hyphenParts.length > 1) {
      add(hyphenParts[0]);
      // Also try joining with space: "Helvetica-Neue" → "Helvetica Neue"
      add(hyphenParts.join(" "));
    }

    // Insert spaces at CamelCase boundaries: "HelveticaNeue" → "Helvetica Neue"
    const spaced = working
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
    add(spaced);

    // Also CamelCase-split the hyphen-split family part
    if (hyphenParts.length > 1) {
      const familySpaced = hyphenParts[0]
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
      add(familySpaced);
    }

    // Strip weight/style words from spaced versions
    for (const candidate of [...results]) {
      const words = candidate.split(/\s+/);
      if (words.length <= 1) continue;

      // Remove trailing weight/style words one at a time
      const stripped: string[] = [...words];
      while (stripped.length > 1) {
        const last = stripped[stripped.length - 1].toLowerCase();
        if (WEIGHT_STYLE_WORDS.has(last) || TECH_SUFFIXES.has(last)) {
          stripped.pop();
          add(stripped.join(" "));
        } else {
          break;
        }
      }
    }

    // Underscore splitting: "Helvetica_Neue" → "Helvetica Neue"
    if (working.includes("_")) {
      add(working.replace(/_/g, " "));
    }
  }

  return results;
}

// ─── DB search with multiple strategies ─────────────────────────────────────

interface FontRow {
  id: string;
  slug: string;
  font_name: string;
  vendor_name: string | null;
  personal_use_status: string;
  commercial_use_status: string;
  confidence_level: string | null;
  simplified_summary: string | null;
  official_source_url: string | null;
  official_license_url: string | null;
  purchase_url: string | null;
  normalized_name: string | null;
}

const FONT_SELECT =
  "id, slug, font_name, vendor_name, personal_use_status, commercial_use_status, " +
  "confidence_level, simplified_summary, official_source_url, official_license_url, purchase_url, normalized_name";

async function searchDB(candidates: string[]): Promise<FontRow | null> {
  // Strategy 1: Exact normalized match (most reliable)
  for (const candidate of candidates) {
    const norm = normalize(candidate);
    if (!norm) continue;

    const { data } = await supabase
      .from("fonts")
      .select(FONT_SELECT)
      .eq("is_active", true)
      .eq("normalized_name", norm)
      .limit(1);

    if (data && data.length > 0) return data[0] as unknown as FontRow;
  }

  // Strategy 2: Exact font_name or family_name match (case-insensitive)
  for (const candidate of candidates) {
    if (!candidate.trim()) continue;

    const { data } = await supabase
      .from("fonts")
      .select(FONT_SELECT)
      .eq("is_active", true)
      .or(`font_name.ilike.${candidate},family_name.ilike.${candidate}`)
      .limit(1);

    if (data && data.length > 0) return data[0] as unknown as FontRow;
  }

  // Strategy 3: Contains match on normalized_name (handles partial matches)
  for (const candidate of candidates) {
    const norm = normalize(candidate);
    if (!norm || norm.length < 3) continue;

    const { data } = await supabase
      .from("fonts")
      .select(FONT_SELECT)
      .eq("is_active", true)
      .ilike("normalized_name", `%${norm}%`)
      .order("font_name")
      .limit(5);

    if (data && data.length > 0) {
      // Prefer exact-length match, then shortest (most specific) match
      const exact = (data as unknown as FontRow[]).find(
        (f) => normalize(f.font_name) === norm
      );
      if (exact) return exact;

      // If candidate normalized name contains the DB entry's normalized name, prefer that
      const contains = (data as unknown as FontRow[]).find(
        (f) => norm.startsWith(normalize(f.font_name))
      );
      if (contains) return contains;

      return data[0] as unknown as FontRow;
    }
  }

  // Strategy 4: Reverse contains — DB font name contains our candidate
  for (const candidate of candidates) {
    const norm = normalize(candidate);
    if (!norm || norm.length < 4) continue;

    const { data } = await supabase
      .from("fonts")
      .select(FONT_SELECT)
      .eq("is_active", true)
      .ilike("font_name", `%${candidate}%`)
      .order("font_name")
      .limit(3);

    if (data && data.length > 0) return data[0] as unknown as FontRow;
  }

  // Strategy 5: Check aliases table
  for (const candidate of candidates) {
    const norm = normalize(candidate);
    if (!norm) continue;

    const { data: aliasData } = await supabase
      .from("font_aliases")
      .select("font_id, normalized_alias_name")
      .eq("normalized_alias_name", norm)
      .limit(1);

    if (aliasData && aliasData.length > 0) {
      const { data: fontData } = await supabase
        .from("fonts")
        .select(FONT_SELECT)
        .eq("id", (aliasData[0] as unknown as { font_id: string }).font_id)
        .eq("is_active", true)
        .single();
      if (fontData) return fontData as unknown as FontRow;
    }

    // Also try partial alias match
    const { data: aliasPartial } = await supabase
      .from("font_aliases")
      .select("font_id, normalized_alias_name")
      .ilike("normalized_alias_name", `%${norm}%`)
      .limit(1);

    if (aliasPartial && aliasPartial.length > 0) {
      const { data: fontData } = await supabase
        .from("fonts")
        .select(FONT_SELECT)
        .eq("id", (aliasPartial[0] as unknown as { font_id: string }).font_id)
        .eq("is_active", true)
        .single();
      if (fontData) return fontData as unknown as FontRow;
    }
  }

  return null;
}

// ─── Google Fonts check ───────────────────────────────────────────────────────

async function checkGoogleFonts(candidates: string[]): Promise<{
  found: boolean;
  family?: string;
  license?: string;
  url?: string;
} | null> {
  const apiKey = process.env.GOOGLE_FONTS_API_KEY;
  if (!apiKey) return null;

  for (const name of candidates) {
    if (!name.trim()) continue;
    try {
      const res = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&family=${encodeURIComponent(name)}`,
        { next: { revalidate: 86400 } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        return {
          found: true,
          family: item.family,
          license: item.license || "OFL",
          url: `https://fonts.google.com/specimen/${encodeURIComponent(item.family.replace(/\s+/g, "+"))}`,
        };
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

// ─── AI identification via Gemini ─────────────────────────────────────────────

async function identifyWithAI(meta: {
  name: string;
  fullName: string;
  foundry?: string;
  candidates: string[];
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a typography and font licensing expert with comprehensive knowledge of fonts, foundries, and their licenses.

A user uploaded a font file with this metadata extracted from the file:
- Family name: "${meta.name}"
- Full name: "${meta.fullName}"
- Manufacturer/Foundry: "${meta.foundry || "unknown"}"
- Name candidates we tried: ${JSON.stringify(meta.candidates.slice(0, 6))}

Tasks:
1. Identify the canonical font name (e.g., "HelveticaNeue-Bold" → "Helvetica Neue")
2. Identify the correct manufacturer/foundry
3. Determine the license status based on your knowledge
4. Provide official source URLs where known

Return ONLY a valid JSON object with NO additional text:
{
  "canonical_name": "string — the proper font family name",
  "vendor_name": "string — manufacturer or foundry",
  "personal_use_status": "allowed | paid_license_required | limited | unknown",
  "commercial_use_status": "allowed | paid_license_required | limited | unknown",
  "official_source_url": "string | null",
  "official_license_url": "string | null",
  "purchase_url": "string | null",
  "summary": "string — 1-2 sentence plain English license summary",
  "confidence": "high | medium | low",
  "is_google_font": true | false,
  "notes": "string | null — any useful context (e.g., system font, bundled, OFL)"
}`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("AI identification error:", err);
    return null;
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, fullName, foundry } = body as {
      name: string;
      fullName: string;
      foundry?: string;
      version?: string;
    };

    if (!name?.trim()) {
      return NextResponse.json({ error: "Font name required" }, { status: 400 });
    }

    // Generate smart candidate names
    const candidates = generateCandidates(name, fullName);

    // ── Step 1: Search internal DB ────────────────────────────────────────────
    const dbResult = await searchDB(candidates);

    if (dbResult) {
      return NextResponse.json({
        source: "db",
        confidence: dbResult.confidence_level || "high",
        matched_name: dbResult.font_name,
        font_name: dbResult.font_name,
        vendor_name: dbResult.vendor_name,
        personal_use_status: dbResult.personal_use_status,
        commercial_use_status: dbResult.commercial_use_status,
        summary: dbResult.simplified_summary,
        official_source_url: dbResult.official_source_url,
        official_license_url: dbResult.official_license_url,
        purchase_url: dbResult.purchase_url,
        slug: dbResult.slug,
      });
    }

    // ── Step 2: Check Google Fonts API ────────────────────────────────────────
    const gfResult = await checkGoogleFonts(candidates);
    if (gfResult?.found) {
      const gfFamily = gfResult.family!;
      // Try a final DB lookup by the exact Google Fonts family name to get slug
      const gfCandidates = generateCandidates(gfFamily);
      const gfDbMatch = await searchDB(gfCandidates);
      return NextResponse.json({
        source: gfDbMatch ? "db" : "google-fonts",
        confidence: "high",
        matched_name: gfFamily,
        font_name: gfDbMatch?.font_name ?? gfFamily,
        vendor_name: gfDbMatch?.vendor_name ?? "Google Fonts",
        personal_use_status: gfDbMatch?.personal_use_status ?? "allowed",
        commercial_use_status: gfDbMatch?.commercial_use_status ?? "allowed",
        summary: gfDbMatch?.simplified_summary ??
          `${gfFamily} is available on Google Fonts under the ${gfResult.license || "Open Font License"}, free for personal and commercial use.`,
        official_source_url: gfDbMatch?.official_source_url ?? gfResult.url,
        official_license_url: gfDbMatch?.official_license_url ?? "https://scripts.sil.org/OFL",
        purchase_url: gfDbMatch?.purchase_url ?? null,
        slug: gfDbMatch?.slug ?? slugify(gfFamily),
      });
    }

    // ── Step 3: AI identification ─────────────────────────────────────────────
    const aiResult = await identifyWithAI({
      name,
      fullName: fullName || name,
      foundry,
      candidates,
    });

    if (aiResult) {
      // After AI identifies canonical name, try DB one more time with it
      if (aiResult.canonical_name) {
        const aiCandidates = generateCandidates(aiResult.canonical_name);
        const dbRetry = await searchDB(aiCandidates);
        if (dbRetry) {
          return NextResponse.json({
            source: "db",
            confidence: dbRetry.confidence_level || "high",
            matched_name: dbRetry.font_name,
            font_name: dbRetry.font_name,
            vendor_name: dbRetry.vendor_name,
            personal_use_status: dbRetry.personal_use_status,
            commercial_use_status: dbRetry.commercial_use_status,
            summary: dbRetry.simplified_summary,
            official_source_url: dbRetry.official_source_url,
            official_license_url: dbRetry.official_license_url,
            purchase_url: dbRetry.purchase_url,
            slug: dbRetry.slug,
            ai_note: `Identified as "${aiResult.canonical_name}" by AI`,
          });
        }
      }

      const aiName = aiResult.canonical_name || name;
      return NextResponse.json({
        source: "ai",
        confidence: aiResult.confidence || "medium",
        matched_name: aiResult.canonical_name || candidates[0],
        font_name: aiName,
        vendor_name: aiResult.vendor_name,
        personal_use_status: aiResult.personal_use_status || "unknown",
        commercial_use_status: aiResult.commercial_use_status || "unknown",
        summary: aiResult.summary,
        official_source_url: aiResult.official_source_url,
        official_license_url: aiResult.official_license_url,
        purchase_url: aiResult.purchase_url,
        is_google_font: aiResult.is_google_font,
        ai_note: aiResult.notes,
        slug: slugify(aiName),
      });
    }

    // ── Fallback: not found ───────────────────────────────────────────────────
    return NextResponse.json({
      source: "none",
      matched_name: candidates[0] || name,
      font_name: candidates[0] || name,
      vendor_name: foundry || null,
    });
  } catch (err) {
    console.error("Identify error:", err);
    return NextResponse.json({ error: "Identification failed" }, { status: 500 });
  }
}
