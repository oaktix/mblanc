import StaffForm from "@/components/admin/StaffForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewStaffPage() {
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
        <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Add Team Member</h1>
        <p className="text-gray-500 font-light mt-1">Onboard a new artisan or staff member to the atelier portal.</p>
      </div>

      <StaffForm />
    </div>
  );
}
