import Link from "next/link";
import HeroTabs from "@/components/HeroTabs";
import RevealSection from "@/components/RevealSection";
import { ThemeToggle } from "@/components/ThemeToggle";

const marqueeItems = [
  "Helvetica", "Gotham", "Futura", "Gill Sans", "Bodoni",
  "Garamond", "Proxima Nova", "Avenir", "Brandon Grotesque",
  "Caslon", "Frutiger", "Optima", "Palatino", "Univers",
  "Freight", "Canela", "Domaine", "Tiempos", "Styrene", "Graphik",
  "Satoshi", "Inter", "Poppins", "Lato", "Raleway",
  "Playfair Display", "Merriweather", "Crimson Text", "EB Garamond", "Cormorant",
  "Bebas Neue", "League Gothic", "Oswald", "Anton", "Big Shoulders Display",
  "JetBrains Mono", "Fira Code", "Source Code Pro", "Cascadia Code", "Geist",
  "Coolvetica", "Lobster", "Permanent Marker", "Pacifico", "Sacramento",
  "DM Sans", "Space Grotesk", "Syne", "Manrope", "Plus Jakarta Sans",
  "Clash Display", "Cabinet Grotesk", "General Sans", "Neue Montreal", "Editorial New",
  "Tiempos Text", "Neue Haas Grotesk", "Aktiv Grotesk", "ABC Whyte", "Brown",
  "Operator Mono", "Berkeley Mono", "Dank Mono", "MonoLisa", "Victor Mono",
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Nav ──────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#1a1814]/90 backdrop-blur-md border-b border-[#e5e1da] dark:border-[#2e2924]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-[#1a1714] dark:text-[#f0ece4] font-semibold text-base tracking-tight">
            Font<span className="text-[#d4a853]">.</span>Check
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/about"
              className="text-sm text-[#7a7268] dark:text-[#8a7e6e] hover:text-[#1a1714] dark:hover:text-[#f0ece4] px-3 py-1.5 rounded-lg transition-colors"
            >
              About
            </Link>
            <ThemeToggle />
            <Link
              href="/report"
              className="text-sm bg-[#1a1714] dark:bg-[#f0ece4] text-white dark:text-[#111009] px-4 py-1.5 rounded-full font-medium hover:bg-[#2e2825] dark:hover:bg-[#e4ddd2] transition-colors ml-1"
            >
              Report issue
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center px-6 pt-20 pb-16">
          <div className="w-full max-w-2xl text-center">

            {/* Announcement pill */}
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 text-xs text-[#7a7268] dark:text-[#8a7e6e] bg-white dark:bg-[#1a1814] border border-[#e5e1da] dark:border-[#2e2924] px-4 py-1.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52b788] dark:bg-[#4ade96] inline-block" />
                501 fonts tracked — updated regularly
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] text-[#1a1714] dark:text-[#f0ece4] leading-[1.06] tracking-tight mb-5">
              Is this font
              <br />
              free to{" "}
              <span className="relative inline-block">
                <span className="relative z-10">use?</span>
                <span
                  className="absolute inset-x-0 bottom-0 h-[0.2em] rounded-full"
                  style={{ background: "rgba(212,168,83,0.45)" }}
                  aria-hidden
                />
              </span>
            </h1>

            <p className="text-base text-[#7a7268] dark:text-[#8a7e6e] leading-relaxed max-w-sm mx-auto mb-10">
              Plain-language licensing answers for designers and developers.
              Search any font, get a clear verdict.
            </p>

            {/* Search / Upload — floating card */}
            <div className="bg-white dark:bg-[#1a1814] rounded-2xl border border-[#e5e1da] dark:border-[#2e2924] shadow-[0_4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-2">
              <HeroTabs />
            </div>
          </div>
        </section>

        {/* ── Marquee ──────────────────────────────────── */}
        <div className="overflow-hidden border-y border-[#e5e1da] dark:border-[#2e2924] py-3.5 bg-white dark:bg-[#1a1814]">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((name, i) => (
              <Link
                key={i}
                href={`/font/${name.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-block mx-7 text-xs text-[#a8a09a] dark:text-[#5a5048] hover:text-[#d4a853] dark:hover:text-[#d4a853] transition-colors font-display tracking-wider uppercase"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Status legend ────────────────────────────── */}
        <section className="py-20 px-6">
          <RevealSection className="max-w-4xl mx-auto">
            <div className="flex items-center gap-5 mb-10">
              <p className="text-xs text-[#a8a09a] dark:text-[#5a5048] uppercase tracking-[0.18em] font-medium whitespace-nowrap">
                License status guide
              </p>
              <div className="flex-1 border-t border-[#e5e1da] dark:border-[#2e2924]" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  status: "Free",
                  wrapClass: "bg-[#f0faf5] border-[#c6ead8] dark:bg-[#071a0e] dark:border-[#0f3d20]",
                  colorClass: "text-[#2a9d6a] dark:text-[#4ade96]",
                  dotClass: "bg-[#2a9d6a] dark:bg-[#4ade96]",
                  desc: "Personal + commercial use allowed",
                },
                {
                  status: "Limited",
                  wrapClass: "bg-[#fdf8ee] border-[#e8d6a8] dark:bg-[#1a1206] dark:border-[#3d2e10]",
                  colorClass: "text-[#a0782a] dark:text-[#d4a853]",
                  dotClass: "bg-[#a0782a] dark:bg-[#d4a853]",
                  desc: "Conditional or restricted usage",
                },
                {
                  status: "Paid",
                  wrapClass: "bg-[#fdf2ee] border-[#e8c4b4] dark:bg-[#1a0a06] dark:border-[#4a2010]",
                  colorClass: "text-[#b85a3a] dark:text-[#f08060]",
                  dotClass: "bg-[#b85a3a] dark:bg-[#f08060]",
                  desc: "License purchase required",
                },
                {
                  status: "Unknown",
                  wrapClass: "bg-[#f5f5f7] border-[#d8d8de] dark:bg-[#14141a] dark:border-[#2e2e38]",
                  colorClass: "text-[#6a6a72] dark:text-[#9090a0]",
                  dotClass: "bg-[#6a6a72] dark:bg-[#9090a0]",
                  desc: "Status could not be confirmed",
                },
              ].map((item) => (
                <div
                  key={item.status}
                  className={`rounded-xl p-5 border ${item.wrapClass}`}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dotClass}`} />
                    <span className={`font-semibold text-sm ${item.colorClass}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a7268] dark:text-[#8a7e6e] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* ── How it works ─────────────────────────────── */}
        <section className="py-20 px-6 border-t border-[#e5e1da] dark:border-[#2e2924] bg-white dark:bg-[#1a1814]">
          <RevealSection className="max-w-4xl mx-auto" delay={60}>
            <div className="flex items-center gap-5 mb-12">
              <p className="text-xs text-[#a8a09a] dark:text-[#5a5048] uppercase tracking-[0.18em] font-medium whitespace-nowrap">
                How it works
              </p>
              <div className="flex-1 border-t border-[#e5e1da] dark:border-[#2e2924]" />
            </div>
            <div className="grid sm:grid-cols-3 gap-10">
              {[
                {
                  n: "01",
                  title: "Search for a font",
                  desc: "Type the font name. We search across names, families, and aliases with typo tolerance.",
                },
                {
                  n: "02",
                  title: "Read the verdict",
                  desc: "Get a plain-language answer about personal and commercial licensing. No legal jargon.",
                },
                {
                  n: "03",
                  title: "Verify the source",
                  desc: "Every result links directly to the official source. Read the full license whenever you need.",
                },
              ].map((item) => (
                <div key={item.n} className="group">
                  <p className="font-display text-5xl text-[#e5e1da] dark:text-[#2e2924] group-hover:text-[#d4a853] transition-colors duration-300 mb-5 leading-none">
                    {item.n}
                  </p>
                  <h3 className="font-semibold text-[#1a1714] dark:text-[#f0ece4] mb-2 text-sm tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#7a7268] dark:text-[#8a7e6e] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* ── Disclaimer ───────────────────────────────── */}
        <section className="py-10 border-t border-[#e5e1da] dark:border-[#2e2924]">
          <div className="max-w-xl mx-auto px-6 text-center">
            <p className="text-xs text-[#a8a09a] dark:text-[#5a5048] leading-relaxed">
              Guidance only — not legal advice. Always verify with the official font source
              before commercial use. Licenses can change at any time.{" "}
              <Link
                href="/about"
                className="text-[#7a7268] dark:text-[#8a7e6e] hover:text-[#1a1714] dark:hover:text-[#f0ece4] underline underline-offset-2 transition-colors"
              >
                Learn more
              </Link>
            </p>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────── */}
      <footer className="border-t border-[#e5e1da] dark:border-[#2e2924] py-8 px-6 bg-white dark:bg-[#1a1814]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display text-sm text-[#a8a09a] dark:text-[#5a5048]">
            Font<span className="text-[#d4a853]">.</span>Check
          </p>
          <div className="flex items-center gap-7 text-xs text-[#a8a09a] dark:text-[#5a5048]">
            <Link href="/about" className="hover:text-[#4a4540] dark:hover:text-[#c8bcaa] transition-colors">About</Link>
            <Link href="/report" className="hover:text-[#4a4540] dark:hover:text-[#c8bcaa] transition-colors">Report issue</Link>
            <Link href="/admin/login" className="hover:text-[#4a4540] dark:hover:text-[#c8bcaa] transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
