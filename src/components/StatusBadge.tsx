import type { LicenseStatus } from "@prisma/client";

interface StatusBadgeProps {
  status: LicenseStatus;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<
  LicenseStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  allowed: {
    label: "Allowed",
    color: "#1e7a4e",
    bg: "#edf7f2",
    border: "#b6e0ca",
  },
  paid_license_required: {
    label: "Paid license",
    color: "#b85a3a",
    bg: "#fdf0eb",
    border: "#e8bfb0",
  },
  not_allowed: {
    label: "Not allowed",
    color: "#9e3a52",
    bg: "#fdeef2",
    border: "#e8b4c0",
  },
  limited: {
    label: "Limited",
    color: "#8a6320",
    bg: "#fdf6e7",
    border: "#e8d4a0",
  },
  unknown: {
    label: "Unknown",
    color: "#5a5a62",
    bg: "#f3f3f5",
    border: "#d0d0d8",
  },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];

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
      className={`inline-flex items-center rounded-full font-medium ${paddingClass} ${shouldPulse ? "badge-pulse" : ""}`}
      style={{
        color: config.color,
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
      }}
    >
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: dotSize,
          height: dotSize,
          backgroundColor: config.color,
          display: "inline-block",
        }}
      />
      {config.label}
    </span>
  );
}
