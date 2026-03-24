import { supabase } from "./supabase";

const MAX_QUERY_LENGTH = 100;
const SLUG_PATTERN = /^[a-z0-9-]+$/;

export async function searchFonts(query: string, limit = 10) {
  if (!query || query.trim().length === 0) return [];

  const q = query.trim().slice(0, MAX_QUERY_LENGTH);
  const normalized = q.toLowerCase().replace(/[^a-z0-9]/g, "");

  const { data, error } = await supabase
    .from("fonts")
    .select("id, slug, font_name, vendor_name, personal_use_status, commercial_use_status, confidence_level")
    .eq("is_active", true)
    .or(
      `font_name.ilike.%${q}%,normalized_name.ilike.%${normalized}%,family_name.ilike.%${q}%`
    )
    .order("font_name")
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getFontBySlug(slug: string) {
  if (!slug || !SLUG_PATTERN.test(slug) || slug.length > 120) {
    return null;
  }

  const { data, error } = await supabase
    .from("fonts")
    .select("*, aliases:font_aliases(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data;
}
