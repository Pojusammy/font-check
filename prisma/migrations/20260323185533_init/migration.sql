-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('allowed', 'paid_license_required', 'not_allowed', 'limited', 'unknown');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('incorrect_license_status', 'broken_source_link', 'broken_purchase_link', 'wrong_font_match', 'outdated_information', 'missing_font', 'other');

-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('open', 'reviewed', 'resolved', 'dismissed');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('admin', 'super_admin');

-- CreateTable
CREATE TABLE "fonts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "font_name" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "family_name" TEXT,
    "vendor_name" TEXT,
    "source_type" TEXT,
    "official_source_url" TEXT,
    "official_license_url" TEXT,
    "purchase_url" TEXT,
    "personal_use_status" "LicenseStatus" NOT NULL DEFAULT 'unknown',
    "commercial_use_status" "LicenseStatus" NOT NULL DEFAULT 'unknown',
    "simplified_summary" TEXT,
    "internal_notes" TEXT,
    "confidence_level" "ConfidenceLevel" NOT NULL DEFAULT 'medium',
    "last_verified_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fonts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "font_aliases" (
    "id" TEXT NOT NULL,
    "font_id" TEXT NOT NULL,
    "alias_name" TEXT NOT NULL,
    "normalized_alias_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "font_aliases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issue_reports" (
    "id" TEXT NOT NULL,
    "font_id" TEXT,
    "search_query" TEXT,
    "issue_type" "IssueType" NOT NULL,
    "message" TEXT NOT NULL,
    "user_email" TEXT,
    "status" "IssueStatus" NOT NULL DEFAULT 'open',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issue_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "actor_id" TEXT,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "before_snapshot" JSONB,
    "after_snapshot" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fonts_slug_key" ON "fonts"("slug");

-- CreateIndex
CREATE INDEX "fonts_normalized_name_idx" ON "fonts"("normalized_name");

-- CreateIndex
CREATE INDEX "fonts_slug_idx" ON "fonts"("slug");

-- CreateIndex
CREATE INDEX "font_aliases_normalized_alias_name_idx" ON "font_aliases"("normalized_alias_name");

-- CreateIndex
CREATE INDEX "issue_reports_status_idx" ON "issue_reports"("status");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "font_aliases" ADD CONSTRAINT "font_aliases_font_id_fkey" FOREIGN KEY ("font_id") REFERENCES "fonts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_reports" ADD CONSTRAINT "issue_reports_font_id_fkey" FOREIGN KEY ("font_id") REFERENCES "fonts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
