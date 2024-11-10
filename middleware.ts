// /middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("next-auth.session-token");
  console.log("token", token);
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  console.log("isAuthPage", isAuthPage);
  if (!token && !isAuthPage) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL("/auth/signIn", request.url));
  }

  if (token && isAuthPage) {
    // Redirect to dashboard if authenticated and trying to access auth page
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/blogs/:path*", "/profile/:path*", "/communities/:path*" ,"/auth/:path*","/projects/:path*","/points-table/:path*"],
};
