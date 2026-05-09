import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // 1. Explicitly allow the webhook to pass through without any checks
    if (pathname.startsWith("/api/webhooks/paystack")) {
      return NextResponse.next();
    }

    // 2. Admin & Staff Authorization Logic
    const isAdminRoute = pathname.startsWith("/admin");
    const isAdminLogin = pathname === "/admin/login";

    if (isAdminLogin && isAuth) {
      const userRole = token?.role ? String(token.role).toUpperCase() : null;
      if (userRole === "ADMIN" || userRole === "STAFF") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    if (isAdminRoute && !isAdminLogin) {
      const userRole = token?.role ? String(token.role).toUpperCase() : null;
      const hasAccess = isAuth && (userRole === "ADMIN" || userRole === "STAFF");
      
      console.log(`>>> [MIDDLEWARE] Admin Route Access: ${pathname} | User: ${token?.email} | Role: ${token?.role} | Access: ${hasAccess}`);

      if (!hasAccess) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }

      const isAdminOnlyRoute = pathname.startsWith("/admin/staff") || pathname.startsWith("/admin/settings");
      console.log(`>>> [MIDDLEWARE] Path: ${pathname} | Role: ${userRole} | AdminOnly: ${isAdminOnlyRoute}`);
      
      if (isAdminOnlyRoute && userRole !== "ADMIN") {
        console.log(`>>> [MIDDLEWARE] ACCESS DENIED: ${userRole} attempted to access ADMIN-only route ${pathname}`);
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // This logic ensures that if the route is matched in the config below, 
      // the user must be authorized (logged in) EXCEPT if we handle it in the function above.
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow webhooks
        if (pathname.startsWith("/api/webhooks/paystack")) {
          return true;
        }
        
        // Allow the admin login page itself so users can actually log in
        if (pathname === "/admin/login") {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (specifically excluding our webhook from protection)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: [
    "/admin",
    "/admin/:path*",
    "/account/:path*",
    // We add the webhook here just so the 'authorized' callback 
    // can explicitly grant it permission.
    "/api/webhooks/paystack/:path*"
  ],
};
