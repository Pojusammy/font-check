"use client";

import { useEffect, useState } from "react";

interface FontSpecimenProps {
  fontName: string;
  sourceType?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function toGoogleFontsFamily(name: string) {
  return name.trim().replace(/\s+/g, "+");
}

// Only attempt Google Fonts loading for these source types
const GOOGLE_FONTS_SOURCE_TYPES = new Set(["google-fonts", "open-source"]);

export default function FontSpecimen({
  fontName,
  sourceType,
  className,
  style,
  children,
}: FontSpecimenProps) {
  // For non-Google sources, skip the network request entirely
  const shouldTryGoogleFonts = !sourceType || GOOGLE_FONTS_SOURCE_TYPES.has(sourceType);
  const [loaded, setLoaded] = useState(!shouldTryGoogleFonts);

  useEffect(() => {
    if (!shouldTryGoogleFonts) return;

    const family = toGoogleFontsFamily(fontName);
    const linkId = `gf-${family}`;

    if (document.getElementById(linkId)) {
      setLoaded(true);
      return;
    }

    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,400;0,700;1,400&display=swap`;
    link.onload = () => setLoaded(true);
    link.onerror = () => setLoaded(true);
    document.head.appendChild(link);
  }, [fontName, shouldTryGoogleFonts]);

  return (
    <span
      className={className}
      style={{
        fontFamily: `"${fontName}", var(--font-display), Georgia, serif`,
        transition: "opacity 300ms ease",
        opacity: loaded ? 1 : 0.6,
        ...style,
      }}
    >
      {children ?? fontName}
    </span>
  );
}
