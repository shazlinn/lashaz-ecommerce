// ecommerce/app/admin/users/NewUserModal.tsx
'use client';

import { useState } from 'react';

export default function NewUserModal({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'customer',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Explicit form event handler to prevent default navigation reloads
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to create user');
      }
      
      // Reset form variables on success execution
      setForm({ name: '', email: '', role: 'customer', password: '' });
      setOpen(false);
      onCreated();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-secondary"
      >
        New User
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 animate-in fade-in duration-200">
          {/* Changed container root element to an actual HTML form structure */}
          <form 
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg flex flex-col"
          >
            <div className="mb-3 text-lg font-semibold text-black">Create User</div>

            <div className="mb-3 grid gap-2">
              {/* Added required validator parameters */}
              <input
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-black placeholder-zinc-400 outline-none focus:border-black"
                placeholder="Name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              
              {/* Swapped type from "text" to "email" to ensure native browser syntactic validation */}
              <input
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-black placeholder-zinc-400 outline-none focus:border-black"
                placeholder="Email (e.g. user@example.com)"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              
              <select
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-black outline-none focus:border-black bg-white"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              
              <input
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-black placeholder-zinc-400 outline-none focus:border-black"
                placeholder="Password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              {err && <p className="text-sm font-medium text-red-600 mt-1">{err}</p>}
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button" // Enforces cancel button doesn't trip form submittals
                onClick={() => setOpen(false)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit" // Correctly flags this element as the submit mechanism
                disabled={loading}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60 font-medium hover:bg-black transition-colors"
              >
                {loading ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}