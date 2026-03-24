"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchSuggestions from "./SearchSuggestions";

interface SearchBarProps {
  defaultValue?: string;
  autoFocus?: boolean;
  size?: "lg" | "md";
  placeholder?: string;
}

interface SearchResult {
  id: string;
  slug: string;
  font_name: string;
  vendor_name: string | null;
  personal_use_status: string;
  commercial_use_status: string;
}

export default function SearchBar({
  defaultValue = "",
  autoFocus = false,
  size = "md",
  placeholder = "Search for a font… e.g. Helvetica, Inter, Gotham",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim() || q.trim().length < 1) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/fonts/search?q=${encodeURIComponent(q)}&limit=6`);
      const data = await res.json();
      setResults(data.results || []);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (activeIndex >= 0 && results[activeIndex]) {
      router.push(`/font/${results[activeIndex].slug}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setQuery(result.font_name);
    setShowSuggestions(false);
    router.push(`/font/${result.slug}`);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLg = size === "lg";

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            {isLoading ? (
              <svg
                className="animate-spin text-[#a8a09a]"
                style={{ width: isLg ? 18 : 16, height: isLg ? 18 : 16 }}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg
                className="text-[#a8a09a]"
                style={{ width: isLg ? 18 : 16, height: isLg ? 18 : 16 }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.trim() && results.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            autoComplete="off"
            spellCheck={false}
            className="search-input-field w-full outline-none transition-all duration-200"
            style={{
              background: "#ffffff",
              border: "1px solid #e5e1da",
              color: "#1a1714",
              borderRadius: isLg ? 12 : 10,
              fontSize: isLg ? "1rem" : "0.875rem",
              padding: isLg ? "1rem 9rem 1rem 3rem" : "0.75rem 7.5rem 0.75rem 2.75rem",
            }}
          />

          <button
            type="submit"
            className="absolute top-1/2 -translate-y-1/2 focus-ring"
            style={{
              right: isLg ? 8 : 6,
              padding: isLg ? "0.5rem 1.1rem" : "0.4rem 0.9rem",
              fontSize: isLg ? "0.8125rem" : "0.75rem",
              borderRadius: 8,
              background: "#1a1714",
              color: "#ffffff",
              fontWeight: 600,
              fontFamily: "var(--font-instrument, system-ui, sans-serif)",
              transition: `transform 120ms var(--ease-out-quart), background 150ms var(--ease-smooth)`,
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-50%) scale(0.96)";
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-50%) scale(1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-50%) scale(1)";
            }}
          >
            Check
          </button>
        </div>
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
}
