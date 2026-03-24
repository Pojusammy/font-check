import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { AdminShell } from "../page";
import IssueReportTable from "@/components/admin/IssueReportTable";

export const metadata: Metadata = { title: "Issues" };

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminIssuesPage({ searchParams }: PageProps) {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");

  const { status: statusFilter, page: pageStr = "1" } = await searchParams;
  const page = parseInt(pageStr, 10);
  const limit = 25;
  const from = (page - 1) * limit;

  const validStatuses = ["open", "reviewed", "resolved", "dismissed"];

  // Issues list query
  let issuesQuery = supabase
    .from("issue_reports")
    .select("*, font:fonts(id, font_name, slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1);

  if (statusFilter && validStatuses.includes(statusFilter)) {
    issuesQuery = issuesQuery.eq("status", statusFilter);
  }

  // Per-status counts
  const [
    { data: issues, count: total },
    { count: openCount },
    { count: reviewedCount },
    { count: resolvedCount },
    { count: dismissedCount },
  ] = await Promise.all([
    issuesQuery,
    supabase.from("issue_reports").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("issue_reports").select("*", { count: "exact", head: true }).eq("status", "reviewed"),
    supabase.from("issue_reports").select("*", { count: "exact", head: true }).eq("status", "resolved"),
    supabase.from("issue_reports").select("*", { count: "exact", head: true }).eq("status", "dismissed"),
  ]);

  const totalPages = Math.ceil((total ?? 0) / limit);
  const allCount = (openCount ?? 0) + (reviewedCount ?? 0) + (resolvedCount ?? 0) + (dismissedCount ?? 0);

  const tabs = [
    { label: "All", value: undefined, count: allCount },
    { label: "Open", value: "open", count: openCount ?? 0 },
    { label: "Reviewed", value: "reviewed", count: reviewedCount ?? 0 },
    { label: "Resolved", value: "resolved", count: resolvedCount ?? 0 },
    { label: "Dismissed", value: "dismissed", count: dismissedCount ?? 0 },
  ];

  return (
    <AdminShell email={session.adminEmail!}>
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Issue reports</h1>
          <p className="text-sm text-[#6b6b6b] mt-0.5">
            User-submitted reports about font data accuracy.
          </p>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-[#e5e5e3] pb-px">
          {tabs.map((tab) => {
            const isActive =
              statusFilter === tab.value || (!statusFilter && tab.value === undefined);
            const href = tab.value ? `/admin/issues?status=${tab.value}` : "/admin/issues";
            return (
              <Link
                key={tab.label}
                href={href}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors relative -mb-px border-b-2 ${
                  isActive
                    ? "text-[#1a1a1a] border-[#1a1a1a]"
                    : "text-[#6b6b6b] border-transparent hover:text-[#1a1a1a]"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[#1a1a1a] text-white"
                        : "bg-[#f0f0ee] text-[#6b6b6b]"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <IssueReportTable issues={issues ?? []} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-[#9b9b9b]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/issues?${statusFilter ? `status=${statusFilter}&` : ""}page=${page - 1}`}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/issues?${statusFilter ? `status=${statusFilter}&` : ""}page=${page + 1}`}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
