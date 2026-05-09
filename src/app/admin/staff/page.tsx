import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin");
  }

  const staff = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "STAFF"] },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Staff Portal</h1>
          <p className="text-gray-500 font-light mt-1">Manage atelier access and team capabilities.</p>
        </div>
        <Link 
          href="/admin/staff/new" 
          className="px-6 py-2 bg-gold text-black font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-black hover:text-gold transition-all"
        >
          <Plus size={18} />
          Add Team Member
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <div key={member.id} className="bg-white dark:bg-charcoal p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
               <div className="w-12 h-12 bg-cream dark:bg-black rounded-full flex items-center justify-center font-serif text-gold text-xl border border-gold/10">
                  {member.name?.charAt(0)}
               </div>
               <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest ${
                 member.role === "ADMIN" ? "bg-burgundy text-white" : "bg-gold/20 text-gold"
               }`}>
                 {member.role}
               </span>
            </div>
            
            <h3 className="text-lg font-bold mb-1">{member.name}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-6">
               <Mail size={14} />
               {member.email}
            </div>

            <div className="pt-6 border-t border-gray-50 dark:border-gray-900 flex justify-between items-center">
               <div className="flex gap-4">
                  <Link 
                    href={`/admin/staff/${member.id}`}
                    className="p-2 bg-gray-50 dark:bg-black text-gray-500 hover:text-gold transition-colors rounded"
                    title="Edit Member"
                  >
                     <Edit size={16} />
                  </Link>
                  <form action={async () => {
                    "use server";
                    await deleteStaffAccount(member.id);
                  }}>
                    <button 
                      type="submit"
                      className="p-2 bg-gray-50 dark:bg-black text-gray-500 hover:text-burgundy transition-colors rounded"
                      title="Delete Member"
                    >
                       <Trash2 size={16} />
                    </button>
                  </form>
               </div>
               <div className="flex gap-2">
                  <div title="Inventory Access" className="p-1.5 bg-green-50 dark:bg-green-900/20 text-green-600 rounded">
                     <Shield size={14} />
                  </div>
                  <div title="Order Management" className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded">
                     <UserCheck size={14} />
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
