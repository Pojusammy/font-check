"use client";

import { useEffect, useState } from "react";

interface FontSpecimenProps {
  fontName: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

function toGoogleFontsFamily(name: string) {
  // Normalize the name for Google Fonts URL
  return name.trim().replace(/\s+/g, "+");
}

export default function FontSpecimen({
  fontName,
  className,
  style,
  children,
}: FontSpecimenProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
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
    link.onerror = () => setLoaded(true); // fall back gracefully for unlisted fonts
    document.head.appendChild(link);
  }, [fontName]);

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
