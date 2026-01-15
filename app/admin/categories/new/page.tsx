// app/admin/categories/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewCategoryPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit() {
    if (!name.trim()) return setError('Name is required');
    setLoading(true);
    
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), description: description.trim() }),
    });

    if (res.ok) {
      router.push('/admin/categories');
      router.refresh();
    } else {
      setError(await res.text());
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/categories" className="text-sm text-muted hover:underline">← Back to Categories</Link>
        <h1 className="text-2xl font-bold">New Category</h1>
      </div>

      <div className="card space-y-4 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted">Category Name</label>
          <input 
            className="input w-full" 
            placeholder="e.g. Lipsticks" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted">Description (Optional)</label>
          <textarea 
            className="input w-full h-32" 
            placeholder="Describe the types of products in this category..." 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <button onClick={() => router.push('/admin/categories')} className="btn-muted">Cancel</button>
        <button 
          onClick={handleSubmit} 
          disabled={loading} 
          className="btn-primary px-8"
        >
          {loading ? 'Saving...' : 'Create Category'}
        </button>
      </div>
    </div>
  );
}