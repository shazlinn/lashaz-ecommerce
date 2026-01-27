'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadThing } from '@/lib/uploadthing';
import { ArrowLeftIcon, ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline';

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
    imageUrl: product.imageUrl, 
    tags: product.tags,
  });

  const { startUpload } = useUploadThing("productImage");

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  // --- NEW: REARRANGE LOGIC ---
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const images = form.imageUrl.split(',').filter(Boolean);
    const newIndex = direction === 'left' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= images.length) return;

    // Swap elements
    const temp = images[index];
    images[index] = images[newIndex];
    images[newIndex] = temp;

    setForm({ ...form, imageUrl: images.join(',') });
  };
  // ----------------------------

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFilesToUpload(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  const removeExistingImage = async (urlToRemove: string) => {
    const fileKey = urlToRemove.split("/").pop();
    if (!fileKey) return;

    if (!confirm("Permanently delete this image from cloud storage?")) return;

    setDeletingId(urlToRemove);
    try {
      const res = await fetch("/api/admin/uploadthing/delete", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });

      if (!res.ok) throw new Error("Failed to delete from cloud");

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

      if (filesToUpload.length > 0) {
        const uploadRes = await startUpload(filesToUpload);
        if (!uploadRes) throw new Error("Upload failed");
        
        const newUrls = uploadRes.map(r => r.url).join(',');
        finalUrls = finalUrls ? `${finalUrls},${newUrls}` : newUrls;
      }

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

  const existingImages = form.imageUrl.split(',').filter(Boolean);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 font-sans">
      <div className="lg:col-span-2 space-y-6">
        {/* Info Card */}
        <div className="card space-y-4 shadow-sm bg-white p-6 rounded-[2rem] border border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Information</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Name</label>
            <input className="input w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Description</label>
            <textarea className="input w-full h-32" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>
        </div>

        {/* Image Gallery Management */}
        <div className="card space-y-4 shadow-sm bg-white p-6 rounded-[2rem] border border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Media Gallery</h3>
          <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors cursor-pointer group relative">
            <input type="file" id="file-upload" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file-upload" className="cursor-pointer text-sm text-black font-bold uppercase tracking-widest hover:underline">
              Add new images
            </label>
            <p className="text-[10px] text-gray-400 mt-2">The first image will be your primary product shot.</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Arrange Gallery</p>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((src, i) => (
                <div key={`existing-${i}`} className="relative group h-28 w-28">
                  <img 
                    src={src} 
                    className={`h-full w-full rounded-2xl border border-gray-100 object-cover transition-all ${deletingId === src ? 'opacity-30 scale-95' : 'opacity-100'}`} 
                  />
                  
                  {/* Controls Overlay */}
                  {deletingId !== src && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <div className="flex gap-2">
                        {i > 0 && (
                          <button onClick={() => moveImage(i, 'left')} className="p-1.5 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                            <ArrowLeftIcon className="h-3 w-3" />
                          </button>
                        )}
                        {i < existingImages.length - 1 && (
                          <button onClick={() => moveImage(i, 'right')} className="p-1.5 bg-white rounded-full text-black hover:scale-110 transition-transform shadow-lg">
                            <ArrowRightIcon className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeExistingImage(src)}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {deletingId === src && <div className="absolute inset-0 flex items-center justify-center"><span className="animate-spin text-white">●</span></div>}
                </div>
              ))}

              {/* New Unsaved Previews */}
              {previews.map((src, i) => (
                <div key={`new-${i}`} className="h-28 w-28 relative">
                  <img src={src} className="h-full w-full rounded-2xl border-2 border-dashed border-zinc-200 object-cover opacity-60" />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">New</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing/Stock */}
        <div className="card grid grid-cols-2 gap-8 shadow-sm bg-white p-6 rounded-[2rem] border border-gray-100">
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Price (MYR)</label>
              <input className="input w-full py-3 text-lg font-bold" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Stock Level</label>
              <input className="input w-full py-3 text-lg font-bold" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
           </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
        <div className="card space-y-4 shadow-sm bg-white p-6 rounded-[2rem] border border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Organization</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Category</label>
            <select className="input w-full" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Tags (CSV)</label>
            <input className="input w-full" placeholder="e.g. Makeup, Best Seller" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          </div>
        </div>

        <div className="card space-y-4 shadow-sm bg-black p-8 rounded-[2rem] text-white">
           <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Control Panel</h3>
           {error && <div className="text-xs text-red-400 font-medium bg-red-400/10 p-3 rounded-lg">{error}</div>}
           <div className="flex flex-col gap-3">
             <button onClick={handleSave} disabled={loading} className="w-full py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50">
               {loading ? 'Processing...' : 'Sync Changes'}
             </button>
             <button onClick={() => router.push('/admin/products')} className="w-full py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50">
               Discard
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}