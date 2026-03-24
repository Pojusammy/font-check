"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Font } from "@prisma/client";

interface FontFormProps {
  font?: Font;
  mode: "create" | "edit";
}

const licenseStatuses = [
  { value: "allowed", label: "Allowed" },
  { value: "paid_license_required", label: "Paid license required" },
  { value: "not_allowed", label: "Not allowed" },
  { value: "limited", label: "Limited" },
  { value: "unknown", label: "Unknown" },
];

const confidenceLevels = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const sourceTypes = [
  { value: "open_source", label: "Open source" },
  { value: "commercial", label: "Commercial" },
  { value: "proprietary", label: "Proprietary" },
  { value: "system", label: "System font" },
  { value: "other", label: "Other" },
];

export default function FontForm({ font, mode }: FontFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    font_name: font?.font_name || "",
    family_name: font?.family_name || "",
    vendor_name: font?.vendor_name || "",
    source_type: font?.source_type || "commercial",
    official_source_url: font?.official_source_url || "",
    official_license_url: font?.official_license_url || "",
    purchase_url: font?.purchase_url || "",
    personal_use_status: font?.personal_use_status || "unknown",
    commercial_use_status: font?.commercial_use_status || "unknown",
    simplified_summary: font?.simplified_summary || "",
    internal_notes: font?.internal_notes || "",
    confidence_level: font?.confidence_level || "medium",
    is_active: font?.is_active ?? true,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const url =
        mode === "create" ? "/api/v1/admin/fonts" : `/api/v1/admin/fonts/${font!.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        router.push("/admin/fonts");
        router.refresh();
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to save font.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const SelectField = ({
    name,
    label,
    options,
    required = false,
  }: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
    required?: boolean;
  }) => (
    <div>
      <label className="input-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          name={name}
          value={(form as Record<string, unknown>)[name] as string}
          onChange={handleChange}
          className="form-select pr-8"
          required={required}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-[#9b9b9b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-[#1a1a1a]">Basic information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label">
              Font name <span className="text-red-500">*</span>
            </label>
            <input
              name="font_name"
              value={form.font_name}
              onChange={handleChange}
              required
              placeholder="e.g. Helvetica Neue"
              className="form-input"
            />
          </div>
          <div>
            <label className="input-label">Family name</label>
            <input
              name="family_name"
              value={form.family_name}
              onChange={handleChange}
              placeholder="e.g. Helvetica"
              className="form-input"
            />
          </div>
          <div>
            <label className="input-label">Vendor / foundry</label>
            <input
              name="vendor_name"
              value={form.vendor_name}
              onChange={handleChange}
              placeholder="e.g. Linotype"
              className="form-input"
            />
          </div>
          <SelectField name="source_type" label="Source type" options={sourceTypes} />
        </div>
      </div>

      {/* License status */}
      <div className="card p-6 space-y-5">
        <h2 className="font-semibold text-[#1a1a1a]">License status</h2>

        <div className="grid grid-cols-3 gap-4">
          <SelectField
            name="personal_use_status"
            label="Personal use"
            options={licenseStatuses}
            required
          />
          <SelectField
            name="commercial_use_status"
            label="Commercial use"
            options={licenseStatuses}
            required
          />
          <SelectField
            name="confidence_level"
            label="Confidence level"
            options={confidenceLevels}
            required
          />
        </div>

        <div>
          <label className="input-label">Simplified summary</label>
          <textarea
            name="simplified_summary"
            value={form.simplified_summary}
            onChange={handleChange}
            rows={4}
            placeholder="Plain-language description of the license status..."
            className="form-textarea"
          />
        </div>

        <div>
          <label className="input-label">Internal notes</label>
          <textarea
            name="internal_notes"
            value={form.internal_notes}
            onChange={handleChange}
            rows={3}
            placeholder="Admin-only notes, caveats, research sources..."
            className="form-textarea"
          />
        </div>
      </div>

      {/* URLs */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-[#1a1a1a]">Links</h2>

        <div>
          <label className="input-label">Official source URL</label>
          <input
            type="url"
            name="official_source_url"
            value={form.official_source_url}
            onChange={handleChange}
            placeholder="https://..."
            className="form-input"
          />
        </div>
        <div>
          <label className="input-label">Official license URL</label>
          <input
            type="url"
            name="official_license_url"
            value={form.official_license_url}
            onChange={handleChange}
            placeholder="https://..."
            className="form-input"
          />
        </div>
        <div>
          <label className="input-label">Purchase URL</label>
          <input
            type="url"
            name="purchase_url"
            value={form.purchase_url}
            onChange={handleChange}
            placeholder="https://..."
            className="form-input"
          />
        </div>
      </div>

      {/* Active status */}
      {mode === "edit" && (
        <div className="card p-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4 rounded border-[#e5e5e3]"
            />
            <div>
              <p className="text-sm font-medium text-[#1a1a1a]">Active (visible to users)</p>
              <p className="text-xs text-[#9b9b9b]">
                Uncheck to hide this font from public search results
              </p>
            </div>
          </label>
        </div>
      )}

      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={status === "loading"} className="btn-primary">
          {status === "loading"
            ? "Saving..."
            : mode === "create"
            ? "Create font"
            : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/fonts")}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
