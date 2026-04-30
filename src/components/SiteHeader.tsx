import NavLogo from "./NavLogo";
import MobileNav from "./MobileNav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e5e1da]">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <NavLogo />
        <MobileNav
          links={[
            { href: "/browse", label: "Browse" },
            { href: "/about",  label: "About"  },
          ]}
          ctaHref="/report"
          ctaLabel="Report issue"
        />
      </div>
    </header>
  );
}
