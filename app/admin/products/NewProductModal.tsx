'use client';

import { useEffect, useState } from 'react';

type Props = { onCreated: () => void };

export default function NewProductModal({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: 0,
    imageUrl: '',
    categoryId: '',
    tags: '' as string, // comma separated input
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(data);
      if (data[0]?.id && !form.categoryId) {
        setForm((f) => ({ ...f, categoryId: data[0].id }));
      }
    })();
  }, [open]); // load categories once modal opens

  async function submit() {
    setError('');
    if (!form.name || !form.price || !form.categoryId) {
      setError('Name, price and category are required');
      return;
    }

    const priceNumber = Number(form.price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      setError('Enter a valid price');
      return;
    }
    if (form.stock < 0) {
      setError('Stock cannot be negative');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: priceNumber,
        stock: form.stock,
        imageUrl: form.imageUrl || undefined,
        categoryId: form.categoryId,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const msg = await res.text();
      setError(msg || 'Failed to create product');
      return;
    }
    setOpen(false);
    onCreated();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="rounded-md bg-zinc-900 px-3 py-2 text-white">
        New Product
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="mb-2 text-lg font-semibold">New Product</div>

            <div className="grid gap-2">
              <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <input className="input" placeholder="Price (e.g. 29.90)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <input className="input" type="number" min={0} placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
              </div>
              <input className="input" placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
              <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input className="input" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              {error && <div className="xs" style={{ color: 'var(--clr-danger-a10)' }}>{error}</div>}
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="btn-muted">Cancel</button>
              <button onClick={submit} disabled={loading} className="btn-primary">{loading ? 'Saving…' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}