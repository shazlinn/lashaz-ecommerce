// ecommerce/app/reset-password/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    if (password.length < 8) {
      setMsg('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      setMsg('Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) {
      setMsg('Password updated. You can now sign in.');
      setTimeout(() => router.push('/login'), 1500);
    } else {
      setMsg('Reset link invalid or expired.');
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <div className="w-full max-w-sm rounded-lg border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <h1 className="text-lg font-semibold">Reset password</h1>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input
            type="password"
            className="rounded-md border px-3 py-2"
            style={{ background: 'var(--card)', color: 'var(--fg)', borderColor: 'var(--border)' }}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="rounded-md border px-3 py-2"
            style={{ background: 'var(--card)', color: 'var(--fg)', borderColor: 'var(--border)' }}
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          {msg && <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{msg}</div>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md px-3 py-2 text-sm"
            style={{ background: 'var(--clr-primary-a10)', color: 'var(--clr-light-a0)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Saving…' : 'Save password'}
          </button>
        </form>
      </div>
    </div>
  );
}