"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

interface BrowseFont {
  id: string;
  slug: string;
  font_name: string;
  vendor_name: string | null;
  source_type: string | null;
  family_name: string | null;
  personal_use_status: string;
  commercial_use_status: string;
  confidence_level: string;
  simplified_summary: string | null;
}

type Category = "all" | "sans-serif" | "serif" | "mono" | "handwritten" | "display";
type Pricing = "all" | "free" | "limited" | "paid";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "all",        label: "All"        },
  { value: "sans-serif", label: "Sans-serif"  },
  { value: "serif",      label: "Serif"       },
  { value: "mono",       label: "Monospace"   },
  { value: "handwritten",label: "Handwritten" },
  { value: "display",    label: "Display"     },
];

const PRICING: { value: Pricing; label: string; activeColor: string }[] = [
  { value: "all",     label: "All",     activeColor: "#171618" },
  { value: "free",    label: "Free",    activeColor: "#1e7a4e" },
  { value: "limited", label: "Limited", activeColor: "#8a6320" },
  { value: "paid",    label: "Paid",    activeColor: "#b85a3a" },
];

const statusAccent: Record<string, string> = {
  allowed:              "#2a9d6a",
  limited:              "#c4952a",
  paid_license_required:"#c0603a",
  not_allowed:          "#b83a52",
  unknown:              "#8a8890",
};

function inferCategory(font: BrowseFont): Category {
  const text = [font.font_name, font.family_name, font.vendor_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/\bmono\b|\bcode\b|console|typewriter|\bcourier\b|terminal|monospace/.test(text)) {
    return "mono";
  }
  if (/script|handwritten|handwriting|\bbrush\b|cursive|\bhand\b|calligraph|signature|lettering/.test(text)) {
    return "handwritten";
  }
  if (/\bdisplay\b|headline|poster|decorative|ornamental/.test(text)) {
    return "display";
  }
  if (/\bserif\b|\broman\b|antiqua|garamond|caslon|palatino|\bbodoni\b|didot|minion|jenson|caledonia|\btimes\b|baskerville|cambria|constantia/.test(text)) {
    return "serif";
  }
  if (/grotesk|grotesque|gothic|\bsans\b|linear|geometric|humanist/.test(text)) {
    return "sans-serif";
  }
  return "sans-serif";
}

const PAGE_SIZE = 48;

export default function BrowseClient() {
  const [fonts, setFonts] = useState<BrowseFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState<Category>("all");
  const [pricing, setPricing] = useState<Pricing>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/v1/fonts/browse")
      .then((r) => r.json())
      .then((data) => {
        setFonts(data.fonts ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return fonts.filter((font) => {
      if (category !== "all" && inferCategory(font) !== category) return false;
      if (pricing === "free"    && font.commercial_use_status !== "allowed")               return false;
      if (pricing === "limited" && font.commercial_use_status !== "limited")               return false;
      if (pricing === "paid"    && font.commercial_use_status !== "paid_license_required") return false;
      return true;
    });
  }, [fonts, category, pricing]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered]);
  const displayed  = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const [licenseOpen,  setLicenseOpen]  = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const desktopLicenseRef = useRef<HTMLDivElement>(null);
  const mobileLicenseRef  = useRef<HTMLDivElement>(null);
  const mobileCatRef      = useRef<HTMLDivElement>(null);

  const handleCategory = useCallback((c: Category) => { setCategory(c); setPage(1); setMobileCatOpen(false); }, []);
  const handlePricing  = useCallback((p: Pricing)  => { setPricing(p);  setPage(1); setLicenseOpen(false);  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      const inLicense = desktopLicenseRef.current?.contains(target) || mobileLicenseRef.current?.contains(target);
      if (!inLicense) setLicenseOpen(false);
      if (mobileCatRef.current && !mobileCatRef.current.contains(target)) setMobileCatOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const activePricingLabel  = PRICING.find((p) => p.value === pricing)?.label ?? "All";
  const activeCategoryLabel = CATEGORIES.find((c) => c.value === category)?.label ?? "All";

  const Chevron = ({ open }: { open: boolean }) => (
    <svg
      width="10" height="10" viewBox="0 0 10 10" fill="none"
      className="transition-transform duration-200 flex-shrink-0"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const Checkmark = () => (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6L5 9L10 3" stroke="#171618" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      {/* ── Filter bar ──────────────────────────────── */}
      <div className="sticky top-14 z-30 bg-[#f7f7f7]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 sm:py-6">

          {/* ── Desktop (sm+): tabs + count + Filter by ──── */}
          <div className="hidden sm:flex items-center">
            <div className="flex items-center gap-6 flex-1">
              {CATEGORIES.map((cat) => {
                const active = category === cat.value;
                return (
                  <button
                    key={cat.value}
                    onClick={() => handleCategory(cat.value)}
                    className="relative text-[11px] tracking-[0.12em] uppercase transition-colors duration-150 pb-0.5"
                    style={{ color: active ? "#171618" : "#9e9ea3", fontWeight: active ? 600 : 400 }}
                  >
                    {cat.label}
                    {active && (
                      <span className="absolute inset-x-0 -bottom-[1px] h-px" style={{ background: "#171618" }} />
                    )}
                  </button>
                );
              })}
            </div>

            {!loading && !error && (
              <span className="text-xs text-[#9e9ea3] mr-6">
                {filtered.length.toLocaleString()} font{filtered.length !== 1 ? "s" : ""}
              </span>
            )}

            {/* License dropdown */}
            <div ref={desktopLicenseRef} className="relative">
              <button
                onClick={() => setLicenseOpen((o) => !o)}
                className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase transition-colors duration-150"
                style={{ color: pricing !== "all" ? "#171618" : "#9e9ea3", fontWeight: pricing !== "all" ? 600 : 400 }}
              >
                {pricing !== "all" ? activePricingLabel : "Filter by"}
                <Chevron open={licenseOpen} />
              </button>
              {licenseOpen && <LicenseDropdown pricing={pricing} onSelect={handlePricing} />}
            </div>
          </div>

          {/* ── Mobile: count left + two dropdowns right ── */}
          <div className="flex sm:hidden items-center">
            {!loading && !error && (
              <span className="text-xs text-[#9e9ea3] flex-1">
                {filtered.length.toLocaleString()} font{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
            <div className="flex items-center gap-2">

            {/* Category dropdown */}
            <div ref={mobileCatRef} className="relative">
              <button
                onClick={() => { setMobileCatOpen((o) => !o); setLicenseOpen(false); }}
                className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase font-medium transition-all duration-150 px-3.5 py-1.5 rounded-full border"
                style={
                  category !== "all"
                    ? { background: "#171618", borderColor: "#171618", color: "#ffffff" }
                    : { background: "#ffffff", borderColor: "#dadada", color: "#727578" }
                }
              >
                {category !== "all" ? activeCategoryLabel : "Category"}
                <Chevron open={mobileCatOpen} />
              </button>

              {mobileCatOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+10px)] w-44 overflow-hidden"
                  style={{ borderRadius: "12px", background: "#fff", border: "1px solid #efefef", boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
                >
                  <div className="px-3 py-2 border-b border-[#f5f5f5]">
                    <p className="text-[10px] tracking-[0.14em] uppercase text-[#9e9ea3] font-medium">Category</p>
                  </div>
                  {CATEGORIES.map((cat) => {
                    const active = category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => handleCategory(cat.value)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors duration-100 hover:bg-[#f7f7f7]"
                      >
                        <span className="text-xs font-medium" style={{ color: active ? "#171618" : "#3a3a3c" }}>
                          {cat.label}
                        </span>
                        {active && <Checkmark />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* License dropdown */}
            <div ref={mobileLicenseRef} className="relative">
              <button
                onClick={() => { setLicenseOpen((o) => !o); setMobileCatOpen(false); }}
                className="flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase font-medium transition-all duration-150 px-3.5 py-1.5 rounded-full border"
                style={
                  pricing !== "all"
                    ? { background: "#171618", borderColor: "#171618", color: "#ffffff" }
                    : { background: "#ffffff", borderColor: "#dadada", color: "#727578" }
                }
              >
                {pricing !== "all" ? activePricingLabel : "License"}
                <Chevron open={licenseOpen} />
              </button>
              {licenseOpen && <LicenseDropdown pricing={pricing} onSelect={handlePricing} />}
            </div>

            </div>{/* end pill group */}
          </div>{/* end mobile row */}

        </div>
      </div>

      {/* ── Font grid ───────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-[#efefef] h-24" style={{ borderRadius: "20px" }} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-sm text-[#9e9ea3]">Failed to load fonts. Please refresh.</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm text-[#9e9ea3]">No fonts match these filters.</p>
            <button
              onClick={() => { setCategory("all"); setPricing("all"); setPage(1); }}
              className="mt-4 text-xs text-[#3a3a3c] underline underline-offset-2 hover:text-[#171618] transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayed.map((font) => (
                <BrowseFontCard key={font.id} font={font} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </div>
    </>
  );
}

/* ── Pagination ─────────────────────────────────── */
function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  function goTo(p: number) {
    onPageChange(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Build page number list with ellipsis
  function pages(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const result: (number | "…")[] = [1];
    if (page > 3) result.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      result.push(i);
    }
    if (page < totalPages - 2) result.push("…");
    result.push(totalPages);
    return result;
  }

  const btnBase = "min-w-[32px] h-8 flex items-center justify-center rounded-full text-xs font-medium transition-all duration-150";

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      {/* Prev */}
      <button
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
        className={`${btnBase} px-2 gap-1 border border-[#efefef] bg-white`}
        style={{ color: page === 1 ? "#dadada" : "#3a3a3c", cursor: page === 1 ? "not-allowed" : "pointer" }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 2L4 6l3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page numbers */}
      {pages().map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="min-w-[32px] h-8 flex items-center justify-center text-xs text-[#9e9ea3]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={btnBase}
            style={
              p === page
                ? { background: "#171618", color: "#ffffff", border: "1px solid #171618" }
                : { background: "#ffffff", color: "#3a3a3c", border: "1px solid #efefef" }
            }
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
        className={`${btnBase} px-2 gap-1 border border-[#efefef] bg-white`}
        style={{ color: page === totalPages ? "#dadada" : "#3a3a3c", cursor: page === totalPages ? "not-allowed" : "pointer" }}
      >
        <span className="hidden sm:inline">Next</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M4.5 2L8 6l-3.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* ── License dropdown (shared desktop + mobile) ─── */
function LicenseDropdown({ pricing, onSelect }: { pricing: Pricing; onSelect: (p: Pricing) => void }) {
  return (
    <div
      className="absolute right-0 top-[calc(100%+10px)] w-44 rounded-xl overflow-hidden"
      style={{ borderRadius: "12px", background: "#fff", border: "1px solid #efefef", boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)" }}
    >
      <div className="px-3 py-2 border-b border-[#f5f5f5]">
        <p className="text-[10px] tracking-[0.14em] uppercase text-[#9e9ea3] font-medium">License type</p>
      </div>
      {PRICING.map((p) => {
        const active = pricing === p.value;
        return (
          <button
            key={p.value}
            onClick={() => onSelect(p.value)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors duration-100 hover:bg-[#f7f7f7]"
          >
            <span className="text-xs font-medium" style={{ color: active ? "#171618" : "#3a3a3c" }}>
              {p.label}
            </span>
            {active && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="#171618" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        );
      })}
      {pricing !== "all" && (
        <>
          <div className="border-t border-[#f5f5f5]" />
          <button
            onClick={() => onSelect("all")}
            className="w-full px-4 py-2.5 text-left text-xs text-[#9e9ea3] hover:text-[#3a3a3c] transition-colors duration-100 hover:bg-[#f7f7f7]"
          >
            Clear filter
          </button>
        </>
      )}
    </div>
  );
}

/* ── Individual browse card ─────────────────────── */
function BrowseFontCard({ font }: { font: BrowseFont }) {
  const accent = statusAccent[font.commercial_use_status] ?? "#8a8890";

  return (
    <Link href={`/font/${font.slug}`}>
      <div
        className="group cursor-pointer overflow-hidden transition-shadow duration-150"
        style={{
          borderRadius: "20px",
          background: "#ffffff",
          border: "1px solid #efefef",
          boxShadow: "rgba(239,239,239,0.55) 0px 2px 15px 0px",
        }}
      >
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="font-display text-lg text-[#171618] group-hover:text-[#2a2a2c] transition-colors leading-snug"
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
              >
                {font.font_name}
              </h3>
              {font.vendor_name && (
                <p
                  className="text-[0.68rem] text-[#9e9ea3] mt-0.5 uppercase tracking-wider"
                  style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {font.vendor_name}
                </p>
              )}
            </div>
            <div className="flex-shrink-0 mt-0.5">
              <StatusBadge status={font.commercial_use_status} size="sm" />
            </div>
          </div>

          {font.simplified_summary && (
            <p className="text-xs text-[#727578] mt-3 leading-relaxed line-clamp-2">
              {font.simplified_summary}
            </p>
          )}
        </div>

        {/* Accent sweep on hover */}
        <div
          className="h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl"
          style={{ backgroundColor: accent }}
        />
      </div>
    </Link>
  );
}
