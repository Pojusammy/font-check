"use client";

import { useRef, useEffect } from "react";
import type { LicenseStatus } from "@prisma/client";
import StatusBadge from "./StatusBadge";

interface SearchResult {
  id: string;
  slug: string;
  font_name: string;
  vendor_name: string | null;
  personal_use_status: string;
  commercial_use_status: string;
}

interface SearchSuggestionsProps {
  results: SearchResult[];
  activeIndex: number;
  onSelect: (result: SearchResult) => void;
  query: string;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-transparent text-[#d4a853] font-semibold">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

const ITEM_HEIGHT = 56;

export default function SearchSuggestions({
  results,
  activeIndex,
  onSelect,
  query,
}: SearchSuggestionsProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const item = listRef.current.children[activeIndex] as HTMLElement;
    item?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIndex]);

  return (
    <div
      className="absolute top-full left-0 right-0 z-50 mt-1.5 rounded-xl overflow-hidden"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e1da",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
        animation: `slideDown 160ms var(--ease-out-expo) both`,
      }}
    >
      {/* Sliding keyboard highlight */}
      {activeIndex >= 0 && (
        <span
          aria-hidden
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: ITEM_HEIGHT,
            background: "#f5f4f1",
            top: activeIndex * ITEM_HEIGHT,
            transition: `top 180ms var(--ease-spring)`,
            willChange: "top",
            zIndex: 0,
          }}
        />
      )}

      <ul ref={listRef} role="listbox" className="relative">
        {results.map((result, i) => (
          <li
            key={result.id}
            role="option"
            aria-selected={i === activeIndex}
            className="flex items-center justify-between px-4 cursor-pointer transition-colors duration-100 hover:bg-[#f9f8f5]"
            style={{
              height: ITEM_HEIGHT,
              borderTop: i > 0 ? "1px solid #f0ede8" : undefined,
              zIndex: 1,
              position: "relative",
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(result);
            }}
          >
            <div>
              <p className="text-sm text-[#1a1714] font-display leading-snug">
                {highlightMatch(result.font_name, query)}
              </p>
              {result.vendor_name && (
                <p className="text-xs text-[#a8a09a] mt-0.5">{result.vendor_name}</p>
              )}
            </div>
            <div className="ml-3 flex-shrink-0">
              <StatusBadge
                status={result.commercial_use_status as LicenseStatus}
                size="sm"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
