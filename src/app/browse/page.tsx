import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import BrowseClient from "./BrowseClient";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Browse All Fonts — Font.Check",
  description: "Browse 1,000+ fonts and filter by category or licensing status.",
};

async function getFontCount(): Promise<number> {
  try {
    const { count } = await supabase
      .from("fonts")
      .select("*", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}

export default async function BrowsePage() {
  const fontCount = await getFontCount();

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f4f1]">

      {/* ── Nav ─────────────────────────────────────── */}
      <SiteHeader />

      <main className="flex-1">

        {/* ── Page header ─────────────────────────────── */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-6 py-10">
            <h1 className="font-display text-3xl sm:text-[2.5rem] text-[#1a1714] leading-tight mb-2">
              Browse all fonts
            </h1>
            <p className="text-sm text-[#7a7268]">
              {fontCount.toLocaleString()} fonts tracked — filter by category or licensing
            </p>
          </div>
        </div>

        <BrowseClient />
      </main>

      {/* ── Footer ──────────────────────────────────── */}
      <footer className="border-t border-[#e5e1da] py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-sm text-[#a8a09a]">
            Font<span className="text-[#d4a853]">.</span>Check
          </p>
          <div className="flex items-center gap-7 text-xs text-[#a8a09a]">
            <Link href="/" className="hover:text-[#4a4540] transition-colors">Search</Link>
            <Link href="/about" className="hover:text-[#4a4540] transition-colors">About</Link>
            <Link href="/report" className="hover:text-[#4a4540] transition-colors">Report issue</Link>
            <Link href="/admin/login" className="hover:text-[#4a4540] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
