import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const [
    { count: totalFonts },
    { count: activeFonts },
    { count: openIssues },
    { count: totalIssues },
  ] = await Promise.all([
    supabase.from("fonts").select("*", { count: "exact", head: true }),
    supabase.from("fonts").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("issue_reports").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("issue_reports").select("*", { count: "exact", head: true }),
  ]);
  return {
    totalFonts: totalFonts ?? 0,
    activeFonts: activeFonts ?? 0,
    openIssues: openIssues ?? 0,
    totalIssues: totalIssues ?? 0,
  };
}

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");

  const stats = await getStats();

  const navItems = [
    { href: "/admin/fonts", label: "Manage fonts", icon: "T", count: stats.activeFonts },
    { href: "/admin/fonts/new", label: "Add font", icon: "+", count: null },
    { href: "/admin/issues", label: "Issue queue", icon: "!", count: stats.openIssues || null },
  ];

  return (
    <AdminShell email={session.adminEmail!}>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Dashboard</h1>
          <p className="text-[#6b6b6b] mt-1">Manage font records and review issue reports.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total fonts",   value: stats.totalFonts,  href: "/admin/fonts" },
            { label: "Active fonts",  value: stats.activeFonts, href: "/admin/fonts" },
            { label: "Open issues",   value: stats.openIssues,  href: "/admin/issues" },
            { label: "Total reports", value: stats.totalIssues, href: "/admin/issues" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="card p-4 hover:shadow-card-hover transition-shadow"
            >
              <p className="text-2xl font-bold text-[#1a1a1a]">{stat.value}</p>
              <p className="text-xs text-[#9b9b9b] mt-0.5">{stat.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick nav */}
        <div className="grid sm:grid-cols-3 gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="card p-5 hover:shadow-card-hover transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-[#f5f5f3] flex items-center justify-center text-[#1a1a1a] text-sm font-bold group-hover:bg-[#1a1a1a] group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                {item.count != null && (
                  <span className="text-xs font-medium text-[#6b6b6b] bg-[#f5f5f3] px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
              <p className="font-medium text-[#1a1a1a] mt-3">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}

// Shared admin shell nav — exported for use by other admin pages
export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[#e5e5e3] bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold text-[#1a1a1a] text-sm">
              Admin
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin/fonts"
                className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
              >
                Fonts
              </Link>
              <Link
                href="/admin/issues"
                className="text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors"
              >
                Issues
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#9b9b9b]">{email}</span>
            <Link href="/" className="text-xs text-[#6b6b6b] hover:text-[#1a1a1a]">
              View site
            </Link>
            <AdminLogoutLink />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function AdminLogoutLink() {
  return (
    <Link
      href="/admin/logout"
      className="text-xs text-[#9b9b9b] hover:text-red-500 transition-colors"
    >
      Sign out
    </Link>
  );
}
