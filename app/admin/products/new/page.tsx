// app/admin/products/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUploadThing } from '@/lib/uploadthing';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFilesToUpload(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  async function handleSave() {
    if (!form.name || !form.price) return setError('Name and Price are required');
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/products" className="text-xs text-muted hover:underline">← Back to Product List</Link>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">Add Product</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push('/admin/products')} className="btn-muted">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Main info & Images */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card space-y-4">
            <h3 className="text-base font-semibold">Information</h3>
            <input className="input w-full" placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <textarea className="input w-full h-32" placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          </div>

          <div className="card space-y-4">
            <h3 className="text-base font-semibold">Images</h3>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="input w-full text-sm" />
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <img key={i} src={src} className="h-24 w-24 rounded-lg border object-cover" />
              ))}
            </div>
          </div>

          <div className="card grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase">Price (MYR)</label>
                <input className="input w-full" placeholder="0.00" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-muted uppercase">Stock</label>
                <input className="input w-full" type="number" value={form.stock} onChange={e => setForm({...form, stock: Number(e.target.value)})} />
             </div>
          </div>
        </div>

        {/* Right Column: Meta info */}
        <div className="space-y-6">
          <div className="card space-y-4">
            <h3 className="text-base font-semibold">Organization</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase">Category</label>
              <select className="input w-full" value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted uppercase">Tags (CSV)</label>
              <input className="input w-full" placeholder="e.g. Skincare, New" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}