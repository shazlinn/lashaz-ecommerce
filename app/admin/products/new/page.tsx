// lashaz-ecommerce/app/admin/products/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUploadThing } from '@/lib/uploadthing';
import { slugify } from '@/lib/utils'; // Import your new helper
import { ArrowLeftIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    slug: '', // NEW: Added slug field to state
    description: '',
    price: '',
    stock: 0,
    categoryId: '',
    tags: '',
  });

  const { startUpload } = useUploadThing("productImage");

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data[0]?.id) setForm((f) => ({ ...f, categoryId: data[0].id }));
      });
  }, []);

  // Handler to update name and slug simultaneously
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setForm({
      ...form,
      name: newName,
      slug: slugify(newName) // Real-time slug generation
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFilesToUpload(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  async function handleSave() {
    if (!form.name || !form.price || !form.slug) return setError('Name, Price, and Slug are required');
    setLoading(true);
    setError('');

    try {
      let finalUrls = "";
      if (filesToUpload.length > 0) {
        const uploadRes = await startUpload(filesToUpload);
        if (!uploadRes) throw new Error("Upload failed");
        finalUrls = uploadRes.map(r => r.url).join(',');
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          imageUrl: finalUrls,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) router.push('/admin/products');
      else setError(await res.text());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 font-sans p-6 lg:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <Link href="/admin/products" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors w-fit">
            <ArrowLeftIcon className="h-4 w-4" /> Back to Inventory
          </Link>
          <h1 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black mt-4">Add New Product</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/admin/products')} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="btn-primary px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-all">
            {loading ? 'Processing...' : 'Save Product'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-[1rem] bg-red-50 p-4 text-sm font-medium text-red-600 border border-red-100 animate-in fade-in">{error}</div>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Core Product Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 border-b border-gray-50 pb-4">Product Details</h3>
            
            <div className="space-y-4">
              <input 
                className="input w-full py-4 text-lg font-medium focus:ring-1 focus:ring-black" 
                placeholder="Name your product (e.g., Velvet Blusher)" 
                value={form.name} 
                onChange={handleNameChange} // Logic for auto-slug
              />
              
              {/* URL Preview Logic */}
              <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-lg border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">URL Path:</span>
                <span className="text-xs text-gray-500 font-mono italic">/product/{form.slug || '...'}</span>
              </div>

              <textarea 
                className="input w-full h-40 py-4 resize-none" 
                placeholder="Tell the story of this beauty essential..." 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
              />
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 border-b border-gray-50 pb-4">Media Assets</h3>
            <div className="relative border-2 border-dashed border-gray-100 rounded-2xl p-8 text-center hover:bg-zinc-50 transition-colors cursor-pointer group">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <PhotoIcon className="h-10 w-10 mx-auto text-gray-300 group-hover:text-black transition-colors" />
              <p className="mt-2 text-sm text-gray-400">Click to upload product images</p>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative h-24 w-24 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={src} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm grid grid-cols-2 gap-8">
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Price (MYR)</label>
                <input className="input w-full py-4 text-xl font-bold" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Inventory Stock</label>
                <input className="input w-full py-4 text-xl font-bold" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
             </div>
          </section>
        </div>

        {/* Right Column: Taxonomy & Sorting */}
        <div className="space-y-8">
          <section className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 border-b border-gray-50 pb-4">Taxonomy</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Collection / Category</label>
                <select className="input w-full py-3" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Tags (Comma Separated)</label>
                <input className="input w-full py-3" placeholder="e.g. Vegan, Limited Edition" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}