"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReportIssueFormProps {
  fontId?: string;
  fontName?: string;
  searchQuery?: string;
}

const issueTypes = [
  { value: "incorrect_license_status", label: "Incorrect license status" },
  { value: "broken_source_link", label: "Broken source link" },
  { value: "broken_purchase_link", label: "Broken purchase link" },
  { value: "wrong_font_match", label: "Wrong font match" },
  { value: "outdated_information", label: "Outdated information" },
  { value: "missing_font", label: "Missing font" },
  { value: "other", label: "Other" },
];

export default function ReportIssueForm({ fontId, fontName, searchQuery }: ReportIssueFormProps) {
  const [form, setForm] = useState({
    issue_type: "",
    message: "",
    user_email: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.issue_type || !form.message) {
      setErrorMsg("Please select an issue type and provide a description.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          font_id: fontId,
          search_query: searchQuery,
          issue_type: form.issue_type,
          message: form.message,
          user_email: form.user_email || undefined,
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="card p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#f0faf4] border border-[#bbf0d4] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-[#1a7a4a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">Report submitted</h3>
        <p className="text-[#6b6b6b] mb-6">
          Thank you for helping us keep this information accurate. We&apos;ll review your report.
        </p>
        <button onClick={() => router.back()} className="btn-secondary text-sm">
          Go back
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      {fontName && (
        <div className="bg-[#f8f8f6] border border-[#e5e5e3] rounded-xl px-4 py-3">
          <p className="text-xs text-[#9b9b9b] mb-0.5">Reporting issue for</p>
          <p className="font-medium text-[#1a1a1a]">{fontName}</p>
        </div>
      )}

      {/* Issue type */}
      <div>
        <label htmlFor="issue_type" className="input-label">
          Issue type <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="issue_type"
            name="issue_type"
            value={form.issue_type}
            onChange={handleChange}
            required
            className="form-select pr-8"
          >
            <option value="">Select an issue type</option>
            {issueTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
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

      {/* Message */}
      <div>
        <label htmlFor="message" className="input-label">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          minLength={10}
          maxLength={2000}
          rows={4}
          placeholder="Please describe the issue in detail. What is incorrect? What should it say?"
          className="form-textarea"
        />
        <p className="text-xs text-[#9b9b9b] mt-1">{form.message.length}/2000</p>
      </div>

      {/* Email (optional) */}
      <div>
        <label htmlFor="user_email" className="input-label">
          Your email <span className="text-[#9b9b9b] font-normal">(optional)</span>
        </label>
        <input
          type="email"
          id="user_email"
          name="user_email"
          value={form.user_email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="form-input"
        />
        <p className="text-xs text-[#9b9b9b] mt-1">
          Only used to follow up if we need more information.
        </p>
      </div>

      {errorMsg && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? "Submitting..." : "Submit report"}
      </button>
    </form>
  );
}
