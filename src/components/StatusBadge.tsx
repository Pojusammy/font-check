type LicenseStatus = "allowed" | "paid_license_required" | "not_allowed" | "limited" | "unknown";

interface StatusBadgeProps {
  status: LicenseStatus | string;
  size?: "sm" | "md" | "lg";
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
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

const fallback = statusConfig.unknown;

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status] ?? fallback;

  const dotSize = size === "lg" ? "6px" : "5px";
  const padding =
    size === "sm"
      ? { padding: "2px 8px", fontSize: "0.7rem", gap: "5px" }
      : size === "lg"
      ? { padding: "6px 14px", fontSize: "0.875rem", gap: "8px" }
      : { padding: "4px 10px", fontSize: "0.75rem", gap: "6px" };

  const shouldPulse = status === "paid_license_required" || status === "not_allowed";

  return (
    <span
      className={shouldPulse ? "badge-pulse" : ""}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: padding.gap,
        padding: padding.padding,
        fontSize: padding.fontSize,
        fontWeight: 500,
        borderRadius: 9999,
        border: `1px solid ${config.border}`,
        background: config.bg,
        color: config.color,
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          background: config.color,
          flexShrink: 0,
          display: "inline-block",
        }}
      />
      {config.label}
    </span>
  );
}
