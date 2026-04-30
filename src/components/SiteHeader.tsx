import NavContent from "./NavContent";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#e5e1da]">
      <div className="max-w-6xl mx-auto px-6">
        <NavContent />
      </div>
    </header>
  );
}
