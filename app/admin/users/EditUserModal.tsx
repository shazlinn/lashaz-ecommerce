// app/admin/users/EditUserModal.tsx
'use client';

import { useState } from 'react';
import type { AdminUserRow } from '@/lib/users';

type EditUserModalProps = {
  user: AdminUserRow;
  onUpdated: () => void;
  renderTrigger?: () => React.ReactNode; // 1. Added the missing trigger prop
};

export default function EditUserModal({ user, onUpdated, renderTrigger }: EditUserModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: user.name ?? '',
    email: user.email,
    role: user.role,
    password: '', 
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
      {/* 2. Execute renderTrigger() to display the pencil icon from UsersClient */}
      <div onClick={() => setOpen(true)} className="cursor-pointer inline-block">
        {renderTrigger ? (
          renderTrigger()
        ) : (
          <button className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 transition-colors">
            Edit
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-[2.5rem] bg-white p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <header className="mb-6">
              <h3 className="text-2xl font-bold font-josefin uppercase tracking-tight text-black">
                Edit User
              </h3>
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest mt-1">
                Refining access for <span className="text-black">{user.email}</span>
              </p>
            </header>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Full Name</label>
                <input
                  className="input w-full py-3"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Email Address</label>
                <input
                  className="input w-full py-3"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">System Role</label>
                <select
                  className="input w-full py-3"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">New Password (Optional)</label>
                <input
                  className="input w-full py-3"
                  placeholder="Leave blank to keep current"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              
              {err && <p className="text-xs text-red-500 font-medium bg-red-50 p-2 rounded-lg">{err}</p>}
            </div>

            <div className="flex flex-col gap-2 mt-8">
              <button
                onClick={submit}
                disabled={loading}
                className="w-full py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing…' : 'Sync Changes'}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}