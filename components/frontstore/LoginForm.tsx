'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginForm({ onSuccess, onSwitch }: { onSuccess: () => void; onSwitch: () => void }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false); // New state for Google login

  // Standard Credentials Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    if (res?.ok) {
      onSuccess();
    } else {
      alert("Invalid email or password");
      setLoading(false);
    }
  }

  // Google OAuth Login logic
  async function handleGoogleLogin() {
    setSocialLoading(true);
    // NextAuth handles the redirect to Google's consent screen automatically
    await signIn('google', { callbackUrl: '/' }); 
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      <header>
        <h2 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Sign in to your La Shaz account</p>
      </header>

      <form onSubmit={handleLogin} className="grid gap-4">
        <input 
          className="input py-3.5" 
          placeholder="Email address" 
          type="email"
          value={form.email} 
          onChange={e => setForm({...form, email: e.target.value})} 
          required 
        />
        <input 
          className="input py-3.5" 
          type="password" 
          placeholder="Password" 
          value={form.password} 
          onChange={e => setForm({...form, password: e.target.value})} 
          required 
        />
        
        <Link 
          href="/forgot-password" 
          className="text-xs text-gray-400 hover:text-black text-left w-fit"
        >
          Forgot your password?
        </Link>

        <button 
          type="submit" 
          disabled={loading || socialLoading} 
          className="btn-primary py-4 rounded-full font-bold text-lg mt-2 shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Sign In'}
        </button>
      </form>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-josefin">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* UPDATED: Google Sign-In Button */}
      <button 
        type="button" 
        disabled={loading || socialLoading}
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4" alt="Google" />
        {socialLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      <p className="text-center text-sm text-gray-500">
        New to La Shaz? <button type="button" onClick={onSwitch} className="text-black font-bold hover:underline">Sign up for free</button>
      </p>
    </div>
  );
}