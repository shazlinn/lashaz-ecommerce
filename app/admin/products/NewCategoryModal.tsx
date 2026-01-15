// app/admin/products/NewCategoryModal.tsx
'use client';

import { useState } from 'react';

export default function NewCategoryModal({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    setErr('');
    if (!name.trim()) {
      setErr('Category name is required');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
    });
    setLoading(false);
    if (!res.ok) {
      const msg = await res.text();
      setErr(msg || 'Failed to create category');
      return;
    }
    setOpen(false);
    setName('');
    setDescription('');
    onCreated();
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-muted">
        New Category
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div
            className="w-full max-w-md rounded-lg border p-4"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="mb-2 text-lg font-semibold">New Category</div>
            <div className="grid gap-2">
              <input
                className="input"
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="input"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {err && (
                <div className="xs" style={{ color: 'var(--clr-danger-a10)' }}>
                  {err}
                </div>
              )}
            </div>
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="btn-muted">
                Cancel
              </button>
              <button onClick={submit} disabled={loading} className="btn-primary">
                {loading ? 'Saving…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}