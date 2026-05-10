"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ImagePlus, Loader2, X } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setNewImage(data.url);
    setUploading(false);
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, image: newImage }),
    });
    setNewName("");
    setNewImage("");
    await fetchCategories();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products using it will keep their category label.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    await fetchCategories();
  };

  const handleEdit = (cat: any) => {
    setEditingCategory(cat.id);
    setEditName(cat.name);
    setEditImage(cat.image || "");
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/categories/${editingCategory}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, image: editImage }),
    });
    setEditingCategory(null);
    await fetchCategories();
    setSaving(false);
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.url) setEditImage(data.url);
    setUploading(false);
  };

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Product Categories</h1>
          <p className="text-gray-500 font-light mt-1">Manage the categories and hero images displayed in your shop.</p>
        </div>

        {/* Add New */}
        <div className="bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800 p-6 mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal dark:text-ivory mb-5">Add New Category</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Category name (e.g. Agbada)"
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-black text-sm focus:outline-none focus:border-gold"
            />
            <div className="flex gap-3">
              <label className="relative flex items-center gap-2 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gold transition-colors text-sm text-gray-500">
                {uploading ? <Loader2 size={16} className="animate-spin text-gold" /> : <ImagePlus size={16} />}
                {newImage ? "Image Ready ✓" : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <button
                onClick={handleAdd}
                disabled={saving || !newName.trim()}
                className="px-6 py-3 bg-burgundy text-white font-bold rounded-lg text-sm flex items-center gap-2 hover:bg-black transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Add
              </button>
            </div>
          </div>
          {newImage && (
            <div className="mt-3 relative inline-block">
              <img src={newImage} alt="" className="h-16 w-16 object-cover rounded-lg border border-gold/20" />
              <button onClick={() => setNewImage("")} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
            </div>
          )}
        </div>

        {/* Category List */}
        <div className="bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400 italic animate-pulse">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic">No categories yet. Add your first one above.</div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-900">
              {categories.map(cat => (
                <div key={cat.id} className="flex flex-col hover:bg-gray-50/50 dark:hover:bg-black/20 transition-colors">
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4 flex-1">
                      {editingCategory === cat.id ? (
                        <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
                          <div className="relative group">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gold/40 bg-cream dark:bg-black flex items-center justify-center">
                              {editImage ? (
                                <img src={editImage} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <ImagePlus size={20} className="text-gray-300" />
                              )}
                            </div>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                              <ImagePlus size={16} className="text-white" />
                              <input type="file" accept="image/*" onChange={handleEditImageUpload} className="hidden" />
                            </label>
                          </div>
                          <div className="flex-1 w-full">
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="w-full px-3 py-2 border border-gold rounded-lg bg-white dark:bg-black text-sm focus:outline-none"
                              autoFocus
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handleSaveEdit}
                                disabled={saving || !editName.trim()}
                                className="text-[10px] font-bold uppercase tracking-widest text-green-600 hover:text-green-700 disabled:opacity-50"
                              >
                                {saving ? "Saving..." : "Save Changes"}
                              </button>
                              <button
                                onClick={() => setEditingCategory(null)}
                                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-gold/10 bg-cream dark:bg-black flex items-center justify-center">
                            {cat.image ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" /> : <span className="text-[10px] text-gray-300 italic">No img</span>}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-charcoal dark:text-ivory">{cat.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{cat.slug}</p>
                          </div>
                        </>
                      )}
                    </div>
                    {editingCategory !== cat.id && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(cat)} 
                          className="p-2 text-gray-400 hover:text-gold transition-colors text-xs font-bold uppercase tracking-widest"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)} 
                          className="p-2 text-gray-400 hover:text-burgundy transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
