"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImagePlus, Loader2, X, Plus } from "lucide-react";
import { updateProduct } from "@/app/actions/product";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  basePrice: z.coerce.number().min(0),
  sku: z.string().min(1, "SKU is required"),
  stock: z.coerce.number().int().min(0),
  status: z.enum(["PUBLISHED", "DRAFT"]),
  description: z.string().min(1, "Description is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Props {
  product: any;
  categories: any[];
}

export default function EditProductForm({ product, categories }: Props) {
  const [images, setImages] = useState<string[]>(product.images || []);
  const [variations, setVariations] = useState<any[]>(product.variations || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: product.name,
      category: product.category,
      basePrice: product.basePrice,
      sku: product.sku,
      stock: product.stock,
      status: product.status,
      description: product.description,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setImages(prev => [...prev, data.url]);
    } catch {}
    setUploading(false);
  };

  const onSubmit = async (values: ProductFormValues) => {
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([k, v]) => formData.append(k, String(v)));
    formData.append("images", JSON.stringify(images));
    formData.append("variations", JSON.stringify(variations));
    await updateProduct(product.id, formData);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800 p-8 space-y-6">
        <h3 className="font-semibold text-charcoal dark:text-ivory text-sm uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-4">Core Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Product Name</label>
            <input {...register("name")} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black text-sm focus:outline-none focus:border-gold" />
            {errors.name && <p className="text-burgundy text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Category</label>
            <select {...register("category")} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black text-sm focus:outline-none focus:border-gold">
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              <option value={product.category}>{product.category}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Base Price (₦)</label>
            <input type="number" {...register("basePrice")} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">SKU</label>
            <input {...register("sku")} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Stock</label>
            <input type="number" {...register("stock")} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black text-sm focus:outline-none focus:border-gold" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Status</label>
            <select {...register("status")} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black text-sm focus:outline-none focus:border-gold">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
          <textarea {...register("description")} rows={4} className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black text-sm focus:outline-none focus:border-gold resize-none" />
        </div>
      </div>

      {/* Images */}
      <div className="bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800 p-8">
        <h3 className="font-semibold text-sm uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">Product Images</h3>
        <div className="flex flex-wrap gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12} /></button>
            </div>
          ))}
          <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors">
            {uploading ? <Loader2 className="animate-spin text-gold" size={20} /> : <><ImagePlus size={20} className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-400">Upload</span></>}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Variations */}
      <div className="bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800 p-8">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
          <h3 className="font-semibold text-sm uppercase tracking-widest">Variations</h3>
          <button type="button" onClick={() => setVariations([...variations, { size: "", color: "", price: 0, sku: "", stock: 0 }])} className="flex items-center gap-1 text-xs text-gold hover:text-black transition-colors">
            <Plus size={14} /> Add Variation
          </button>
        </div>
        {variations.map((v, idx) => (
          <div key={idx} className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4 p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
            {["size", "color", "sku"].map(field => (
              <input key={field} placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={v[field]} onChange={e => { const nv = [...variations]; nv[idx][field] = e.target.value; setVariations(nv); }} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-black" />
            ))}
            {["price", "stock"].map(field => (
              <input key={field} type="number" placeholder={field.charAt(0).toUpperCase() + field.slice(1)} value={v[field]} onChange={e => { const nv = [...variations]; nv[idx][field] = e.target.value; setVariations(nv); }} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-gray-50 dark:bg-black" />
            ))}
            <button type="button" onClick={() => setVariations(variations.filter((_, i) => i !== idx))} className="text-burgundy hover:text-red-700 transition-colors"><X size={16} /></button>
          </div>
        ))}
      </div>

      <button type="submit" disabled={submitting} className="w-full py-4 bg-burgundy text-white font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2">
        {submitting ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : "Save Changes"}
      </button>
    </form>
  );
}
