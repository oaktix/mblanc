import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-10">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Inventory
        </Link>
        <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Add New Masterpiece</h1>
        <p className="text-gray-500 font-light mt-1">Fill in the details to add a new garment to the atelier's collection.</p>
      </div>

      <ProductForm />
    </div>
  );
}
