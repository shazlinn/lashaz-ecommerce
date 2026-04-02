// ecommerce/app/reset-password/page.tsx
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
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
    <div className="w-full max-w-sm rounded-lg border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <h1 className="text-lg font-semibold">Reset password</h1>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <input
          type="password"
          className="rounded-md border px-3 py-2 text-sm"
          style={{ background: 'var(--card)', color: 'var(--fg)', borderColor: 'var(--border)' }}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="rounded-md border px-3 py-2 text-sm"
          style={{ background: 'var(--card)', color: 'var(--fg)', borderColor: 'var(--border)' }}
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        
        {msg && (
          <div className="text-xs font-medium" style={{ color: 'var(--color-muted)' }}>
            {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md px-3 py-2 text-sm font-bold transition-all active:scale-95"
          style={{ 
            background: 'var(--clr-primary-a10)', 
            color: 'var(--clr-light-a0)', 
            opacity: loading ? 0.7 : 1 
          }}
        >
          {loading ? 'Saving…' : 'Save password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main 
      className="grid min-h-dvh place-items-center px-4" 
      style={{ background: 'var(--bg)', color: 'var(--fg)' }}
    >
      <Suspense fallback={
        <div className="flex flex-col items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
            Validating Token...
          </p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}