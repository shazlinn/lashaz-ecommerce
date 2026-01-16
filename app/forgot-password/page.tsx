'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      // Always show a success message for security to prevent email enumeration
      setMsg('If this email exists in our system, a reset link has been sent.');
    } catch (err) {
      setMsg('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] border border-gray-100">
        
        {/* Left Side: Brand Image matching signup/login flow */}
        <div className="relative w-full md:w-1/2 bg-zinc-100 hidden md:block">
          <Image 
            src="/sign-up.png" 
            alt="Authentication Illustration" 
            fill 
            className="object-cover"
            priority 
          />
        </div>

        {/* Right Side: Form Logic */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white relative">
          
          <Link 
            href="/" 
            className="absolute top-8 left-8 flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="max-w-sm mx-auto w-full space-y-8">
            <header className="space-y-3">
              <h1 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">
                Reset Password
              </h1>
              <p className="text-gray-500 leading-relaxed">
                Enter the email associated with your account and we'll send you a link to reset your password.
              </p>
            </header>

            {!msg ? (
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="input w-full py-4 text-base focus:ring-2 focus:ring-black/5 transition-all"
                    placeholder="e.g. shazlin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all mt-2 disabled:opacity-50"
                >
                  {loading ? 'Sending Request...' : 'Send Reset Link'}
                </button>
              </form>
            ) : (
              <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl animate-in fade-in zoom-in duration-300">
                <p className="text-zinc-600 text-center font-medium">
                  {msg}
                </p>
                <button 
                  onClick={() => setMsg('')}
                  className="w-full mt-4 text-sm font-bold underline text-black text-center"
                >
                  Try a different email
                </button>
              </div>
            )}

            {/* <footer className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-400">Remembered your password?</span>
              <Link href="/" className="font-bold text-black underline">
                Log In
              </Link>
            </footer> */}
          </div>
        </div>
      </div>
    </main>
  );
}