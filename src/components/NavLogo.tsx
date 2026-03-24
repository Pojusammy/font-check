import Link from "next/link";
import Image from "next/image";

export default function NavLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group">
      <Image
        src="/logo-mark.svg"
        alt="Font.Check logo"
        width={22}
        height={25}
        className="flex-shrink-0"
        priority
      />
      <span className="font-display text-[#1a1714] font-semibold text-base tracking-tight">
        Font<span className="text-[#d4a853]">.</span>Check
      </span>
    </Link>
  );
}
