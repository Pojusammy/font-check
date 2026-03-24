import Link from "next/link";
import type { Metadata } from "next";
import { searchFonts } from "@/lib/search";
import { supabase } from "@/lib/supabase";
import SearchBar from "@/components/SearchBar";
import FontResultCard from "@/components/FontResultCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FontWithAliases = any;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q = "" } = await searchParams;
  return {
    title: q ? `"${q}" font license` : "Search fonts",
    description: `License information for fonts matching "${q}"`,
  };
}

async function getSearchResults(q: string): Promise<FontWithAliases[]> {
  if (!q.trim()) return [];
  const results = await searchFonts(q, 20);
  if (results.length === 0) return [];

  const ids = results.map((r) => r.id);
  const { data, error } = await supabase
    .from("fonts")
    .select("*, aliases:font_aliases(*)")
    .in("id", ids)
    .eq("is_active", true)
    .order("font_name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const results = await getSearchResults(q);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f1] dark:bg-[#111009]">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#1a1814]/90 backdrop-blur-md border-b border-[#e5e1da] dark:border-[#2e2924]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-[#1a1714] dark:text-[#f0ece4] font-semibold text-base tracking-tight">
            Font<span className="text-[#d4a853]">.</span>Check
          </Link>
          <nav className="flex items-center gap-1">
            <Link href="/about" className="text-sm text-[#7a7268] dark:text-[#8a7e6e] hover:text-[#1a1714] dark:hover:text-[#f0ece4] px-3 py-1.5 rounded-lg transition-colors">
              About
            </Link>
            <Link href="/report" className="text-sm bg-[#1a1714] dark:bg-[#f0ece4] text-white dark:text-[#111009] px-4 py-1.5 rounded-full font-medium hover:bg-[#2e2825] dark:hover:bg-[#e4ddd2] transition-colors ml-1">
              Report issue
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-10 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Search bar */}
          <div className="mb-8">
            <SearchBar defaultValue={q} autoFocus placeholder="Search a font name…" />
          </div>

          {/* Results */}
          {q ? (
            <div>
              <p className="text-xs text-[#a8a09a] dark:text-[#5a5048] uppercase tracking-[0.15em] mb-5">
                {results.length === 0
                  ? `No results for "${q}"`
                  : `${results.length} result${results.length !== 1 ? "s" : ""} for "${q}"`}
              </p>

              {results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((font) => (
                    <FontResultCard key={font.id} font={font} variant="compact" />
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-2xl p-12 text-center bg-white dark:bg-[#1a1814] border border-[#e5e1da] dark:border-[#2e2924]"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                >
                  <p className="font-display text-4xl text-[#d4cec5] dark:text-[#3d3930] mb-5">?</p>
                  <h3 className="font-semibold text-[#1a1714] dark:text-[#f0ece4] mb-2 text-sm">Font not found</h3>
                  <p className="text-sm text-[#7a7268] dark:text-[#8a7e6e] mb-6 max-w-xs mx-auto">
                    We don&apos;t have license data for &quot;{q}&quot; yet. You can
                    request it be added.
                  </p>
                  <Link
                    href={`/report?search_query=${encodeURIComponent(q)}&issue_type=missing_font`}
                    className="btn-primary"
                  >
                    Request this font
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm text-[#a8a09a] dark:text-[#5a5048]">Enter a font name above to search.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-[#e5e1da] dark:border-[#2e2924] py-8 px-6 mt-auto bg-white dark:bg-[#1a1814]">
        <div className="max-w-6xl mx-auto text-xs text-[#a8a09a] dark:text-[#5a5048] text-center">
          Font License Checker — general guidance only, not legal advice
        </div>
      </footer>
    </div>
  );
}
