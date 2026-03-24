import type { LicenseStatus, ConfidenceLevel } from "@prisma/client";

export interface LicenseInterpretation {
  headline: string;
  summary: string;
  personalColor: "green" | "amber" | "red" | "slate";
  commercialColor: "green" | "amber" | "red" | "slate";
  overallSeverity: "free" | "limited" | "paid" | "restricted" | "unknown";
}

function statusColor(status: LicenseStatus): "green" | "amber" | "red" | "slate" {
  switch (status) {
    case "allowed":
      return "green";
    case "limited":
      return "amber";
    case "paid_license_required":
      return "amber";
    case "not_allowed":
      return "red";
    case "unknown":
    default:
      return "slate";
  }
}

export function interpretLicense(
  personalStatus: LicenseStatus,
  commercialStatus: LicenseStatus,
  confidenceLevel: ConfidenceLevel,
  customSummary?: string | null
): LicenseInterpretation {
  const personalColor = statusColor(personalStatus);
  const commercialColor = statusColor(commercialStatus);

  let overallSeverity: LicenseInterpretation["overallSeverity"];

  if (confidenceLevel === "low" || (personalStatus === "unknown" && commercialStatus === "unknown")) {
    overallSeverity = "unknown";
  } else if (personalStatus === "not_allowed" || commercialStatus === "not_allowed") {
    overallSeverity = "restricted";
  } else if (
    personalStatus === "paid_license_required" ||
    commercialStatus === "paid_license_required"
  ) {
    overallSeverity = "paid";
  } else if (personalStatus === "limited" || commercialStatus === "limited") {
    overallSeverity = "limited";
  } else if (personalStatus === "allowed" && commercialStatus === "allowed") {
    overallSeverity = "free";
  } else {
    overallSeverity = "unknown";
  }

  // Use custom summary if provided
  if (customSummary) {
    const headline = getHeadline(personalStatus, commercialStatus, confidenceLevel, overallSeverity);
    return {
      headline,
      summary: customSummary,
      personalColor,
      commercialColor,
      overallSeverity,
    };
  }

  // Generate summary from logic
  const { headline, summary } = generateSummary(
    personalStatus,
    commercialStatus,
    confidenceLevel,
    overallSeverity
  );

  return { headline, summary, personalColor, commercialColor, overallSeverity };
}

function getHeadline(
  personal: LicenseStatus,
  commercial: LicenseStatus,
  confidence: ConfidenceLevel,
  severity: LicenseInterpretation["overallSeverity"]
): string {
  if (severity === "free") return "Free to use";
  if (severity === "restricted") return "Not permitted";
  if (severity === "paid") return "Paid license required";
  if (severity === "limited") return "Limited use";
  return "License unclear";
}

function generateSummary(
  personal: LicenseStatus,
  commercial: LicenseStatus,
  confidence: ConfidenceLevel,
  severity: LicenseInterpretation["overallSeverity"]
): { headline: string; summary: string } {
  // Case D: confidence low or both unknown
  if (confidence === "low" || severity === "unknown") {
    return {
      headline: "License unclear",
      summary:
        "We could not confirm the licensing for this font clearly enough to give a reliable answer. We recommend checking the font's official website or contacting the type foundry directly before using it in any project.",
    };
  }

  // Case A: personal=allowed, commercial=paid_license_required
  if (personal === "allowed" && commercial === "paid_license_required") {
    return {
      headline: "Free for personal use",
      summary:
        "You can use this font for personal projects at no cost. For business, client, or commercial work, you will likely need to purchase a license from the font's publisher.",
    };
  }

  // Case B: both allowed
  if (personal === "allowed" && commercial === "allowed") {
    const confidenceNote =
      confidence === "medium"
        ? " based on the source we reviewed — please verify if you have any doubt."
        : ".";
    return {
      headline: "Free to use",
      summary: `This font is free for both personal and commercial use${confidenceNote}`,
    };
  }

  // Case C: commercial=limited
  if (commercial === "limited") {
    return {
      headline: "Limited use",
      summary:
        "This font may have different rules depending on how you intend to use it. Some uses are permitted, others may require a license or be restricted. Check the official license document before using it commercially.",
    };
  }

  // Both paid
  if (personal === "paid_license_required" && commercial === "paid_license_required") {
    return {
      headline: "Paid license required",
      summary:
        "This font requires a paid license for all uses — personal and commercial. You must purchase a license before using it in any project.",
    };
  }

  // Not allowed
  if (personal === "not_allowed" || commercial === "not_allowed") {
    return {
      headline: "Not permitted",
      summary:
        "Use of this font is not permitted under its standard license. Contact the font's publisher for specific licensing inquiries.",
    };
  }

  // Limited personal
  if (personal === "limited") {
    return {
      headline: "Limited use",
      summary:
        "This font has usage restrictions. Some uses may be permitted while others require a paid license or are not allowed. Review the official license carefully before using it.",
    };
  }

  return {
    headline: "License unclear",
    summary:
      "We do not have enough information to give a clear answer about this font's licensing. Check the official font source.",
  };
}

export function getLicenseStatusLabel(status: LicenseStatus): string {
  switch (status) {
    case "allowed":
      return "Allowed";
    case "paid_license_required":
      return "Paid license required";
    case "not_allowed":
      return "Not allowed";
    case "limited":
      return "Limited";
    case "unknown":
      return "Unknown";
  }
}

export function getConfidenceLabel(level: ConfidenceLevel): string {
  switch (level) {
    case "high":
      return "High confidence";
    case "medium":
      return "Medium confidence";
    case "low":
      return "Low confidence";
  }
}
