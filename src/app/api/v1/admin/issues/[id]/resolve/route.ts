import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/auth";
import type { SessionData } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = new NextResponse();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  if (!session.isLoggedIn || !session.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const newStatus = body.status || "resolved";

    const validStatuses = ["open", "reviewed", "resolved", "dismissed"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data: issue, error } = await supabase
      .from("issue_reports")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ issue });
  } catch (err) {
    console.error("Resolve issue error:", err);
    return NextResponse.json({ error: "Failed to update issue" }, { status: 500 });
  }
}
