import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getFontBySlug } from "@/lib/search";
import FontResultCard from "@/components/FontResultCard";
import SearchBar from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const font = await getFontBySlug(slug);
  if (!font) return { title: "Font Not Found" };
  return {
    title: `${font.font_name} License`,
    description:
      font.simplified_summary ||
      `Is ${font.font_name} free to use? Check the license status.`,
  };
}

export default async function FontDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const font = await getFontBySlug(slug);
  if (!font) notFound();

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
            <ThemeToggle />
            <Link href="/report" className="text-sm bg-[#1a1714] dark:bg-[#f0ece4] text-white dark:text-[#111009] px-4 py-1.5 rounded-full font-medium hover:bg-[#2e2825] dark:hover:bg-[#e4ddd2] transition-colors ml-1">
              Report issue
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-10 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <div className="mb-7">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[#a8a09a] dark:text-[#5a5048] hover:text-[#4a4540] dark:hover:text-[#c8bcaa] transition-colors uppercase tracking-widest"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to search
            </Link>
          </div>

          {/* Search bar */}
          <div className="mb-8">
            <SearchBar placeholder="Search another font…" />
          </div>

          {/* Result card */}
          <FontResultCard font={font} variant="full" />

          {/* Aliases */}
          {font.aliases && font.aliases.length > 0 && (
            <div
              className="mt-4 rounded-2xl px-6 py-5 bg-white dark:bg-[#1a1814] border border-[#e5e1da] dark:border-[#2e2924]"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <p className="text-xs text-[#a8a09a] dark:text-[#5a5048] uppercase tracking-[0.15em] mb-3">
                Also known as
              </p>
              <div className="flex flex-wrap gap-2">
                {font.aliases.map((alias: { id: string; alias_name: string }) => (
                  <span
                    key={alias.id}
                    className="text-xs px-3 py-1 rounded-full font-display text-[#7a7268] dark:text-[#8a7e6e] bg-[#f5f4f1] dark:bg-[#201e18] border border-[#e5e1da] dark:border-[#2e2924]"
                  >
                    {alias.alias_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-10 text-xs text-[#a8a09a] dark:text-[#5a5048] text-center leading-relaxed">
            General guidance only — not legal advice. Verify licensing directly with the
            font publisher before commercial use.{" "}
            <Link href="/about" className="text-[#7a7268] dark:text-[#8a7e6e] hover:text-[#1a1714] dark:hover:text-[#f0ece4] underline underline-offset-2 transition-colors">
              Learn more
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#e5e1da] dark:border-[#2e2924] py-8 px-6 bg-white dark:bg-[#1a1814]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-sm text-[#a8a09a] dark:text-[#5a5048]">
            Font<span className="text-[#d4a853]">.</span>Check
          </p>
          <div className="flex items-center gap-7 text-xs text-[#a8a09a] dark:text-[#5a5048]">
            <Link href="/about" className="hover:text-[#4a4540] dark:hover:text-[#c8bcaa] transition-colors">About</Link>
            <Link href="/report" className="hover:text-[#4a4540] dark:hover:text-[#c8bcaa] transition-colors">Report issue</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
