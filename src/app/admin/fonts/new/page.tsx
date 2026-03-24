import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { AdminShell } from "../../page";
import FontForm from "@/components/admin/FontForm";

export const metadata: Metadata = { title: "Add Font" };

export default async function AdminNewFontPage() {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell email={session.adminEmail!}>
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href="/admin/fonts"
            className="inline-flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to fonts
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">Add font</h1>
          <p className="text-[#6b6b6b] mt-1">Create a new font license record.</p>
        </div>

        <FontForm mode="create" />
      </div>
    </AdminShell>
  );
}
