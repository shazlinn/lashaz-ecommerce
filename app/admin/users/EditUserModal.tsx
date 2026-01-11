'use client';

import { useState } from 'react';
import type { AdminUserRow } from '@/lib/users';

export default function EditUserModal({
  user,
  onUpdated,
}: {
  user: AdminUserRow;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: user.name ?? '',
    email: user.email,
    role: user.role,
    password: '', // optional
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  async function submit() {
    setErr('');
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to update user');
      }
      setOpen(false);
      onUpdated();
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
        className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
      >
        Edit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 text-lg font-semibold">Edit User</div>

            <div className="mb-3 grid gap-2">
              <input
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <select
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <input
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
                placeholder="New password (optional)"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              {err && <p className="text-sm text-red-600">{err}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
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