import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "../../page";
import FontForm from "@/components/admin/FontForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const font = await prisma.font.findUnique({ where: { id } });
  return { title: font ? `Edit ${font.font_name}` : "Edit Font" };
}

export default async function AdminEditFontPage({ params }: PageProps) {
  const session = await requireAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const font = await prisma.font.findUnique({
    where: { id },
    include: { aliases: true },
  });

  if (!font) notFound();

  return (
    <AdminShell email={session.adminEmail!}>
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8">
          <Link
            href="/admin/fonts"
            className="inline-flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-6"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to fonts
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">{font.font_name}</h1>
              <p className="text-[#9b9b9b] text-sm mt-0.5">/{font.slug}</p>
            </div>
            <Link
              href={`/font/${font.slug}`}
              target="_blank"
              className="text-xs text-[#6b6b6b] hover:text-[#1a1a1a] border border-[#e5e5e3] px-3 py-1.5 rounded-lg hover:bg-[#f5f5f3] transition-all"
            >
              View public page ↗
            </Link>
          </div>
        </div>

        <FontForm font={font} mode="edit" />
      </div>
    </AdminShell>
  );
}
