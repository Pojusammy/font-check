import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "../../page";
import IssueDetailActions from "@/components/admin/IssueDetailActions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Issue Detail" };

interface PageProps {
  params: Promise<{ id: string }>;
}

const issueTypeLabels: Record<string, string> = {
  incorrect_license_status: "Incorrect license",
  broken_source_link: "Broken source link",
  broken_purchase_link: "Broken purchase link",
  wrong_font_match: "Wrong font match",
  outdated_information: "Outdated info",
  missing_font: "Missing font",
  other: "Other",
};

const statusConfig: Record<string, { label: string; classes: string }> = {
  open: { label: "Open", classes: "bg-blue-50 text-blue-700 border-blue-200" },
  reviewed: { label: "Reviewed", classes: "bg-amber-50 text-amber-700 border-amber-200" },
  resolved: { label: "Resolved", classes: "bg-green-50 text-green-700 border-green-200" },
  dismissed: { label: "Dismissed", classes: "bg-gray-50 text-gray-500 border-gray-200" },
};

export default async function IssueDetailPage({ params }: PageProps) {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const { data: issue, error } = await supabase
    .from("issue_reports")
    .select("*, font:fonts(id, font_name, slug)")
    .eq("id", id)
    .single();

  if (error || !issue) notFound();

  const sc = statusConfig[issue.status] ?? statusConfig.open;

  return (
    <AdminShell email={session.adminEmail!}>
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        {/* Back */}
        <Link
          href="/admin/issues"
          className="inline-flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] mb-6 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to issues
        </Link>

        <div className="card overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#f0f0ee] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${sc.classes}`}
                >
                  {sc.label}
                </span>
                <span className="text-xs text-[#9b9b9b]">
                  {issueTypeLabels[issue.issue_type] ?? issue.issue_type}
                </span>
              </div>
              <h1 className="text-lg font-semibold text-[#1a1a1a]">
                {issue.font
                  ? issue.font.font_name
                  : issue.search_query
                  ? `"${issue.search_query}"`
                  : "Unknown font"}
              </h1>
              <p className="text-xs text-[#9b9b9b] mt-0.5">
                Submitted{" "}
                {new Date(issue.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                {issue.user_email && ` · ${issue.user_email}`}
              </p>
            </div>
            {issue.font && (
              <a
                href={`/font/${issue.font.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#6b6b6b] hover:text-[#1a1a1a] whitespace-nowrap transition-colors"
              >
                View font →
              </a>
            )}
          </div>

          {/* Message */}
          <div className="px-6 py-5 border-b border-[#f0f0ee]">
            <p className="text-xs text-[#9b9b9b] uppercase tracking-wide mb-2">Message</p>
            <p className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">
              {issue.message || <span className="text-[#9b9b9b] italic">No message provided</span>}
            </p>
          </div>

          {/* Meta */}
          <div className="px-6 py-5 border-b border-[#f0f0ee] grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#9b9b9b] uppercase tracking-wide mb-1">Issue ID</p>
              <p className="text-[#6b6b6b] font-mono text-xs break-all">{issue.id}</p>
            </div>
            {issue.search_query && (
              <div>
                <p className="text-xs text-[#9b9b9b] uppercase tracking-wide mb-1">Search query</p>
                <p className="text-[#6b6b6b]">{issue.search_query}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-[#f8f8f6]">
            <IssueDetailActions issueId={issue.id} currentStatus={issue.status} />
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
