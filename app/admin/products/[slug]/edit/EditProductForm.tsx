// lashaz-ecommerce/app/admin/products/[slug]/edit/EditProductForm.tsx
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
    skinType: string; //
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
    skinType: product.skinType, //
    tags: product.tags,
  });

  const { startUpload } = useUploadThing("productImage");

  useEffect(() => {
    fetch('/api/admin/categories').then((res) => res.json()).then((data) => setCategories(data));
  }, []);

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const images = form.imageUrl.split(',').filter(Boolean);
    const newIndex = direction === 'left' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const temp = images[index];
    images[index] = images[newIndex];
    images[newIndex] = temp;
    setForm({ ...form, imageUrl: images.join(',') });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFilesToUpload(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  const removeExistingImage = async (urlToRemove: string) => {
    const fileKey = urlToRemove.split("/").pop();
    if (!fileKey || !confirm("Delete image?")) return;
    setDeletingId(urlToRemove);
    try {
      const res = await fetch("/api/admin/uploadthing/delete", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileKey }),
      });
      if (!res.ok) throw new Error("Delete failed");
      const remaining = form.imageUrl.split(',').filter((url) => url !== urlToRemove).join(',');
      setForm({ ...form, imageUrl: remaining });
    } catch (err: any) { alert(err.message); } finally { setDeletingId(null); }
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
          skinType: form.skinType, //
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) { router.refresh(); router.push('/admin/products'); }
      else setError(await res.text());
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  const existingImages = form.imageUrl.split(',').filter(Boolean);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 font-sans">
      <div className="lg:col-span-2 space-y-6">
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

        <div className="card space-y-4 shadow-sm bg-white p-6 rounded-[2rem] border border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Media Gallery</h3>
          <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center bg-zinc-50/50 hover:bg-zinc-50 cursor-pointer relative group">
            <input type="file" id="file-upload" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
            <label htmlFor="file-upload" className="cursor-pointer text-sm text-black font-bold uppercase tracking-widest hover:underline">Add new images</label>
          </div>
          <div className="flex flex-wrap gap-4">
            {existingImages.map((src, i) => (
              <div key={i} className="relative group h-28 w-28">
                <img src={src} className={`h-full w-full rounded-2xl border object-cover ${deletingId === src ? 'opacity-30' : ''}`} />
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    {i > 0 && <button onClick={() => moveImage(i, 'left')} className="p-1.5 bg-white rounded-full text-black hover:scale-110"><ArrowLeftIcon className="h-3 w-3" /></button>}
                    {i < existingImages.length - 1 && <button onClick={() => moveImage(i, 'right')} className="p-1.5 bg-white rounded-full text-black hover:scale-110"><ArrowRightIcon className="h-3 w-3" /></button>}
                  </div>
                  <button onClick={() => removeExistingImage(src)} className="p-1.5 bg-red-500 text-white rounded-full"><TrashIcon className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

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

      <div className="space-y-6">
        <div className="card space-y-4 shadow-sm bg-white p-6 rounded-[2rem] border border-gray-100">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Organization</h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Category</label>
            <select className="input w-full" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Skin Compatibility</label>
            <select className="input w-full" value={form.skinType} onChange={e => setForm({...form, skinType: e.target.value})}>
              <option value="">None / Universal</option>
              <option value="Oily">Oily</option>
              <option value="Dry">Dry</option>
              <option value="Combination">Combination</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-gray-400">Tags (CSV)</label>
            <input className="input w-full" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
          </div>
        </div>

        <div className="card space-y-4 shadow-sm bg-black p-8 rounded-[2rem] text-white">
           <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">Control Panel</h3>
           {error && <div className="text-xs text-red-400 font-medium bg-red-400/10 p-3 rounded-lg">{error}</div>}
           <div className="flex flex-col gap-3">
             <button onClick={handleSave} disabled={loading} className="w-full py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50">
               {loading ? 'Processing...' : 'Sync Changes'}
             </button>
             <button onClick={() => router.push('/admin/products')} className="w-full py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-50">Discard</button>
           </div>
        </div>
      </div>
    </div>
  );
}