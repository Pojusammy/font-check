import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "fc-admin";

function getSecret() {
  const s = process.env.SESSION_SECRET ?? "";
  return new TextEncoder().encode(s);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow login/logout/auth API
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/logout") ||
    pathname.startsWith("/api/v1/admin/auth/")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const adminId = payload.adminId as string;
    const adminEmail = (payload.adminEmail as string) ?? "";
    const adminRole = (payload.adminRole as string) ?? "admin";

    if (!adminId) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Inject identity headers for server components
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-admin-id", adminId);
    requestHeaders.set("x-admin-email", adminEmail);
    requestHeaders.set("x-admin-role", adminRole);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    // Invalid/expired token
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/v1/admin/fonts/:path*", "/api/v1/admin/issues/:path*"],
};
