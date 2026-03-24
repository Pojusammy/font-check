"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { IssueReport, Font, IssueStatus, IssueType } from "@prisma/client";

type IssueWithFont = IssueReport & {
  font: { id: string; font_name: string; slug: string } | null;
};

interface IssueReportTableProps {
  issues: IssueWithFont[];
}

const issueTypeLabels: Record<IssueType, string> = {
  incorrect_license_status: "Incorrect license",
  broken_source_link: "Broken source link",
  broken_purchase_link: "Broken purchase link",
  wrong_font_match: "Wrong font match",
  outdated_information: "Outdated info",
  missing_font: "Missing font",
  other: "Other",
};

const statusConfig: Record<IssueStatus, { label: string; classes: string }> = {
  open: { label: "Open", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  reviewed: { label: "Reviewed", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  resolved: { label: "Resolved", classes: "bg-green-50 text-green-700 border-green-200" },
  dismissed: { label: "Dismissed", classes: "bg-gray-50 text-gray-500 border-gray-200" },
};

export default function IssueReportTable({ issues }: IssueReportTableProps) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, newStatus: IssueStatus) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/v1/admin/issues/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  if (issues.length === 0) {
    return (
      <div className="card p-12 text-center">
        <p className="text-[#9b9b9b]">No issue reports found.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e5e5e3] bg-[#f8f8f6]">
            <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
              Font
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
              Type
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
              Message
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
              Status
            </th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
              Date
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {issues.map((issue, i) => {
            const sc = statusConfig[issue.status];
            return (
              <tr
                key={issue.id}
                className={`border-b border-[#f0f0ee] hover:bg-[#f8f8f6] transition-colors ${
                  i === issues.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-3">
                  {issue.font ? (
                    <a
                      href={`/font/${issue.font.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-[#1a1a1a] hover:underline"
                    >
                      {issue.font.font_name}
                    </a>
                  ) : (
                    <span className="text-[#9b9b9b]">
                      {issue.search_query ? `"${issue.search_query}"` : "—"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-[#6b6b6b]">
                  {issueTypeLabels[issue.issue_type]}
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-[#6b6b6b] truncate" title={issue.message}>
                    {issue.message}
                  </p>
                  {issue.user_email && (
                    <p className="text-xs text-[#9b9b9b] mt-0.5">{issue.user_email}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${sc.classes}`}
                  >
                    {sc.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#9b9b9b] whitespace-nowrap">
                  {new Date(issue.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {issue.status === "open" && (
                      <>
                        <button
                          onClick={() => updateStatus(issue.id, "reviewed")}
                          disabled={updatingId === issue.id}
                          className="text-xs text-[#6b6b6b] hover:text-[#1a1a1a] px-2 py-1 rounded-lg hover:bg-[#f0f0ee] transition-colors"
                        >
                          Review
                        </button>
                        <button
                          onClick={() => updateStatus(issue.id, "dismissed")}
                          disabled={updatingId === issue.id}
                          className="text-xs text-[#9b9b9b] hover:text-[#6b6b6b] px-2 py-1 rounded-lg hover:bg-[#f0f0ee] transition-colors"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                    {issue.status === "reviewed" && (
                      <button
                        onClick={() => updateStatus(issue.id, "resolved")}
                        disabled={updatingId === issue.id}
                        className="text-xs text-[#1a7a4a] hover:text-[#1a5a3a] px-2 py-1 rounded-lg hover:bg-[#f0faf4] transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
