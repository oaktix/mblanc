import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package2,
  ArrowUpRight
} from "lucide-react";

const STATS = [
  { name: "Total Revenue", value: "₦2,450,000", icon: TrendingUp, change: "+12.5%", color: "text-green-600" },
  { name: "Total Orders", value: "48", icon: ShoppingBag, change: "+18%", color: "text-blue-600" },
  { name: "Active Customers", value: "124", icon: Users, change: "+5.2%", color: "text-purple-600" },
  { name: "Total Products", value: "12", icon: Package2, change: "0%", color: "text-amber-600" },
];

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Dashboard Overview</h1>
          <p className="text-gray-500 font-light mt-1">Monitor your atelier's performance and orders.</p>
        </div>
        <button className="px-6 py-2 bg-gold text-black font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-black hover:text-gold transition-all">
          View Reports
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-charcoal p-6 border border-gray-100 dark:border-gray-800 shadow-sm rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-black ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-charcoal dark:text-ivory mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-charcoal p-8 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
          <h2 className="text-xl font-serif mb-6 text-charcoal dark:text-ivory border-b border-gray-50 dark:border-gray-900 pb-4">Recent Orders</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cream dark:bg-black rounded-full flex items-center justify-center font-serif text-gold">O</div>
                  <div>
                    <p className="text-sm font-semibold">Order #MB-100{i}</p>
                    <p className="text-xs text-gray-500">2 hours ago • Ibrahim K.</p>
                  </div>
                </div>
                <span className="text-sm font-bold">₦450,000</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-charcoal p-8 border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm">
          <h2 className="text-xl font-serif mb-6 text-charcoal dark:text-ivory border-b border-gray-50 dark:border-gray-900 pb-4">Latest Products</h2>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-12 bg-gray-50 dark:bg-black rounded-md flex items-center justify-center font-serif text-gold">P</div>
                  <div>
                    <p className="text-sm font-semibold">Royal Agbada v{i}</p>
                    <p className="text-xs text-gray-500">Added yesterday</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full italic">Published</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
