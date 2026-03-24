import { describe, it, expect } from "vitest";
import {
  interpretLicense,
  getLicenseStatusLabel,
  getConfidenceLabel,
} from "../license-interpreter";

// Use string literals matching the Prisma enum values
type Status = "allowed" | "paid_license_required" | "not_allowed" | "limited" | "unknown";
type Confidence = "high" | "medium" | "low";

describe("interpretLicense", () => {
  describe("overallSeverity", () => {
    it("is 'free' when both personal and commercial are allowed", () => {
      const result = interpretLicense("allowed", "allowed", "high");
      expect(result.overallSeverity).toBe("free");
    });

    it("is 'paid' when commercial requires paid license", () => {
      const result = interpretLicense("allowed", "paid_license_required", "high");
      expect(result.overallSeverity).toBe("paid");
    });

    it("is 'paid' when both personal and commercial require paid license", () => {
      const result = interpretLicense("paid_license_required", "paid_license_required", "high");
      expect(result.overallSeverity).toBe("paid");
    });

    it("is 'restricted' when commercial is not_allowed", () => {
      const result = interpretLicense("allowed", "not_allowed", "high");
      expect(result.overallSeverity).toBe("restricted");
    });

    it("is 'restricted' when personal is not_allowed", () => {
      const result = interpretLicense("not_allowed", "allowed", "high");
      expect(result.overallSeverity).toBe("restricted");
    });

    it("is 'limited' when commercial is limited", () => {
      const result = interpretLicense("allowed", "limited", "high");
      expect(result.overallSeverity).toBe("limited");
    });

    it("is 'unknown' when both statuses are unknown", () => {
      const result = interpretLicense("unknown", "unknown", "medium");
      expect(result.overallSeverity).toBe("unknown");
    });

    it("is 'unknown' when confidence is low regardless of statuses", () => {
      const result = interpretLicense("allowed", "allowed", "low");
      expect(result.overallSeverity).toBe("unknown");
    });
  });

  describe("colors", () => {
    it("returns green for allowed personal use", () => {
      const result = interpretLicense("allowed", "allowed", "high");
      expect(result.personalColor).toBe("green");
      expect(result.commercialColor).toBe("green");
    });

    it("returns red for not_allowed commercial", () => {
      const result = interpretLicense("allowed", "not_allowed", "high");
      expect(result.commercialColor).toBe("red");
    });

    it("returns amber for paid_license_required", () => {
      const result = interpretLicense("paid_license_required", "paid_license_required", "high");
      expect(result.personalColor).toBe("amber");
      expect(result.commercialColor).toBe("amber");
    });

    it("returns amber for limited", () => {
      const result = interpretLicense("limited", "limited", "high");
      expect(result.personalColor).toBe("amber");
    });

    it("returns slate for unknown", () => {
      const result = interpretLicense("unknown", "unknown", "medium");
      expect(result.personalColor).toBe("slate");
      expect(result.commercialColor).toBe("slate");
    });
  });

  describe("summary generation", () => {
    it("generates free-use summary for allowed + allowed (high confidence)", () => {
      const result = interpretLicense("allowed", "allowed", "high");
      expect(result.summary).toContain("free for both personal and commercial");
    });

    it("adds a confidence note for medium confidence", () => {
      const result = interpretLicense("allowed", "allowed", "medium");
      expect(result.summary).toContain("please verify");
    });

    it("generates personal-only summary for allowed + paid_license_required", () => {
      const result = interpretLicense("allowed", "paid_license_required", "high");
      expect(result.summary).toContain("personal projects");
      expect(result.summary).toContain("purchase a license");
    });

    it("generates paid-for-all summary when both require paid license", () => {
      const result = interpretLicense("paid_license_required", "paid_license_required", "high");
      expect(result.summary).toContain("paid license for all uses");
    });

    it("generates not-permitted summary for not_allowed", () => {
      const result = interpretLicense("allowed", "not_allowed", "high");
      expect(result.summary).toContain("not permitted");
    });

    it("generates unclear summary for low confidence", () => {
      const result = interpretLicense("allowed", "allowed", "low");
      expect(result.summary).toContain("could not confirm");
    });

    it("uses customSummary when provided, overriding generated text", () => {
      const custom = "Custom license summary for testing.";
      const result = interpretLicense("allowed", "allowed", "high", custom);
      expect(result.summary).toBe(custom);
    });

    it("still computes severity correctly when customSummary is provided", () => {
      const result = interpretLicense("allowed", "allowed", "high", "Custom text.");
      expect(result.overallSeverity).toBe("free");
    });
  });

  describe("headline", () => {
    it("returns 'Free to use' for fully free fonts", () => {
      const result = interpretLicense("allowed", "allowed", "high", "custom");
      expect(result.headline).toBe("Free to use");
    });

    it("returns 'Paid license required' for paid fonts", () => {
      const result = interpretLicense("paid_license_required", "paid_license_required", "high", "custom");
      expect(result.headline).toBe("Paid license required");
    });

    it("returns 'Not permitted' for restricted fonts", () => {
      const result = interpretLicense("not_allowed", "not_allowed", "high", "custom");
      expect(result.headline).toBe("Not permitted");
    });

    it("returns 'Limited use' for limited fonts", () => {
      const result = interpretLicense("allowed", "limited", "high", "custom");
      expect(result.headline).toBe("Limited use");
    });

    it("returns 'License unclear' for unknown severity", () => {
      const result = interpretLicense("unknown", "unknown", "medium", "custom");
      expect(result.headline).toBe("License unclear");
    });
  });
});

describe("getLicenseStatusLabel", () => {
  it.each([
    ["allowed", "Allowed"],
    ["paid_license_required", "Paid license required"],
    ["not_allowed", "Not allowed"],
    ["limited", "Limited"],
    ["unknown", "Unknown"],
  ] as [Status, string][])(
    "returns '%s' label for status '%s'",
    (status, expected) => {
      expect(getLicenseStatusLabel(status as never)).toBe(expected);
    }
  );
});

describe("getConfidenceLabel", () => {
  it.each([
    ["high", "High confidence"],
    ["medium", "Medium confidence"],
    ["low", "Low confidence"],
  ] as [Confidence, string][])(
    "returns '%s' for confidence '%s'",
    (level, expected) => {
      expect(getConfidenceLabel(level as never)).toBe(expected);
    }
  );
});
