import Link from "next/link";
import HeroTabs from "@/components/HeroTabs";
import RevealSection from "@/components/RevealSection";
import NavLogo from "@/components/NavLogo";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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

export default async function HomePage() {
  const fontCount = await getFontCount();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">

      {/* ── Nav ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <NavLogo />
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/report" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Report issue
            </Link>
          </nav>
          <Link
            href="/report"
            className="text-sm bg-[#1a1714] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#2e2825] transition-colors"
          >
            Report issue
          </Link>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ───────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#EEEEFF] via-[#F3F4FF] to-white pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-0">

            {/* Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-brand bg-brand-dim border border-brand-dim px-3.5 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
                {fontCount.toLocaleString()} fonts tracked — updated regularly
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-gray-900 tracking-tight leading-[1.1] max-w-2xl mb-5">
              Check if a font is safe to use — in seconds
            </h1>

            <p className="text-base sm:text-lg text-gray-500 max-w-lg mb-8 leading-relaxed">
              Skip the legal jargon. Search or upload a font and get a clear answer on whether
              it&apos;s free, paid, or restricted for commercial use.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
              <a
                href="#search"
                className="btn-brand px-6 py-2.5 rounded-full"
              >
                Check a font
              </a>
              <a
                href="#upload"
                className="px-6 py-2.5 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Upload a font
              </a>
            </div>
            <p className="text-xs text-gray-400 mb-12">No signup required</p>

            {/* Product mockup */}
            <div className="w-full max-w-3xl mx-auto">
              <div className="bg-white rounded-t-2xl border border-gray-200 shadow-[0_8px_48px_rgba(99,102,241,0.12),0_2px_8px_rgba(0,0,0,0.06)]">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 block" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400 block" />
                    <span className="w-3 h-3 rounded-full bg-green-400 block" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 text-center select-none">
                      fontchecker.vercel.app
                    </div>
                  </div>
                </div>

                {/* App content */}
                <div id="search" className="p-5 bg-[#f5f4f1]">
                  {/* Search/upload tabs */}
                  <div className="bg-white rounded-2xl border border-[#e5e1da] shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-2 mb-5">
                    <HeroTabs />
                  </div>

                  {/* Sample result card */}
                  <div className="bg-white rounded-xl border border-[#e5e1da] p-4 text-left">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold text-[#1a1714]">Inter</p>
                        <p className="text-xs text-[#a8a09a]">By Rasmus Andersson</p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#f0faf5] text-[#2a9d6a] border border-[#c6ead8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2a9d6a] inline-block" />
                        Free
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-[#f9f8f5] p-2.5">
                        <p className="text-[#a8a09a] mb-1">Personal use</p>
                        <p className="font-semibold text-[#2a9d6a]">✓ Allowed</p>
                      </div>
                      <div className="rounded-lg bg-[#f9f8f5] p-2.5">
                        <p className="text-[#a8a09a] mb-1">Commercial use</p>
                        <p className="font-semibold text-[#2a9d6a]">✓ Allowed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats row ───────────────────────────────────── */}
        <section className="border-y border-gray-100 bg-white py-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-3 gap-8 text-center divide-x divide-gray-100">
              {[
                { value: `${fontCount.toLocaleString()}+`, label: "Fonts tracked" },
                { value: "4", label: "License categories" },
                { value: "100%", label: "Free to check" },
              ].map((s) => (
                <div key={s.label} className="px-4">
                  <p className="text-2xl font-bold text-gray-900 mb-1">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────── */}
        <section className="py-24 px-6 bg-white">
          <RevealSection className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">
                How it works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Simple, fast, and clear
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-10">
              {[
                {
                  n: "01",
                  title: "Search or upload a font",
                  desc: "Type a font name or upload a .ttf / .otf file.",
                  icon: (
                    <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                  ),
                },
                {
                  n: "02",
                  title: "We check licensing sources",
                  desc: "We match it against our database and trusted licensing sources.",
                  icon: (
                    <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M5.5 19h13A1.5 1.5 0 0 0 20 17.5v-11A1.5 1.5 0 0 0 18.5 5h-13A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19z" />
                    </svg>
                  ),
                },
                {
                  n: "03",
                  title: "Get a clear answer",
                  desc: "See if it's free, paid, or restricted — with a plain-language explanation.",
                  icon: (
                    <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  ),
                },
              ].map((step) => (
                <div key={step.n} className="group">
                  <div className="w-10 h-10 rounded-xl bg-brand-dim flex items-center justify-center mb-5">
                    {step.icon}
                  </div>
                  <p className="text-xs font-bold text-brand/60 mb-2 tracking-widest">{step.n}</p>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* ── What you get ────────────────────────────────── */}
        <section className="py-24 px-6 bg-gray-50">
          <RevealSection className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">
                What you get
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                Everything you need to decide quickly
              </h2>
              <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
                Each result gives you a clear breakdown.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Personal use",
                  desc: "Can you use it for your own projects?",
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                    </svg>
                  ),
                },
                {
                  title: "Commercial use",
                  desc: "Can you use it for client work, products, or business?",
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
                    </svg>
                  ),
                },
                {
                  title: "License summary",
                  desc: "A simple explanation without legal complexity.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
                    </svg>
                  ),
                },
                {
                  title: "Official source",
                  desc: "Link to the original license for verification.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  ),
                },
                {
                  title: "Purchase link",
                  desc: "Where to get the correct license if needed.",
                  icon: (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-brand/30 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-dim text-brand flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </section>

        {/* ── Upload feature ──────────────────────────────── */}
        <section id="upload" className="py-24 px-6 bg-white">
          <RevealSection className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">
                  Upload feature
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-5">
                  Already have the font file?
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Upload a font file and we&apos;ll detect its name and try to match it with
                  licensing information.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">
                  If we can&apos;t verify it, we&apos;ll still show what we found and guide you
                  to the right next step.
                </p>
                <a href="#search" className="btn-brand px-6 py-2.5 rounded-full">
                  Upload a font
                </a>
              </div>

              {/* Upload UI mockup */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center bg-white hover:border-brand/40 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-brand-dim flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Drop your font file here</p>
                  <p className="text-xs text-gray-400 mb-5">.ttf, .otf, .woff, .woff2 supported</p>
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gray-900 text-white">
                    Browse file
                  </span>
                </div>
                {/* Detected result hint */}
                <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">Font detected: Inter Regular</p>
                    <p className="text-xs text-gray-400">License: SIL Open Font License 1.1 · Free</p>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ── Built for clarity ───────────────────────────── */}
        <section className="py-24 px-6 bg-gray-50">
          <RevealSection className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Before / After mockup */}
              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-red-100 p-5">
                  <p className="text-xs font-semibold text-red-400 mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                    Without Font Check
                  </p>
                  <div className="text-xs text-gray-500 leading-relaxed space-y-1.5">
                    <p className="line-clamp-2">§4.2 The licensee agrees that the Font Software may be used solely for the purpose of rendering text in licensed applications, provided that…</p>
                    <p className="line-clamp-2">§7.1 Redistribution of the Font Software, whether in original or modified form, is prohibited without prior written consent from…</p>
                    <p className="mt-2 text-red-500 font-medium">😕 What does this even mean?</p>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-7 h-7 rounded-full bg-brand-dim flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-green-100 p-5">
                  <p className="text-xs font-semibold text-green-600 mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    With Font Check
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div className="bg-green-50 rounded-lg p-2.5">
                      <p className="font-semibold text-green-800">Personal use</p>
                      <p className="text-green-600 mt-0.5">✓ Free</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2.5">
                      <p className="font-semibold text-green-800">Commercial use</p>
                      <p className="text-green-600 mt-0.5">✓ Free</p>
                    </div>
                  </div>
                  <p className="text-xs text-green-600 font-medium">✨ Clear. No jargon.</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">
                  Built for clarity
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-5">
                  No more guessing or reading legal walls
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Font licenses can be confusing and inconsistent. Font Check focuses on one
                  thing: helping you quickly understand whether you can use a font.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Instead of long documents, you get clear answers. Instead of uncertainty,
                  you get direction.
                </p>
              </div>
            </div>
          </RevealSection>
        </section>

        {/* ── Trust / Disclaimer ──────────────────────────── */}
        <section className="py-16 px-6 bg-white border-y border-gray-100">
          <RevealSection className="max-w-2xl mx-auto text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-dim flex items-center justify-center mx-auto mb-5">
              <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Designed to guide, not replace official sources
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-2">
              Font Check simplifies licensing into plain language for easier understanding.
              Licensing terms can vary, so always verify with the official source before
              using a font in commercial work.
            </p>
            <p className="text-sm text-gray-500 leading-relaxed">
              We clearly show when information is unverified or incomplete.
            </p>
          </RevealSection>
        </section>

        {/* ── Social proof ────────────────────────────────── */}
        <section className="py-16 px-6 bg-gray-50">
          <RevealSection className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-semibold text-brand uppercase tracking-widest mb-3">
              Origin story
            </p>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Built from a real problem</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              This started as a personal need while working on design projects. If you&apos;ve
              ever wondered whether a font is safe to use, this tool is for you.
            </p>
          </RevealSection>
        </section>

        {/* ── Final CTA ───────────────────────────────────── */}
        <section className="py-24 px-6 bg-gradient-to-b from-[#EEEEFF] to-white">
          <RevealSection className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Check a font before you use it
            </h2>
            <p className="text-gray-500 mb-8 text-sm">Make faster, safer design decisions.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="#search" className="btn-brand px-8 py-3 rounded-full">
                Try Font Check
              </a>
              <a
                href="#upload"
                className="px-8 py-3 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Upload a font
              </a>
            </div>
          </RevealSection>
        </section>

      </main>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <NavLogo />
          <div className="flex items-center gap-6 text-xs text-gray-400">
            <Link href="/about" className="hover:text-gray-700 transition-colors">About</Link>
            <Link href="/report" className="hover:text-gray-700 transition-colors">Report issue</Link>
            <Link href="/admin/login" className="hover:text-gray-700 transition-colors">Admin</Link>
          </div>
          <p className="text-xs text-gray-400">© 2025 Font Check</p>
        </div>
      </footer>

    </div>
  );
}
