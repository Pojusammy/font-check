"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import FontUpload from "./FontUpload";

type Tab = "search" | "upload";

const TABS: { id: Tab; label: string }[] = [
  { id: "search", label: "Search by name" },
  { id: "upload", label: "Upload font file" },
];

export default function HeroTabs() {
  const [tab, setTab] = useState<Tab>("search");

  const handleTabChange = async (next: Tab) => {
    if (next === tab) return;

    try {
      const { WebHaptics } = await import("web-haptics");
      if (WebHaptics.isSupported) {
        const h = new WebHaptics();
        h.trigger("nudge");
      }
    } catch {
      // web-haptics unavailable
    }

    setTab(next);
  };

  return (
    <div className="w-full">
      {/* ── Tab strip ──────────────────────────────── */}
      <div className="flex border-b border-[#e5e1da] mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTabChange(t.id)}
            className="relative px-5 py-3 text-sm font-medium transition-colors duration-150 focus-ring"
            style={{ color: tab === t.id ? "#1a1714" : "#a8a09a" }}
          >
            {t.label}
            {/* Active underline — always rendered, visibility controlled by opacity */}
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-opacity duration-150"
              style={{
                background: "#1a1714",
                opacity: tab === t.id ? 1 : 0,
              }}
              aria-hidden
            />
          </button>
        ))}
      </div>

      {/* ── Tab content ────────────────────────────── */}
      <div className="relative px-2 pb-2">
        <div
          style={{
            opacity: tab === "search" ? 1 : 0,
            transform: tab === "search" ? "translateY(0)" : "translateY(-6px)",
            transition: `opacity 200ms var(--ease-smooth), transform 200ms var(--ease-out-quart)`,
            pointerEvents: tab === "search" ? "auto" : "none",
            position: tab === "search" ? "relative" : "absolute",
            inset: 0,
          }}
        >
          <SearchBar
            size="lg"
            autoFocus={tab === "search"}
            placeholder="Type a font name — Helvetica, Gotham, Inter…"
          />
        </div>

        <div
          style={{
            opacity: tab === "upload" ? 1 : 0,
            transform: tab === "upload" ? "translateY(0)" : "translateY(6px)",
            transition: `opacity 200ms var(--ease-smooth), transform 200ms var(--ease-out-quart)`,
            pointerEvents: tab === "upload" ? "auto" : "none",
            position: tab === "upload" ? "relative" : "absolute",
            inset: 0,
          }}
        >
          <FontUpload />
        </div>
      </div>
    </div>
  );
}
