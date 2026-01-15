'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);
    const res = await fetch('/api/auth/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) {
      setMsg('If this email exists, a reset link has been sent.');
    } else {
      setMsg('If this email exists, a reset link has been sent.');
    }
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <div className="w-full max-w-sm rounded-lg border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <h1 className="text-lg font-semibold">Forgot password</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
          Enter your email to receive a reset link.
        </p>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input
            type="email"
            className="rounded-md border px-3 py-2"
            style={{ background: 'var(--card)', color: 'var(--fg)', borderColor: 'var(--border)' }}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md px-3 py-2 text-sm"
            style={{ background: 'var(--clr-info-a10)', color: 'var(--clr-light-a0)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        {msg && <div className="mt-3 text-sm" style={{ color: 'var(--color-muted)' }}>{msg}</div>}
      </div>
    </div>
  );
}