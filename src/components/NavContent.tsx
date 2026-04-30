"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import NavLogo from "./NavLogo";
import SearchSuggestions from "./SearchSuggestions";

interface SearchResult {
  id: string;
  slug: string;
  font_name: string;
  vendor_name: string | null;
  personal_use_status: string;
  commercial_use_status: string;
}

const NAV_LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/about",  label: "About"  },
];

export default function NavContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query,      setQuery]      = useState("");
  const [menuOpen,   setMenuOpen]   = useState(false);

  // Autocomplete state
  const [results,         setResults]         = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex,     setActiveIndex]     = useState(-1);
  const [isLoading,       setIsLoading]       = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef  = useRef<HTMLDivElement>(null);
  const router   = useRouter();

  // Auto-focus input when search opens; clear on close
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQuery("");
      setResults([]);
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  }, [searchOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    function handler(e: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [menuOpen]);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setShowSuggestions(false); return; }
    setIsLoading(true);
    try {
      const res  = await fetch(`/api/v1/fonts/search?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data.results ?? []);
      setShowSuggestions(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setActiveIndex(-1);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { closeSearch(); return; }
    if (!showSuggestions || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((p) => Math.min(p + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((p) => Math.max(p - 1, -1));
    }
  };

  const handleSelectResult = useCallback((result: SearchResult) => {
    router.push(`/font/${result.slug}`);
    closeSearch();
  }, [router]); // eslint-disable-line

  const openSearch  = useCallback(() => { setMenuOpen(false); setSearchOpen(true); }, []);
  const closeSearch = useCallback(() => { setSearchOpen(false); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      router.push(`/font/${results[activeIndex].slug}`);
    } else if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    closeSearch();
  };

  /* ── Search mode ─────────────────────────────── */
  if (searchOpen) {
    // Shared: form + suggestions dropdown, anchored relative
    const searchBox = (
      <div className="flex-1 relative">
        <form
          onSubmit={handleSubmit}
          className="flex items-center bg-white rounded-xl border border-[#e5e1da] pl-3.5 pr-[3px] gap-2"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {/* Search / spinner icon */}
          {isLoading ? (
            <svg className="flex-shrink-0 animate-spin text-[#a8a09a]" width="15" height="15" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#a8a09a" className="flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && results.length > 0 && setShowSuggestions(true)}
            placeholder="Search font..."
            autoComplete="off"
            spellCheck={false}
            className="flex-1 py-2.5 text-sm text-[#1a1714] bg-transparent outline-none placeholder-[#a8a09a]"
            style={{ caretColor: "#1a1714" }}
          />

          <button
            type="submit"
            className="flex-shrink-0 text-[0.8125rem] font-semibold text-white rounded-[9px] px-4 py-[7px] my-[3px]"
            style={{
              background: "#1a1714",
              fontFamily: "var(--font-instrument, system-ui)",
              transition: "background 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#2e2825")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1714")}
          >
            Check
          </button>
        </form>

        {showSuggestions && results.length > 0 && (
          <SearchSuggestions
            results={results}
            activeIndex={activeIndex}
            onSelect={handleSelectResult}
            query={query}
          />
        )}
      </div>
    );

    const closeBtn = (
      <button
        onClick={closeSearch}
        aria-label="Close search"
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-[#7a7268] hover:text-[#1a1714] hover:bg-[#f0ede8] transition-colors"
      >
        <svg width="13" height="13" fill="none" viewBox="0 0 13 13">
          <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    );

    return (
      <>
        {/* ── Desktop: centered, max-width ── */}
        <div className="hidden sm:flex h-14 items-center justify-center">
          <div className="w-full max-w-xl flex items-center gap-3">
            {searchBox}
            {closeBtn}
          </div>
        </div>

        {/* ── Mobile: logo icon | search box | X ── */}
        <div className="flex sm:hidden h-14 items-center gap-2">
          <Link href="/" onClick={closeSearch} className="flex-shrink-0">
            <Image src="/logo-mark.svg" alt="Font.Check" width={22} height={25} priority />
          </Link>
          <div className="flex-1 flex items-center gap-2">
            {searchBox}
            {closeBtn}
          </div>
        </div>
      </>
    );
  }

  /* ── Normal mode ─────────────────────────────── */
  return (
    <div className="h-14 flex items-center justify-between">
      <NavLogo />

      <div className="flex items-center gap-1">

        {/* ── Desktop ──────────────────────────── */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={openSearch}
            className="text-sm text-[#7a7268] hover:text-[#1a1714] px-3 py-1.5 rounded-lg transition-colors"
          >
            Search
          </button>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#7a7268] hover:text-[#1a1714] px-3 py-1.5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/report"
            className="text-sm bg-[#1a1714] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#2e2825] active:scale-[0.97]"
            style={{ transition: "transform 160ms ease-out, background-color 150ms ease" }}
          >
            Report issue
          </Link>
        </div>

        {/* ── Mobile: search icon + hamburger ──── */}
        <div ref={menuRef} className="sm:hidden flex items-center gap-0.5">

          {/* Search icon */}
          <button
            onClick={openSearch}
            aria-label="Search"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#7a7268] hover:text-[#1a1714] hover:bg-[#f0ede8] transition-colors"
          >
            <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="w-9 h-9 flex flex-col justify-center items-center gap-[5px] rounded-lg hover:bg-[#f0ede8] transition-colors"
          >
            <span
              className="block w-[18px] h-px bg-[#1a1714] origin-center transition-all duration-200"
              style={{ transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }}
            />
            <span
              className="block w-[18px] h-px bg-[#1a1714] transition-all duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-[18px] h-px bg-[#1a1714] origin-center transition-all duration-200"
              style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }}
            />
          </button>

          {/* Mobile dropdown */}
          {menuOpen && (
            <div
              className="fixed inset-x-0 top-14 z-50 bg-white border-b border-[#e5e1da]"
              style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
            >
              <div className="px-6 py-4 flex flex-col gap-0.5">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-[#4a4540] hover:text-[#1a1714] py-3 border-b border-[#f5f4f1] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/report"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 text-sm bg-[#1a1714] text-white px-4 py-2.5 rounded-full font-medium text-center hover:bg-[#2e2825] transition-colors"
                >
                  Report issue
                </Link>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
