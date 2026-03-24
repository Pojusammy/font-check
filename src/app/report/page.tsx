import Link from "next/link";
import type { Metadata } from "next";
import ReportIssueForm from "@/components/ReportIssueForm";
import NavLogo from "@/components/NavLogo";

export const metadata: Metadata = {
  title: "Report an Issue",
  description:
    "Help us improve font license accuracy by reporting incorrect or outdated information.",
};

interface PageProps {
  searchParams: Promise<{
    font_id?: string;
    font_name?: string;
    search_query?: string;
    issue_type?: string;
  }>;
}

export default async function ReportPage({ searchParams }: PageProps) {
  const { font_id, font_name, search_query } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e5e1da]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <NavLogo />
          <nav className="flex items-center gap-2">
            <Link href="/about" className="text-sm text-[#7a7268] hover:text-[#1a1714] px-3 py-1.5 rounded-lg transition-colors">
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-lg mx-auto">
          {/* Back */}
          <Link
            href={font_id && font_name ? `/font/${font_id}` : "/"}
            className="inline-flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go back
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">Report an issue</h1>
            <p className="text-[#6b6b6b]">
              Help us keep this information accurate. If you spot incorrect licensing info, a
              broken link, or a missing font, let us know.
            </p>
          </div>

          <ReportIssueForm
            fontId={font_id}
            fontName={font_name ? decodeURIComponent(font_name) : undefined}
            searchQuery={search_query}
          />

          <p className="text-xs text-[#9b9b9b] text-center mt-6">
            Reports are reviewed manually. We do not guarantee a response but read every
            submission.
          </p>
        </div>
      </main>

      <footer className="border-t border-[#e5e5e3] py-6 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-xs text-[#9b9b9b] text-center">
          Font License Checker — general guidance only, not legal advice
        </div>
      </footer>
    </div>
  );
}
