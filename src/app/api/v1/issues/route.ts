import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many reports. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { font_id, search_query, issue_type, message, user_email } = body;

    // Validate required fields
    if (!issue_type || !message) {
      return NextResponse.json(
        { error: "issue_type and message are required" },
        { status: 400 }
      );
    }

    const validIssueTypes = [
      "incorrect_license_status",
      "broken_source_link",
      "broken_purchase_link",
      "wrong_font_match",
      "outdated_information",
      "missing_font",
      "other",
    ];

    if (!validIssueTypes.includes(issue_type)) {
      return NextResponse.json({ error: "Invalid issue_type" }, { status: 400 });
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 2000 characters" },
        { status: 400 }
      );
    }

    // Validate font_id if provided
    if (font_id) {
      const font = await prisma.font.findUnique({ where: { id: font_id } });
      if (!font) {
        return NextResponse.json({ error: "Font not found" }, { status: 404 });
      }
    }

    const report = await prisma.issueReport.create({
      data: {
        font_id: font_id || null,
        search_query: search_query || null,
        issue_type,
        message,
        user_email: user_email || null,
        status: "open",
      },
    });

    return NextResponse.json({ success: true, id: report.id }, { status: 201 });
  } catch (err) {
    console.error("Issue report error:", err);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
