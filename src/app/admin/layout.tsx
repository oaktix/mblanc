import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const isAuthenticated =
    session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";

  // Unauthenticated: render bare so login/forgot-password pages own their layout
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // Authenticated: full sidebar shell
  return <AdminShell>{children}</AdminShell>;
}
