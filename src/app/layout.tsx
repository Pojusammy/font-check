import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Font License Checker",
    template: "%s | Font License Checker",
  },
  description:
    "Quickly look up whether a font is free to use, requires a paid license, or has restrictions. Clear, plain-language licensing summaries for designers and developers.",
  keywords: ["font license", "font checker", "free fonts", "commercial font license", "typography"],
  openGraph: {
    type: "website",
    title: "Font License Checker",
    description: "Look up font licensing info quickly. Is this font free to use?",
    siteName: "Font License Checker",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable}`}>
      <body className="min-h-screen bg-[#f5f4f1] text-[#1a1714] font-sans">
        {children}
      </body>
    </html>
  );
}
