// app/admin/products/EditProductModal.tsx
'use client';

import { useEffect, useState } from 'react';
import type { ProductRow } from './products-client';

export default function EditProductModal({
  product,
  onUpdated,
}: {
  product: ProductRow;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [form, setForm] = useState({
    name: product.name,
    description: '',
    price: product.price, // we normalize to string for the input
    stock: product.stock,
    imageUrl: product.imageUrl ?? '',
    categoryId: '',
    tags: product.tags.join(', '),
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    (async () => {
      try {
        const [catsRes, prodRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch(`/api/admin/products/${product.id}`),
        ]);

        // Categories
        if (!catsRes.ok) {
          console.error('[CATEGORIES_FETCH]', catsRes.status);
          if (!cancelled) setCategories([]);
        } else {
          const cats = await catsRes.json();
          if (!cancelled) setCategories(cats);
        }

        // Product
        if (!prodRes.ok) {
          const msg = await prodRes.text().catch(() => '');
          console.warn('[PRODUCT_FETCH]', prodRes.status, msg);
          if (!cancelled) {
            setError(
              'This product could not be loaded (it may have been deleted).'
            );
            // close the modal after a short delay to avoid stuck state
            setTimeout(() => setOpen(false), 1200);
          }
          return;
        }

        // Log BEFORE consuming the body
        const raw = await prodRes.clone().text().catch(() => '');
        console.log('GET product', product.id, prodRes.status, raw);
        const p = await prodRes.json();

        if (!cancelled) {
          setForm((f) => ({
            ...f,
            name: p.name ?? '',
            description: p.description ?? '',
            categoryId: p.categoryId ?? '',
            price: String(p.price ?? f.price ?? ''),
            stock: Number(p.stock ?? f.stock ?? 0),
            imageUrl: p.imageUrl ?? '',
            tags:
              (p.tags?.map((t: { name: string }) => t.name).join(', ') ??
                f.tags) || '',
          }));
        }
      } catch (e) {
        console.error('[EDIT_MODAL_FETCH]', e);
        if (!cancelled) {
          setError('Failed to load product.');
          setTimeout(() => setOpen(false), 1200);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, product.id]);

  async function submit() {
    setError('');
    const priceNumber = Number(form.price);
    if (!form.name || Number.isNaN(priceNumber)) {
      setError('Name and valid price are required');
      return;
    }
    if (form.stock < 0) {
      setError('Stock cannot be negative');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          price: priceNumber,
          stock: form.stock,
          imageUrl: form.imageUrl || undefined,
          categoryId: form.categoryId || undefined,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const msg = await res.text().catch(() => '');
        setError(msg || 'Failed to update product');
        setLoading(false);
        return;
      }

      setOpen(false);
      onUpdated();
    } catch (e: any) {
      console.error('[PRODUCT_UPDATE]', e);
      setError('Failed to update product');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-muted xs">
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div
            className="w-full max-w-lg rounded-lg border p-4"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="mb-2 text-lg font-semibold">Edit Product</div>

            {error && (
              <div className="xs mb-3" style={{ color: 'var(--clr-danger-a10)' }}>
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <input
                className="input"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                className="input"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="input"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <input
                  className="input"
                  type="number"
                  min={0}
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number(e.target.value) })
                  }
                />
              </div>
              <input
                className="input"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) =>
                  setForm({ ...form, imageUrl: e.target.value })
                }
              />
              <select
                className="input"
                value={form.categoryId}
                onChange={(e) =>
                  setForm({ ...form, categoryId: e.target.value })
                }
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                className="input"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="btn-muted">
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}