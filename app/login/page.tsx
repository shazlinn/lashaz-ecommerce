'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get('callbackUrl') ?? '/';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setErr('Invalid email or password');
      return;
    }
    router.push(callbackUrl);
  }

  return (
    <div className="grid min-h-dvh place-items-center px-4" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <div className="w-full max-w-sm rounded-lg border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <h1 className="text-lg font-semibold">Sign in</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
          Use your email and password
        </p>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input
            type="email"
            placeholder="Email"
            className="rounded-md border px-3 py-2"
            style={{ background: 'var(--card)', color: 'var(--fg)', borderColor: 'var(--border)' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="rounded-md border px-3 py-2"
            style={{ background: 'var(--card)', color: 'var(--fg)', borderColor: 'var(--border)' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {err && <div className="text-sm" style={{ color: 'var(--clr-danger-a10)' }}>{err}</div>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-md px-3 py-2 text-sm"
            style={{
              background: 'var(--clr-primary-a10)',
              color: 'var(--clr-light-a0)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--color-muted)' }}>
          <a href="/forgot-password" className="underline" style={{ color: 'var(--clr-info-a10)' }}>
            Forgot password?
          </a>
          <a href="/signup" className="underline" style={{ color: 'var(--clr-info-a10)' }}>
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}