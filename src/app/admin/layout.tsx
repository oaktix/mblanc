import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import { Suspense } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}

async function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const isAuthenticated =
    session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";

  // Unauthenticated: render bare so login/forgot-password pages own their layout
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Authenticated: return children directly so each page can be fully standalone
  return <>{children}</>;
}
