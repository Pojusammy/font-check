import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../page";
import StatusBadge from "@/components/StatusBadge";

export const metadata: Metadata = { title: "Fonts" };

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminFontsPage({ searchParams }: PageProps) {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");

  const { q = "", page: pageStr = "1" } = await searchParams;
  const page = parseInt(pageStr, 10);
  const limit = 25;

  const where = q
    ? {
        OR: [
          { font_name: { contains: q, mode: "insensitive" as const } },
          { vendor_name: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [fonts, total] = await Promise.all([
    prisma.font.findMany({
      where,
      orderBy: { font_name: "asc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.font.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminShell email={session.adminEmail!}>
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">Fonts</h1>
            <p className="text-sm text-[#6b6b6b] mt-0.5">{total} font records</p>
          </div>
          <Link href="/admin/fonts/new" className="btn-primary text-sm">
            Add font
          </Link>
        </div>

        {/* Search */}
        <form className="mb-6">
          <div className="relative max-w-xs">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search fonts..."
              className="form-input pl-9 text-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-[#9b9b9b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </form>

        {/* Table */}
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e5e5e3] bg-[#f8f8f6]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
                  Font
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
                  Vendor
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
                  Personal
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
                  Commercial
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
                  Confidence
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#9b9b9b] uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {fonts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[#9b9b9b]">
                    No fonts found
                  </td>
                </tr>
              ) : (
                fonts.map((font, i) => (
                  <tr
                    key={font.id}
                    className={`border-b border-[#f0f0ee] hover:bg-[#f8f8f6] transition-colors ${
                      i === fonts.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1a1a1a]">{font.font_name}</p>
                      <p className="text-xs text-[#9b9b9b]">{font.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-[#6b6b6b]">{font.vendor_name || "—"}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={font.personal_use_status} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={font.commercial_use_status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6b6b6b] capitalize">
                      {font.confidence_level}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                          font.is_active
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-gray-50 text-gray-400 border-gray-200"
                        }`}
                      >
                        {font.is_active ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/fonts/${font.id}`}
                        className="text-xs text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-[#9b9b9b]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/fonts?q=${q}&page=${page - 1}`}
                  className="btn-secondary text-xs py-1.5 px-3"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/fonts?q=${q}&page=${page + 1}`}
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
