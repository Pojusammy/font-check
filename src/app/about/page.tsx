import Link from "next/link";
import type { Metadata } from "next";
import NavLogo from "@/components/NavLogo";

export const metadata: Metadata = {
  title: "About",
  description: "About Font License Checker — how it works, what it covers, and its limitations.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e5e1da]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <NavLogo />
          <nav className="flex items-center gap-2">
            <Link href="/report" className="text-sm bg-[#1a1714] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#2e2825] transition-colors">
              Report issue
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto prose-custom">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-8"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to search
          </Link>

          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">About</h1>
          <p className="text-[#6b6b6b] text-lg mb-10">
            What this tool is, how it works, and its limitations.
          </p>

          <div className="space-y-8">
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">What is this?</h2>
              <p className="text-[#6b6b6b] leading-relaxed">
                Font License Checker is a reference tool that helps designers, developers, and
                writers quickly understand whether a font they want to use requires a paid license,
                is free for all uses, or has usage restrictions.
              </p>
              <p className="text-[#6b6b6b] leading-relaxed mt-3">
                Font licensing can be confusing. OFL, Apache 2.0, proprietary foundry licenses —
                the jargon adds up. This tool translates it into plain language.
              </p>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">How it works</h2>
              <div className="space-y-3 text-[#6b6b6b] leading-relaxed">
                <p>
                  Each font in our database has been manually researched from official sources —
                  the type foundry&apos;s website, the font&apos;s license file, or official distribution
                  platforms.
                </p>
                <p>
                  We classify each font with a personal use status and commercial use status, each
                  being one of: <em>Allowed</em>, <em>Paid license required</em>, <em>Limited</em>,{" "}
                  <em>Not allowed</em>, or <em>Unknown</em>.
                </p>
                <p>
                  We also track a confidence level (High, Medium, or Low) indicating how sure we
                  are about the classification, and link to the official source whenever possible.
                </p>
              </div>
            </section>

            <section className="rounded-xl p-6" style={{ background: "#FFF1CC", border: "1px solid #FED770" }}>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">
                Important disclaimer
              </h2>
              <div className="space-y-3 text-[#6b6b6b] leading-relaxed">
                <p className="font-medium text-[#333]">
                  This tool provides general guidance only. It is not legal advice.
                </p>
                <p>
                  Font licensing rules can be complex, vary by use case, and change over time.
                  The information here may be incomplete, simplified, or out of date.
                </p>
                <p>
                  <strong className="text-[#1a1a1a]">Always verify</strong>{" "}licensing directly
                  with the font&apos;s official publisher before using a font commercially, in client
                  work, in a product, or in any situation where licensing matters.
                </p>
                <p>
                  We take no responsibility for decisions made based on information from this tool.
                </p>
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Status definitions</h2>
              <div className="space-y-3">
                {[
                  {
                    status: "Allowed",
                    color: "text-[#1a7a4a]",
                    bg: "bg-[#f0faf4]",
                    desc: "Free to use for this purpose under the standard license. No purchase required.",
                  },
                  {
                    status: "Paid license required",
                    color: "text-[#c2410c]",
                    bg: "bg-[#fff8f0]",
                    desc: "You must purchase a license before using this font. Check the official purchase page.",
                  },
                  {
                    status: "Limited",
                    color: "text-[#92600a]",
                    bg: "bg-[#fffbeb]",
                    desc: "Usage is permitted in some contexts but restricted or prohibited in others. Check the specific license terms.",
                  },
                  {
                    status: "Not allowed",
                    color: "text-[#be123c]",
                    bg: "bg-[#fff1f2]",
                    desc: "Use is not permitted under the standard license.",
                  },
                  {
                    status: "Unknown",
                    color: "text-[#475569]",
                    bg: "bg-[#f8fafc]",
                    desc: "We could not confirm the license status with sufficient confidence.",
                  },
                ].map((item) => (
                  <div key={item.status} className={`${item.bg} rounded-xl px-4 py-3`}>
                    <p className={`text-sm font-semibold ${item.color} mb-1`}>{item.status}</p>
                    <p className="text-sm text-[#6b6b6b]">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-6">
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Found an error?</h2>
              <p className="text-[#6b6b6b] leading-relaxed mb-4">
                If you spot incorrect licensing information, a broken link, or a missing font,
                please let us know. We review all reports.
              </p>
              <Link href="/report" className="btn-primary text-sm">
                Report an issue
              </Link>
            </section>
          </div>
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
