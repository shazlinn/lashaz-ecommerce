'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';

type EditProductFormProps = {
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    stock: number;
    categoryId: string;
    imageUrl: string;
    tags: string;
  };
};

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl, // Existing URLs (comma separated)
    tags: product.tags,
  });

  const { startUpload } = useUploadThing("productImage");

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFilesToUpload(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  const removeExistingImage = async (urlToRemove: string) => {
    // 1. Extract File Key from UploadThing URL
    const fileKey = urlToRemove.split("/").pop();
    if (!fileKey) return;

    if (!confirm("Permanently delete this image from cloud storage?")) return;

    setDeletingId(urlToRemove);
    try {
      // 2. Call our secure deletion API
      const res = await fetch("/api/admin/uploadthing/delete", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });

      if (!res.ok) throw new Error("Failed to delete from cloud");

      // 3. Update local state string
      const remaining = form.imageUrl
        .split(',')
        .filter((url) => url !== urlToRemove)
        .join(',');
      
      setForm({ ...form, imageUrl: remaining });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  async function handleSave() {
    if (!form.name || !form.price) return setError('Name and Price are required');
    setLoading(true);
    setError('');

    try {
      let finalUrls = form.imageUrl;

      // 1. Upload new files if selected
      if (filesToUpload.length > 0) {
        const uploadRes = await startUpload(filesToUpload);
        if (!uploadRes) throw new Error("Upload failed");
        
        const newUrls = uploadRes.map(r => r.url).join(',');
        finalUrls = finalUrls ? `${finalUrls},${newUrls}` : newUrls;
      }

      // 2. Send PATCH request to dynamic Prisma route
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          imageUrl: finalUrls,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        router.refresh();
        router.push('/admin/products');
      } else {
        setError(await res.text());
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* Info Card */}
        <div className="card space-y-4 shadow-sm">
          <h3 className="text-base font-semibold">Product Information</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase">Name</label>
            <input className="input w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase">Description</label>
            <textarea className="input w-full h-32" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
        </div>

        {/* Image Gallery Management */}
        <div className="card space-y-4 shadow-sm">
          <h3 className="text-base font-semibold">Media Gallery</h3>
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center bg-bg/50">
            <input type="file" id="file-upload" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file-upload" className="cursor-pointer text-sm text-primary font-medium hover:underline">
              Click to add new images
            </label>
            <p className="text-[10px] text-muted mt-1">Upload up to 5 images (Max 4MB each)</p>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-bold text-muted uppercase">Gallery Preview</p>
            <div className="flex flex-wrap gap-4">
              {/* Existing Images with Deletion Logic */}
              {form.imageUrl.split(',').filter(Boolean).map((src, i) => (
                <div key={`existing-${i}`} className="relative group h-24 w-24">
                  <img src={src} className={`h-full w-full rounded-lg border object-cover transition-opacity ${deletingId === src ? 'opacity-30' : 'opacity-100'}`} />
                  {deletingId !== src && (
                    <button 
                      type="button"
                      onClick={() => removeExistingImage(src)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  )}
                  {deletingId === src && <div className="absolute inset-0 flex items-center justify-center"><span className="animate-spin text-xs">...</span></div>}
                </div>
              ))}
              {/* New Unsaved Previews */}
              {previews.map((src, i) => (
                <div key={`new-${i}`} className="h-24 w-24 relative">
                  <img src={src} className="h-full w-full rounded-lg border-2 border-dashed border-primary/50 object-cover" />
                  <span className="absolute bottom-1 right-1 bg-primary text-[8px] text-white px-1 rounded">NEW</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing/Stock */}
        <div className="card grid grid-cols-2 gap-4 shadow-sm">
           <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase">Price (MYR)</label>
              <input className="input w-full" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
           </div>
           <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase">Stock</label>
              <input className="input w-full" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
           </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <div className="card space-y-4 shadow-sm">
          <h3 className="text-base font-semibold">Organization</h3>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase">Category</label>
            <select className="input w-full" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted uppercase">Tags (CSV)</label>
            <input className="input w-full" placeholder="e.g. Makeup, Best Seller" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          </div>
        </div>

        <div className="card space-y-4 shadow-sm bg-card">
           <h3 className="text-base font-semibold">Actions</h3>
           {error && <div className="text-xs text-red-500 font-medium">{error}</div>}
           <div className="flex flex-col gap-2">
             <button onClick={handleSave} disabled={loading} className="btn-primary w-full py-3">
               {loading ? 'Uploading & Saving...' : 'Update Product'}
             </button>
             <button onClick={() => router.push('/admin/products')} className="btn-muted w-full">
               Discard Changes
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}