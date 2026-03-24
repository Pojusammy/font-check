import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../StatusBadge";

describe("StatusBadge", () => {
  describe("labels", () => {
    it("renders 'Allowed' for allowed status", () => {
      render(<StatusBadge status="allowed" />);
      expect(screen.getByText("Allowed")).toBeInTheDocument();
    });

    it("renders 'Paid license' for paid_license_required", () => {
      render(<StatusBadge status="paid_license_required" />);
      expect(screen.getByText("Paid license")).toBeInTheDocument();
    });

    it("renders 'Not allowed' for not_allowed", () => {
      render(<StatusBadge status="not_allowed" />);
      expect(screen.getByText("Not allowed")).toBeInTheDocument();
    });

    it("renders 'Limited' for limited", () => {
      render(<StatusBadge status="limited" />);
      expect(screen.getByText("Limited")).toBeInTheDocument();
    });

    it("renders 'Unknown' for unknown", () => {
      render(<StatusBadge status="unknown" />);
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });

    it("falls back to 'Unknown' for an unrecognised status", () => {
      render(<StatusBadge status="not_a_real_status" />);
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
  });

  describe("pulse animation", () => {
    it("applies badge-pulse class to paid_license_required", () => {
      const { container } = render(<StatusBadge status="paid_license_required" />);
      expect(container.firstChild).toHaveClass("badge-pulse");
    });

    it("applies badge-pulse class to not_allowed", () => {
      const { container } = render(<StatusBadge status="not_allowed" />);
      expect(container.firstChild).toHaveClass("badge-pulse");
    });

    it("does not apply badge-pulse to allowed", () => {
      const { container } = render(<StatusBadge status="allowed" />);
      expect(container.firstChild).not.toHaveClass("badge-pulse");
    });

    it("does not apply badge-pulse to limited", () => {
      const { container } = render(<StatusBadge status="limited" />);
      expect(container.firstChild).not.toHaveClass("badge-pulse");
    });
  });

  describe("sizing", () => {
    it("uses sm padding classes for size='sm'", () => {
      const { container } = render(<StatusBadge status="allowed" size="sm" />);
      expect(container.firstChild).toHaveClass("px-2", "py-0.5", "text-xs");
    });

    it("uses md padding classes for size='md' (default)", () => {
      const { container } = render(<StatusBadge status="allowed" />);
      expect(container.firstChild).toHaveClass("px-2.5", "py-1", "text-xs");
    });

    it("uses lg padding classes for size='lg'", () => {
      const { container } = render(<StatusBadge status="allowed" size="lg" />);
      expect(container.firstChild).toHaveClass("px-3.5", "py-1.5", "text-sm");
    });
  });

  describe("color classes", () => {
    it("applies green classes for allowed", () => {
      const { container } = render(<StatusBadge status="allowed" />);
      expect(container.firstChild).toHaveClass("text-[#1e7a4e]");
    });

    it("applies paid classes for paid_license_required", () => {
      const { container } = render(<StatusBadge status="paid_license_required" />);
      expect(container.firstChild).toHaveClass("text-[#b85a3a]");
    });

    it("applies red classes for not_allowed", () => {
      const { container } = render(<StatusBadge status="not_allowed" />);
      expect(container.firstChild).toHaveClass("text-[#9e3a52]");
    });
  });
});
