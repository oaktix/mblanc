import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { NextRequestWithAuth } from "next-auth/middleware";

// Pages that must be reachable without a session
const PUBLIC_ADMIN_PATHS = [
  "/admin",
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
];

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // Forward pathname so root layout can detect admin routes
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);
    const withPathname = NextResponse.next({ request: { headers: requestHeaders } });

    // Always allow webhooks
    if (pathname.startsWith("/api/webhooks/paystack")) {
      return withPathname;
    }

    const isPublicAdminPath = PUBLIC_ADMIN_PATHS.includes(pathname);

    // If authenticated user hits /admin (login form), send them to dashboard
    if (pathname === "/admin" && isAuth) {
      const userRole = token?.role ? String(token.role).toUpperCase() : null;
      if (userRole === "ADMIN" || userRole === "STAFF") {
        // Already on dashboard — let through (page handles rendering)
        return NextResponse.next();
      }
    }

    // Protect non-public admin routes
    if (pathname.startsWith("/admin") && !isPublicAdminPath) {
      const userRole = token?.role ? String(token.role).toUpperCase() : null;
      const hasAccess = isAuth && (userRole === "ADMIN" || userRole === "STAFF");

      console.log(`>>> [MIDDLEWARE] Admin Route: ${pathname} | Role: ${token?.role} | Access: ${hasAccess}`);

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }

      // Admin-only sub-routes
      const isAdminOnlyRoute =
        pathname.startsWith("/admin/staff") || pathname.startsWith("/admin/settings");

      if (isAdminOnlyRoute && userRole !== "ADMIN") {
        console.log(`>>> [MIDDLEWARE] ACCESS DENIED: ${userRole} attempted ${pathname}`);
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return withPathname;
  },
  {
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Always allow webhooks
        if (pathname.startsWith("/api/webhooks/paystack")) return true;

        // Allow public admin paths (login, forgot/reset password)
        if (PUBLIC_ADMIN_PATHS.includes(pathname)) return true;

        return !!token;
      },
    },
    pages: {
      signIn: '/admin',
    }
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/account/:path*",
    "/api/webhooks/paystack/:path*",
  ],
};
