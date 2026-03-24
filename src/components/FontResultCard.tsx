import Link from "next/link";
import StatusBadge from "./StatusBadge";
import FontSpecimen from "./FontSpecimen";
import { interpretLicense, getConfidenceLabel } from "@/lib/license-interpreter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FontWithAliases = any;

interface FontResultCardProps {
  font: FontWithAliases;
  variant?: "full" | "compact";
}

const severityAccent: Record<string, string> = {
  free: "#2a9d6a",
  limited: "#c4952a",
  paid: "#c0603a",
  restricted: "#b83a52",
  unknown: "#8a8890",
};

export default function FontResultCard({ font, variant = "full" }: FontResultCardProps) {
  const interpretation = interpretLicense(
    font.personal_use_status,
    font.commercial_use_status,
    font.confidence_level,
    font.simplified_summary
  );

  const accent = severityAccent[interpretation.overallSeverity] ?? "#8a8890";

  /* ── Compact variant ─────────────────────────────── */
  if (variant === "compact") {
    return (
      <Link href={`/font/${font.slug}`}>
        <div
          className="group cursor-pointer rounded-2xl transition-all duration-150"
          style={{
            background: "#ffffff",
            border: "1px solid #e5e1da",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div className="px-5 pt-5 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl text-[#1a1714] group-hover:text-[#2e2825] transition-colors leading-tight">
                  <FontSpecimen fontName={font.font_name} style={{ fontSize: "inherit" }} />
                </h3>
                {font.vendor_name && (
                  <p className="text-xs text-[#a8a09a] mt-0.5 uppercase tracking-wider">
                    {font.vendor_name}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 mt-0.5">
                <StatusBadge status={font.commercial_use_status} size="sm" />
              </div>
            </div>
            <p className="text-sm text-[#7a7268] mt-3 line-clamp-2 leading-relaxed">
              {interpretation.summary}
            </p>
          </div>
          {/* Accent bar sweeps in on hover */}
          <div
            className="h-0.5 w-0 group-hover:w-full transition-all duration-300 rounded-b-2xl"
            style={{ backgroundColor: accent }}
          />
        </div>
      </Link>
    );
  }

  /* ── Full variant ────────────────────────────────── */
  return (
    <div
      className="overflow-hidden rounded-2xl stagger-reveal"
      style={{
        background: "#ffffff",
        border: "1px solid #e5e1da",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Specimen header */}
      <div className="px-7 pt-9 pb-7" style={{ borderBottom: "1px solid #f0ede8" }}>
        <div className="w-10 h-0.5 mb-6 rounded-full" style={{ backgroundColor: accent }} />
        <h1
          className="leading-none tracking-tight text-[#1a1714]"
          style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)" }}
        >
          <FontSpecimen fontName={font.font_name} style={{ fontSize: "inherit", lineHeight: "inherit", letterSpacing: "inherit" }} />
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-5">
          {font.vendor_name && (
            <span className="text-xs text-[#a8a09a] uppercase tracking-[0.15em]">
              {font.vendor_name}
            </span>
          )}
          {font.source_type && (
            <>
              <span className="text-[#e5e1da]">·</span>
              <span className="text-xs text-[#a8a09a] uppercase tracking-[0.15em]">
                {font.source_type.replace(/-/g, " ")}
              </span>
            </>
          )}
          {font.family_name && font.family_name !== font.font_name && (
            <>
              <span className="text-[#e5e1da]">·</span>
              <span className="text-xs text-[#a8a09a] uppercase tracking-[0.15em]">
                {font.family_name} family
              </span>
            </>
          )}
        </div>
      </div>

      {/* Verdict */}
      <div className="px-7 py-6" style={{ borderBottom: "1px solid #f0ede8" }}>
        <p className="text-xs text-[#a8a09a] uppercase tracking-[0.15em] mb-3">License verdict</p>
        <p className="text-[#1a1714] leading-relaxed text-[0.9375rem]">{interpretation.summary}</p>
      </div>

      {/* Status grid */}
      <div className="grid grid-cols-2" style={{ borderBottom: "1px solid #f0ede8" }}>
        <div className="px-7 py-5" style={{ borderRight: "1px solid #f0ede8" }}>
          <p className="text-xs text-[#a8a09a] uppercase tracking-[0.15em] mb-3">Personal use</p>
          <StatusBadge status={font.personal_use_status} size="md" />
        </div>
        <div className="px-7 py-5">
          <p className="text-xs text-[#a8a09a] uppercase tracking-[0.15em] mb-3">Commercial use</p>
          <StatusBadge status={font.commercial_use_status} size="md" />
        </div>
      </div>

      {/* Links */}
      {(font.official_source_url || font.official_license_url || font.purchase_url) && (
        <div className="px-7 py-6" style={{ borderBottom: "1px solid #f0ede8" }}>
          <p className="text-xs text-[#a8a09a] uppercase tracking-[0.15em] mb-4">References</p>
          <div className="space-y-3">
            {font.official_source_url && (
              <a
                href={font.official_source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[#1a1714] hover:text-[#d4a853] transition-colors group"
              >
                <span className="text-[#a8a09a] group-hover:text-[#d4a853] transition-colors group-hover:translate-x-0.5 inline-block transition-transform duration-150">→</span>
                Official source
              </a>
            )}
            {font.official_license_url && (
              <a
                href={font.official_license_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[#1a1714] hover:text-[#d4a853] transition-colors group"
              >
                <span className="text-[#a8a09a] group-hover:text-[#d4a853] transition-colors group-hover:translate-x-0.5 inline-block transition-transform duration-150">→</span>
                View license
              </a>
            )}
            {font.purchase_url && (
              <a
                href={font.purchase_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[#1a1714] hover:text-[#d4a853] transition-colors group"
              >
                <span className="text-[#a8a09a] group-hover:text-[#d4a853] transition-colors group-hover:translate-x-0.5 inline-block transition-transform duration-150">→</span>
                Purchase license
              </a>
            )}
          </div>
        </div>
      )}

      {/* Footer meta */}
      <div className="px-7 py-4 flex items-center justify-between bg-[#f9f8f5]">
        <div className="flex items-center gap-3 text-xs text-[#a8a09a]">
          <span>{getConfidenceLabel(font.confidence_level)}</span>
          {font.last_verified_at && (
            <>
              <span className="text-[#d4cec5]">·</span>
              <span>
                Verified{" "}
                {new Date(font.last_verified_at).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </>
          )}
        </div>
        <Link
          href={`/report?font_id=${font.id}&font_name=${encodeURIComponent(font.font_name)}`}
          className="text-xs text-[#a8a09a] hover:text-[#4a4540] transition-colors"
        >
          Report issue
        </Link>
      </div>
    </div>
  );
}
