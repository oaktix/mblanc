import prisma from "@/lib/prisma";
import StaffForm from "@/components/admin/StaffForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    notFound();
  }

  // Sanitize data for the client form
  const initialData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <Link 
          href="/admin/staff" 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Staff Portal
        </Link>
        <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Edit Team Member</h1>
        <p className="text-gray-500 font-light mt-1">Update access levels and profile details for {user.name}.</p>
      </div>

      <StaffForm initialData={initialData} isEditing={true} />
    </div>
  );
}
