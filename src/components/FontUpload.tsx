"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import FontSpecimen from "./FontSpecimen";

interface FontInfo {
  name: string;
  family: string;
  fullName: string;
  version?: string;
  foundry?: string;
}

interface IdentifyResult {
  source: "db" | "google-fonts" | "ai" | "none";
  confidence?: string;
  matched_name?: string;
  font_name?: string;
  vendor_name?: string;
  personal_use_status?: string;
  commercial_use_status?: string;
  summary?: string;
  official_source_url?: string;
  official_license_url?: string;
  purchase_url?: string;
  slug?: string;
  ai_note?: string;
  is_google_font?: boolean;
}

type UploadState = "idle" | "parsing" | "searching" | "done" | "error";

const statusColor: Record<string, string> = {
  allowed: "#1e7a4e",
  paid_license_required: "#b85a3a",
  not_allowed: "#9e3a52",
  limited: "#8a6320",
  unknown: "#5a5a62",
};
const statusBg: Record<string, string> = {
  allowed: "#edf7f2",
  paid_license_required: "#fdf0eb",
  not_allowed: "#fdeef2",
  limited: "#fdf6e7",
  unknown: "#f3f3f5",
};
const statusBorder: Record<string, string> = {
  allowed: "#b6e0ca",
  paid_license_required: "#e8bfb0",
  not_allowed: "#e8b4c0",
  limited: "#e8d4a0",
  unknown: "#d0d0d8",
};
const statusLabel: Record<string, string> = {
  allowed: "Allowed",
  paid_license_required: "Paid license",
  not_allowed: "Not allowed",
  limited: "Limited",
  unknown: "Unknown",
};

async function parseFontFile(file: File): Promise<FontInfo> {
  const opentype = await import("opentype.js");
  const buffer = await file.arrayBuffer();
  const font = opentype.parse(buffer);

  const names = font.names as unknown as Record<string, Record<string, string> | undefined>;
  const get = (key: string) =>
    names[key]?.en || names[key]?.["en-US"] || Object.values(names[key] || {})[0] || "";

  const family =
    get("preferredFamily") || get("fontFamily") || file.name.replace(/\.[^.]+$/, "");
  const fullName = get("fullName") || family;
  const version = get("version");
  const foundry = get("manufacturer") || get("designer");

  return { name: family, family, fullName, version, foundry };
}

function SourceBadge({ source }: { source: IdentifyResult["source"] }) {
  if (source === "db") return null;
  const config = {
    "google-fonts": { label: "Google Fonts", bg: "#edf7f2", color: "#1e7a4e", border: "#b6e0ca" },
    ai: { label: "AI identified", bg: "#fdf8ee", color: "#8a6320", border: "#e8d4a0" },
    none: { label: "Not found", bg: "#f3f3f5", color: "#5a5a62", border: "#d0d0d8" },
  }[source];
  if (!config) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
      style={{ background: config.bg, color: config.color, border: `1px solid ${config.border}` }}
    >
      {source === "ai" && (
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      )}
      {config.label}
    </span>
  );
}

export default function FontUpload() {
  const [state, setState] = useState<UploadState>("idle");
  const [fontInfo, setFontInfo] = useState<FontInfo | null>(null);
  const [result, setResult] = useState<IdentifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerHaptic = async (preset: "success" | "error" | "nudge") => {
    try {
      const { WebHaptics } = await import("web-haptics");
      if (WebHaptics.isSupported) {
        const h = new WebHaptics();
        h.trigger(preset);
      }
    } catch { /* silent */ }
  };

  const processFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["ttf", "otf", "woff"].includes(ext || "")) {
      setError("Unsupported file type. Please upload a .ttf, .otf, or .woff file.");
      setState("error");
      triggerHaptic("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10 MB.");
      setState("error");
      triggerHaptic("error");
      return;
    }

    setState("parsing");
    setError(null);
    setFontInfo(null);
    setResult(null);

    try {
      const info = await parseFontFile(file);
      setFontInfo(info);
      setState("searching");

      const res = await fetch("/api/v1/fonts/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: info.family,
          fullName: info.fullName,
          foundry: info.foundry,
          version: info.version,
        }),
      });

      if (!res.ok) {
        throw new Error(`Identify API returned ${res.status}`);
      }

      const data: IdentifyResult = await res.json();
      // Guard: if source is missing treat as "none" so the "not found" branch renders
      if (!data.source) data.source = "none";
      setResult(data);
      setState("done");
      triggerHaptic(data.source !== "none" ? "success" : "nudge");
    } catch (err) {
      console.error(err);
      setError(
        "Could not read this font file. It may be corrupted or WOFF2 format (not yet supported). Try a .ttf or .otf file."
      );
      setState("error");
      triggerHaptic("error");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const reset = () => {
    setState("idle");
    setFontInfo(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const found = result && result.source !== "none";

  return (
    <div className="w-full">
      {/* Drop zone */}
      {(state === "idle" || state === "error") && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a font file"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className="relative cursor-pointer rounded-xl select-none focus-ring"
          style={{
            background: isDragging ? "rgba(212,168,83,0.05)" : "#f9f8f5",
            border: `1.5px dashed ${isDragging ? "#d4a853" : "#d4cec5"}`,
            padding: "2.5rem 2rem",
            transform: isDragging ? "scale(1.01)" : "scale(1)",
            transition: "background 200ms, border-color 200ms, transform 280ms, box-shadow 200ms",
            boxShadow: isDragging ? "0 0 0 3px rgba(212,168,83,0.15)" : "none",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".ttf,.otf,.woff"
            className="hidden"
            onChange={handleChange}
          />
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-1"
              style={{ background: "rgba(212,168,83,0.1)", border: "1px solid rgba(212,168,83,0.25)" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#d4a853" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#1a1714]">Drop a font file here</p>
              <p className="text-xs text-[#7a7268] mt-1">
                or <span className="text-[#d4a853] underline underline-offset-2">click to browse</span>
              </p>
            </div>
            <p className="text-xs text-[#a8a09a]">Supports .ttf, .otf, .woff</p>
            {error && (
              <div
                className="mt-2 px-4 py-2 rounded-lg text-xs text-left w-full"
                style={{ background: "#fdeef2", border: "1px solid #e8b4c0", color: "#9e3a52" }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Parsing / Searching */}
      {(state === "parsing" || state === "searching") && (
        <div
          className="rounded-xl flex flex-col items-center justify-center py-10 gap-4"
          style={{ background: "#f9f8f5", border: "1.5px dashed #d4cec5" }}
        >
          <div className="relative w-9 h-9">
            <div
              className="absolute inset-0 rounded-full border-2 animate-spin"
              style={{ borderColor: "transparent", borderTopColor: "#d4a853" }}
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-[#1a1714] font-medium">
              {state === "parsing" ? "Reading font metadata…" : "Identifying font…"}
            </p>
            {fontInfo && state === "searching" && (
              <p className="text-xs text-[#7a7268] mt-1">
                Detected: <span className="text-[#d4a853] font-medium">{fontInfo.family}</span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {state === "done" && fontInfo && result && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "#ffffff", border: "1px solid #e5e1da", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          {/* Detected font header */}
          <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #f0ede8" }}>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <p className="text-xs text-[#a8a09a] uppercase tracking-[0.15em]">Detected font</p>
              <SourceBadge source={result.source} />
            </div>
            <p className="text-2xl text-[#1a1714] leading-none">
              <FontSpecimen fontName={result.font_name || fontInfo.family} style={{ fontSize: "inherit" }} />
            </p>
            {/* Show matched name if different from raw file name */}
            {result.matched_name && result.matched_name !== fontInfo.family && (
              <p className="text-xs text-[#a8a09a] mt-1">
                Matched as <span className="text-[#7a7268]">{result.matched_name}</span>
              </p>
            )}
            {(result.vendor_name || fontInfo.foundry) && (
              <p className="text-xs text-[#a8a09a] uppercase tracking-wider mt-0.5">
                {result.vendor_name || fontInfo.foundry}
              </p>
            )}
            {fontInfo.version && (
              <p className="text-xs text-[#c0bab4] mt-0.5">{fontInfo.version}</p>
            )}
          </div>

          {found ? (
            <>
              {/* License status grid */}
              <div className="grid grid-cols-2" style={{ borderBottom: "1px solid #f0ede8" }}>
                {[
                  { label: "Personal use", status: result.personal_use_status },
                  { label: "Commercial use", status: result.commercial_use_status },
                ].map(({ label, status }) => (
                  <div
                    key={label}
                    className="px-5 py-4"
                    style={{ borderRight: label === "Personal use" ? "1px solid #f0ede8" : undefined }}
                  >
                    <p className="text-xs text-[#a8a09a] uppercase tracking-[0.15em] mb-2">{label}</p>
                    {status ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          color: statusColor[status] || "#5a5a62",
                          background: statusBg[status] || "#f3f3f5",
                          border: `1px solid ${statusBorder[status] || "#d0d0d8"}`,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ background: statusColor[status] || "#5a5a62" }}
                        />
                        {statusLabel[status] || status}
                      </span>
                    ) : (
                      <span className="text-xs text-[#a8a09a]">—</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Summary */}
              {result.summary && (
                <div className="px-5 py-4" style={{ borderBottom: "1px solid #f0ede8" }}>
                  <p className="text-sm text-[#4a4540] leading-relaxed">{result.summary}</p>
                  {result.ai_note && (
                    <p className="text-xs text-[#a8a09a] mt-2 italic">{result.ai_note}</p>
                  )}
                </div>
              )}

              {/* Links + actions */}
              <div className="px-5 py-3 flex items-center justify-between flex-wrap gap-3 bg-[#f9f8f5]">
                <div className="flex items-center gap-4 flex-wrap">
                  {result.official_source_url && (
                    <a
                      href={result.official_source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1a1714] hover:text-[#d4a853] transition-colors"
                    >
                      → Official source
                    </a>
                  )}
                  {result.official_license_url && (
                    <a
                      href={result.official_license_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1a1714] hover:text-[#d4a853] transition-colors"
                    >
                      → View license
                    </a>
                  )}
                  {result.purchase_url && (
                    <a
                      href={result.purchase_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1a1714] hover:text-[#d4a853] transition-colors"
                    >
                      → Purchase license
                    </a>
                  )}
                  {result.slug && (
                    <Link
                      href={`/font/${result.slug}`}
                      className="text-xs text-[#a8a09a] hover:text-[#4a4540] transition-colors"
                    >
                      Full details →
                    </Link>
                  )}
                </div>
                <button
                  onClick={reset}
                  className="text-xs text-[#a8a09a] hover:text-[#4a4540] transition-colors"
                >
                  Upload another
                </button>
              </div>

              {/* AI disclaimer */}
              {result.source === "ai" && (
                <div
                  className="px-5 py-3 text-xs text-[#a8a09a] leading-relaxed"
                  style={{ borderTop: "1px solid #f0ede8" }}
                >
                  AI-generated result based on font metadata — verify with the official source before use.
                  {" "}<Link href={`/report?search_query=${encodeURIComponent(result.font_name || fontInfo.family)}&issue_type=missing_font`}
                    className="text-[#7a7268] underline underline-offset-2">Add to database →</Link>
                </div>
              )}
            </>
          ) : (
            /* Not found at all */
            <div className="px-5 py-5">
              <p className="text-sm text-[#7a7268] leading-relaxed mb-4">
                We detected <span className="text-[#1a1714] font-medium">{fontInfo.family}</span> but
                couldn&apos;t find license data for it. Search by name or request it be added.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Link
                  href={`/search?q=${encodeURIComponent(result.font_name || fontInfo.family)}`}
                  className="btn-primary text-xs"
                  style={{ padding: "0.45rem 1rem" }}
                >
                  Search by name
                </Link>
                <Link
                  href={`/report?search_query=${encodeURIComponent(fontInfo.family)}&issue_type=missing_font`}
                  className="btn-secondary text-xs"
                  style={{ padding: "0.45rem 1rem" }}
                >
                  Request this font
                </Link>
                <button onClick={reset} className="text-xs text-[#a8a09a] hover:text-[#4a4540] transition-colors">
                  Try another
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
