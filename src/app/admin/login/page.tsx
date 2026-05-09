import { redirect } from "next/navigation";

// /admin/login is now merged into /admin
export default function AdminLoginRedirect() {
  redirect("/admin");
}
