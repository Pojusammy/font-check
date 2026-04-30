import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getFontBySlug } from "@/lib/search";
import FontResultCard from "@/components/FontResultCard";
import SearchBar from "@/components/SearchBar";
import SiteHeader from "@/components/SiteHeader";
import BackButton from "@/components/BackButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const font = await getFontBySlug(slug);
  if (!font) return { title: "Font Not Found" };
  return {
    title: `${font.font_name} License`,
    description: font.simplified_summary || `Is ${font.font_name} free to use? Check the license status.`,
  };
}

export default async function FontDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const font = await getFontBySlug(slug);
  if (!font) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f1]">

      <SiteHeader />

      <main className="flex-1 py-10 px-6">
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <div className="mb-7">
            <BackButton />
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
              className="mt-4 rounded-2xl px-6 py-5 bg-white border border-[#e5e1da]"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <p className="text-xs text-[#a8a09a] uppercase tracking-[0.15em] mb-3">Also known as</p>
              <div className="flex flex-wrap gap-2">
                {font.aliases.map((alias: { id: string; alias_name: string }) => (
                  <span
                    key={alias.id}
                    className="text-xs px-3 py-1 rounded-full font-display text-[#7a7268] bg-[#f5f4f1] border border-[#e5e1da]"
                  >
                    {alias.alias_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-10 text-xs text-[#a8a09a] text-center leading-relaxed">
            General guidance only — not legal advice. Verify licensing directly with the font publisher before commercial use.{" "}
            <Link href="/about" className="text-[#7a7268] hover:text-[#1a1714] underline underline-offset-2 transition-colors">
              Learn more
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#e5e1da] py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-sm text-[#a8a09a]">Font<span className="text-[#d4a853]">.</span>Check</p>
          <div className="flex items-center gap-7 text-xs text-[#a8a09a]">
            <Link href="/about" className="hover:text-[#4a4540] transition-colors">About</Link>
            <Link href="/report" className="hover:text-[#4a4540] transition-colors">Report issue</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
