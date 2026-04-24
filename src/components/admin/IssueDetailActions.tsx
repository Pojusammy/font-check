"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  issueId: string;
  currentStatus: string;
}

const validStatuses = ["open", "reviewed", "resolved", "dismissed"] as const;

export default function IssueDetailActions({ issueId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(newStatus);
    try {
      await fetch(`/api/v1/admin/issues/${issueId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  };

  const deleteIssue = async () => {
    setLoading("delete");
    try {
      const res = await fetch(`/api/v1/admin/issues/${issueId}`, { method: "DELETE" });
      if (res.ok) {
        window.location.href = "/admin/issues";
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        {validStatuses
          .filter((s) => s !== currentStatus)
          .map((s) => {
            const labels: Record<string, string> = {
              open: "Mark open",
              reviewed: "Mark reviewed",
              resolved: "Mark resolved",
              dismissed: "Dismiss",
            };
            const isPrimary = s === "resolved";
            return (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={loading !== null}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  isPrimary
                    ? "bg-[#1a7a4a] text-white hover:bg-[#145e38]"
                    : "bg-white border border-[#e5e5e3] text-[#6b6b6b] hover:text-[#1a1a1a] hover:border-[#1a1a1a]"
                } disabled:opacity-50`}
              >
                {loading === s ? "Saving…" : labels[s]}
              </button>
            );
          })}
      </div>

      <div>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Delete report
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6b6b6b]">Delete permanently?</span>
            <button
              onClick={deleteIssue}
              disabled={loading === "delete"}
              className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading === "delete" ? "Deleting…" : "Confirm"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-xs text-[#9b9b9b] hover:text-[#6b6b6b] px-2 py-1.5"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
