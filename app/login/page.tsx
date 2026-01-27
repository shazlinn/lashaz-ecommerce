// ecommerce/app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  
  const params = useSearchParams();
  const router = useRouter();
  
  // callbackUrl handles where to go after successful login (e.g., /admin)
  const callbackUrl = params.get('callbackUrl') ?? '/';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.error) {
      setErr('Invalid email or password');
      setLoading(false);
      return;
    }

    // Success: push to original destination (like /admin)
    router.push(callbackUrl);
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[650px] border border-gray-100">
        
        {/* Left Side: Brand Image (consistent with your modal) */}
        <div className="relative w-full md:w-1/2 bg-zinc-100 hidden md:block">
          <Image 
            src="/sign-up.png" 
            alt="La Shaz Brand Image" 
            fill 
            className="object-cover"
            priority 
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full space-y-8 animate-in fade-in duration-500">
            
            <header>
              <h1 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">
                Welcome Back
              </h1>
              <p className="text-gray-500 mt-2">
                Sign in to manage your store or shop your favorites.
              </p>
            </header>

            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="Email address"
                  className="input w-full py-3.5 focus:ring-2 focus:ring-black/5"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="Password"
                  className="input w-full py-3.5 focus:ring-2 focus:ring-black/5"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              {err && (
                <p className="text-sm font-medium text-red-500 animate-pulse">
                  {err}
                </p>
              )}

              <Link 
                href="/forgot-password" 
                className="text-xs text-gray-400 hover:text-black transition-colors w-fit"
              >
                Forgot your password?
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary py-4 rounded-full font-bold text-lg mt-2 shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Sign In'}
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-josefin tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <button 
              type="button"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4" alt="Google" />
              Continue with Google
            </button>

            <footer className="text-center text-sm text-gray-500">
              New to SmartShop?{' '}
              <Link href="/signup" className="text-black font-bold hover:underline">
                Sign up for free
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}