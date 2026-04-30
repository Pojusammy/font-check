"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
  ctaHref: string;
  ctaLabel: string;
}

export default function MobileNav({ links, ctaHref, ctaLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [open]);

  return (
    <div ref={ref} className="flex items-center">

      {/* ── Desktop links ──────────────────────── */}
      <div className="hidden sm:flex items-center gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-[#7a7268] hover:text-[#1a1714] px-3 py-1.5 rounded-lg transition-colors"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={ctaHref}
          className="text-sm bg-[#1a1714] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#2e2825] active:scale-[0.97]"
          style={{ transition: "transform 160ms ease-out, background-color 150ms ease" }}
        >
          {ctaLabel}
        </Link>
      </div>

      {/* ── Mobile hamburger ───────────────────── */}
      <div className="sm:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="w-9 h-9 flex flex-col justify-center items-center gap-[5px] rounded-lg hover:bg-[#f0ede8] transition-colors"
        >
          <span
            className="block w-[18px] h-px bg-[#1a1714] origin-center transition-all duration-200"
            style={{ transform: open ? "rotate(45deg) translateY(6px)" : "none" }}
          />
          <span
            className="block w-[18px] h-px bg-[#1a1714] transition-all duration-200"
            style={{ opacity: open ? 0 : 1 }}
          />
          <span
            className="block w-[18px] h-px bg-[#1a1714] origin-center transition-all duration-200"
            style={{ transform: open ? "rotate(-45deg) translateY(-6px)" : "none" }}
          />
        </button>

        {/* Dropdown — fixed so it escapes any overflow constraints */}
        {open && (
          <div
            className="fixed inset-x-0 top-14 z-50 bg-white border-b border-[#e5e1da]"
            style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
          >
            <div className="px-6 py-4 flex flex-col gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-[#4a4540] hover:text-[#1a1714] py-3 border-b border-[#f5f4f1] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={ctaHref}
                onClick={() => setOpen(false)}
                className="mt-3 text-sm bg-[#1a1714] text-white px-4 py-2.5 rounded-full font-medium text-center hover:bg-[#2e2825] transition-colors"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
