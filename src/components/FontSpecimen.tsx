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

/**
 * Map commercial/system font names → closest Google Fonts equivalent for preview rendering.
 * This is purely visual — it doesn't change licensing info, just renders a similar typeface.
 */
const GOOGLE_FONTS_PREVIEW_MAP: Record<string, string> = {
  // Serifs
  "Garamond": "EB Garamond",
  "Garamond Premier Pro": "EB Garamond",
  "Adobe Garamond": "EB Garamond",
  "Sabon": "EB Garamond",
  "Bembo": "EB Garamond",
  "Caslon Pro": "Libre Caslon Text",
  "Didot": "Playfair Display",
  "Bodoni": "Libre Bodoni",
  "Bodoni Moda": "Libre Bodoni",
  "Palatino": "Libre Baskerville",
  "Palatino Linotype": "Libre Baskerville",
  "Optima": "Noto Serif Display",
  "Hoefler Text": "Libre Baskerville",
  "Minion Pro": "Source Serif 4",
  "Warnock Pro": "Source Serif 4",
  "Kepler Std": "Source Serif 4",
  "Arno Pro": "Source Serif 4",
  "Utopia Std": "Source Serif 4",
  "Chaparral Pro": "Bitter",
  "Chronicle Display": "Playfair Display",
  "Mercury Text": "Source Serif 4",
  "Sentinel": "Bitter",
  "Clarendon": "Zilla Slab",
  "Century Gothic": "Poppins",
  "Calluna": "Crimson Pro",
  "Freight Text": "Crimson Pro",
  "Freight Display": "Playfair Display",
  "Cambon": "DM Serif Display",
  "Signifier": "DM Serif Display",
  "Financier Display": "Playfair Display",
  "Tiempos Headline": "Playfair Display",
  "Tiempos Text": "Source Serif 4",
  "Canela": "DM Serif Display",
  "Domaine": "DM Serif Display",
  "Domaine Display": "DM Serif Display",
  "GT Sectra": "Crimson Pro",
  "Harriet": "Crimson Pro",
  "Reckless Neue": "Crimson Pro",
  "Larish Neue": "Playfair Display",
  "Feijoa": "Bitter",
  "Trajan Pro": "Cinzel",
  "Moret": "DM Serif Display",
  "Bluu Next": "DM Serif Display",
  "Produkt": "Source Serif 4",

  // Sans-serifs
  "Helvetica": "Inter",
  "Helvetica Neue": "Inter",
  "Helvetica Now": "Inter",
  "Neue Haas Grotesk": "Inter",
  "Frutiger": "Source Sans 3",
  "Neue Frutiger": "Source Sans 3",
  "Myriad Pro": "Source Sans 3",
  "Avenir Next": "Nunito Sans",
  "Futura": "Nunito",
  "Futura PT": "Nunito",
  "Gotham": "Montserrat",
  "Proxima Nova": "Montserrat",
  "Gill Sans Nova": "Lato",
  "Aktiv Grotesk": "Inter",
  "Graphik": "Inter",
  "Neue Montreal": "Inter",
  "Suisse Int'l": "Inter",
  "Founders Grotesk": "Work Sans",
  "Calibre": "Work Sans",
  "Maison Neue": "DM Sans",
  "Sofia Pro": "DM Sans",
  "Acumin Pro": "Source Sans 3",
  "Univers": "Source Sans 3",
  "Trade Gothic": "Oswald",
  "Franklin Gothic": "Libre Franklin",
  "Museo Sans": "Nunito Sans",
  "National 2": "Inter",
  "Basier Circle": "DM Sans",
  "Centra No.2": "DM Sans",
  "Geomanist": "Poppins",
  "Eurostile": "Rajdhani",
  "Archer": "Bitter",
  "Decimal": "Roboto Mono",
  "Knockout": "Oswald",
  "Tungsten": "Oswald",
  "Druk": "Anton",
  "Verlag": "Nunito Sans",
  "ITC Avant Garde": "Poppins",
  "Brown": "DM Sans",
  "Aeonik": "DM Sans",
  "Lineto Circular": "DM Sans",
  "ABC Diatype": "DM Sans",
  "ABC Monument Grotesk": "Inter",
  "ABC Whyte": "Inter",
  "PP Mori": "DM Sans",
  "PP Neue Machina": "Space Grotesk",
  "PP Right Grotesk": "Work Sans",
  "Neue Machina": "Space Grotesk",
  "Editorial New": "Newsreader",
  "Obviously": "Anybody",
  "Styrene A": "Inter",
  "Idlewild": "Work Sans",
  "Pitch": "Space Mono",
  "Agipo": "Space Grotesk",
  "Whitney": "Source Sans 3",

  // Monospace
  "Operator Mono": "JetBrains Mono",
  "Berkeley Mono": "JetBrains Mono",
  "MonoLisa": "JetBrains Mono",
  "Dank Mono": "Fira Code",
};

export default function FontSpecimen({
  fontName,
  sourceType,
  className,
  style,
  children,
}: FontSpecimenProps) {
  const [loaded, setLoaded] = useState(false);

  // Determine which font to load from Google Fonts
  const previewFont = GOOGLE_FONTS_PREVIEW_MAP[fontName];
  const isGoogleSource = !sourceType || sourceType === "google-fonts" || sourceType === "open-source";
  // If it's a Google/open-source font, load the font itself; otherwise load the preview equivalent
  const fontToLoad = isGoogleSource ? fontName : previewFont;

  useEffect(() => {
    if (!fontToLoad) {
      // No Google Fonts equivalent available — show immediately with system font
      setLoaded(true);
      return;
    }

    const family = toGoogleFontsFamily(fontToLoad);
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
  }, [fontToLoad]);

  // Build the font-family stack
  const displayFont = fontToLoad || fontName;
  const fontFamily = `"${displayFont}", var(--font-display), Georgia, serif`;

  return (
    <span
      className={className}
      style={{
        fontFamily,
        transition: "opacity 300ms ease",
        opacity: loaded ? 1 : 0.6,
        ...style,
      }}
    >
      {children ?? fontName}
    </span>
  );
}
