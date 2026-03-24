type LicenseStatus = "allowed" | "paid_license_required" | "not_allowed" | "limited" | "unknown";

interface StatusBadgeProps {
  status: LicenseStatus | string;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<
  string,
  { label: string; classes: string; dotClasses: string }
> = {
  allowed: {
    label: "Allowed",
    classes: "text-[#1e7a4e] bg-[#edf7f2] border-[#b6e0ca] dark:text-[#4ade96] dark:bg-[#071a0e] dark:border-[#0f3d20]",
    dotClasses: "bg-[#1e7a4e] dark:bg-[#4ade96]",
  },
  paid_license_required: {
    label: "Paid license",
    classes: "text-[#b85a3a] bg-[#fdf0eb] border-[#e8bfb0] dark:text-[#f08060] dark:bg-[#200c06] dark:border-[#4a1e10]",
    dotClasses: "bg-[#b85a3a] dark:bg-[#f08060]",
  },
  not_allowed: {
    label: "Not allowed",
    classes: "text-[#9e3a52] bg-[#fdeef2] border-[#e8b4c0] dark:text-[#f06080] dark:bg-[#1e060e] dark:border-[#481020]",
    dotClasses: "bg-[#9e3a52] dark:bg-[#f06080]",
  },
  limited: {
    label: "Limited",
    classes: "text-[#8a6320] bg-[#fdf6e7] border-[#e8d4a0] dark:text-[#d4a853] dark:bg-[#1e1506] dark:border-[#4a3810]",
    dotClasses: "bg-[#8a6320] dark:bg-[#d4a853]",
  },
  unknown: {
    label: "Unknown",
    classes: "text-[#5a5a62] bg-[#f3f3f5] border-[#d0d0d8] dark:text-[#9090a0] dark:bg-[#16161c] dark:border-[#2e2e3a]",
    dotClasses: "bg-[#5a5a62] dark:bg-[#9090a0]",
  },
};

const fallback = statusConfig.unknown;

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] ?? fallback;

  const dotSize = size === "lg" ? "6px" : "5px";
  const paddingClass =
    size === "sm"
      ? "px-2 py-0.5 text-xs gap-1"
      : size === "lg"
      ? "px-3.5 py-1.5 text-sm gap-2"
      : "px-2.5 py-1 text-xs gap-1.5";

  const shouldPulse = status === "paid_license_required" || status === "not_allowed";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border transition-colors duration-250 ${paddingClass} ${config.classes} ${shouldPulse ? "badge-pulse" : ""}`}
    >
      <span
        className={`rounded-full flex-shrink-0 ${config.dotClasses}`}
        style={{ width: dotSize, height: dotSize, display: "inline-block" }}
      />
      {config.label}
    </span>
  );
}
