import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  const validStatuses = ["open", "reviewed", "resolved", "dismissed"];
  const where =
    statusFilter && validStatuses.includes(statusFilter)
      ? { status: statusFilter as "open" | "reviewed" | "resolved" | "dismissed" }
      : {};

  const [issues, total, counts] = await Promise.all([
    prisma.issueReport.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        font: { select: { id: true, font_name: true, slug: true } },
      },
    }),
    prisma.issueReport.count({ where }),
    prisma.issueReport.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const countMap = Object.fromEntries(counts.map((c) => [c.status, c._count]));
  const totalPages = Math.ceil(total / limit);

  const tabs = [
    { label: "All", value: undefined, count: counts.reduce((a, c) => a + c._count, 0) },
    { label: "Open", value: "open", count: countMap["open"] || 0 },
    { label: "Reviewed", value: "reviewed", count: countMap["reviewed"] || 0 },
    { label: "Resolved", value: "resolved", count: countMap["resolved"] || 0 },
    { label: "Dismissed", value: "dismissed", count: countMap["dismissed"] || 0 },
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

        <IssueReportTable issues={issues} />

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
