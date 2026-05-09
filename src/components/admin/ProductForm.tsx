"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImagePlus, Loader2, X, Plus } from "lucide-react";
import { createProduct } from "@/app/actions/product";
import { useRouter } from "next/navigation";

// Main Product Schema
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  basePrice: z.coerce.number().min(0, "Base price is required"),
  sku: z.string().min(1, "SKU is required"),
  stock: z.coerce.number().int().min(0),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  description: z.string().min(1, "Description is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const addVariation = () => {
    setVariations([...variations, { size: "", color: "", price: 0, sku: `SKU-${Date.now()}`, stock: 0 }]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index: number, field: string, value: any) => {
    const newVariations = [...variations];
    newVariations[index] = { ...newVariations[index], [field]: value };
    setVariations(newVariations);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      status: "DRAFT",
      stock: 0,
      basePrice: 0,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImages((prev) => [...prev, data.url]);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (submitting) return;
    setSubmitting(true);
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    formData.append("images", JSON.stringify(images));
    formData.append("variations", JSON.stringify(variations));

    try {
      const result = await createProduct(formData);
      if (result?.error) {
        alert(result.error);
        setSubmitting(false);
      }
      // Note: redirect is handled by server action, but if it returns a value, we handle it here
    } catch (error) {
      // In Next.js, redirect throws an error that should NOT be caught for normal redirection
      // but since we are in an async function, we might need to check if it's a redirect error
      console.error("Creation failed", error);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-10 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-charcoal p-8 rounded-xl shadow-sm border border-gold/10">
            <h2 className="text-xl font-serif mb-6 text-charcoal dark:text-ivory italic">General Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Product Name</label>
                <input
                  {...register("name")}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                  placeholder="e.g. Midnight Silk Agbada"
                />
                {errors.name && <p className="text-burgundy text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Description</label>
                <textarea
                  {...register("description")}
                  rows={6}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors resize-none font-light"
                  placeholder="Tell the story of this masterpiece..."
                />
                {errors.description && <p className="text-burgundy text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-charcoal p-8 rounded-xl shadow-sm border border-gold/10">
            <h2 className="text-xl font-serif mb-6 text-charcoal dark:text-ivory italic">Inventory & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Base Price (₦)</label>
                <input
                  {...register("basePrice")}
                  type="number"
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                />
                {errors.basePrice && <p className="text-burgundy text-xs mt-1">{errors.basePrice.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Main SKU</label>
                <input
                  {...register("sku")}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors font-mono text-sm"
                  placeholder="MB-PROD-001"
                />
                {errors.sku && <p className="text-burgundy text-xs mt-1">{errors.sku.message}</p>}
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Initial Stock</label>
                <input
                  {...register("stock")}
                  type="number"
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                />
                {errors.stock && <p className="text-burgundy text-xs mt-1">{errors.stock.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-charcoal p-8 rounded-xl shadow-sm border border-gold/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif text-charcoal dark:text-ivory italic">Product Variations</h2>
              <button
                type="button"
                onClick={addVariation}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold hover:text-black dark:hover:text-white px-3 py-1 border border-gold/30 rounded-full transition-all"
              >
                <Plus size={12} /> Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {variations.length === 0 && (
                <div className="text-center py-10 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 italic">No variations added. (e.g., Size, Color)</p>
                </div>
              )}
              {variations.map((v, idx) => (
                <div key={idx} className="p-6 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-black/20 grid grid-cols-2 md:grid-cols-5 gap-6 relative group">
                  <button
                    type="button"
                    onClick={() => removeVariation(idx)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-burgundy text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={12} />
                  </button>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Size</label>
                    <input
                      value={v.size}
                      onChange={(e) => updateVariation(idx, "size", e.target.value)}
                      placeholder="e.g. XL"
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-1 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Color</label>
                    <input
                      value={v.color}
                      onChange={(e) => updateVariation(idx, "color", e.target.value)}
                      placeholder="e.g. Navy"
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-1 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Price (₦)</label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => updateVariation(idx, "price", parseFloat(e.target.value))}
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-1 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Variant SKU</label>
                    <input
                      value={v.sku}
                      onChange={(e) => updateVariation(idx, "sku", e.target.value)}
                      placeholder="SKU-01"
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-1 text-[10px] font-mono focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-[8px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Stock</label>
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => updateVariation(idx, "stock", parseInt(e.target.value))}
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 py-1 text-sm focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Organization & Images */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-charcoal p-8 rounded-xl shadow-sm border border-gold/10">
            <h2 className="text-xl font-serif mb-6 text-charcoal dark:text-ivory italic">Organization</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Category</label>
                <select
                  {...register("category")}
                  className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors appearance-none text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                  {/* Fallback if categories haven't loaded */}
                  {categories.length === 0 && (
                    <>
                      <option value="Agbada">Agbada</option>
                      <option value="Kaftans">Kaftans</option>
                      <option value="Suits">Suits</option>
                      <option value="Corporate">Corporate Fits</option>
                    </>
                  )}
                </select>
                {errors.category && <p className="text-burgundy text-xs mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Status</label>
                <div className="flex gap-4">
                  <label className="flex-1">
                    <input {...register("status")} type="radio" value="DRAFT" className="sr-only peer" />
                    <div className="text-center py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-800 peer-checked:border-gold peer-checked:bg-gold/10 peer-checked:text-gold cursor-pointer transition-all text-[10px] font-bold tracking-widest">DRAFT</div>
                  </label>
                  <label className="flex-1">
                    <input {...register("status")} type="radio" value="PUBLISHED" className="sr-only peer" />
                    <div className="text-center py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-800 peer-checked:border-gold peer-checked:bg-gold/10 peer-checked:text-gold cursor-pointer transition-all text-[10px] font-bold tracking-widest">PUBLISHED</div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-charcoal p-8 rounded-xl shadow-sm border border-gold/10">
            <h2 className="text-xl font-serif mb-6 text-charcoal dark:text-ivory italic">Gallery</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {images.map((url, idx) => (
                <div key={idx} className="relative aspect-[3/4] bg-gray-50 dark:bg-black rounded-lg overflow-hidden group border border-gray-100 dark:border-gray-900">
                  <img src={url} alt="Product" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-burgundy text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="aspect-[3/4] border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all text-gray-400 hover:text-gold group">
                {uploading ? (
                  <Loader2 className="animate-spin text-gold" size={24} />
                ) : (
                  <>
                    <ImagePlus size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] mt-2 font-bold uppercase tracking-widest">Upload Image</span>
                  </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <p className="text-[10px] text-gray-400 italic leading-relaxed text-center">First image will be the primary cover. High resolution recommended.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-10 border-t border-gold/20 sticky bottom-0 bg-white/80 dark:bg-black/80 backdrop-blur-md pb-10">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="px-16 py-5 bg-burgundy text-white font-bold uppercase tracking-[0.3em] text-xs rounded-lg hover:bg-black transition-all flex items-center gap-4 disabled:opacity-50 shadow-xl"
        >
          {submitting ? <Loader2 className="animate-spin" size={18} /> : null}
          {submitting ? "Crafting Masterpiece..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}