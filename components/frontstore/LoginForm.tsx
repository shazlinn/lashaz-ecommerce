'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link'; // Import Link

export default function LoginForm({ onSuccess, onSwitch }: { onSuccess: () => void; onSwitch: () => void }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-sans">
      <header>
        <h2 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">Welcome Back</h2>
        <p className="text-gray-500 mt-2">Sign in for a better shopping experience</p>
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
        
        {/* FIX: Changed from <button> to <Link> and added href */}
        {/* Using Link prevents the form from validating or submitting */}
        <Link 
          href="/forgot-password" 
          className="text-xs text-gray-400 hover:text-black text-left w-fit"
        >
          Forgot your password?
        </Link>

        <button 
          type="submit" 
          disabled={loading} 
          className="btn-primary py-4 rounded-full font-bold text-lg mt-2 shadow-lg active:scale-95 transition-transform"
        >
          {loading ? 'Verifying...' : 'Sign In'}
        </button>
      </form>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase font-josefin">or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <button 
        type="button" 
        className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-full hover:bg-gray-50 transition-colors text-sm font-medium"
      >
        <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-4 w-4" alt="Google" />
        Continue with Google
      </button>

      <p className="text-center text-sm text-gray-500">
        New to SmartShop? <button type="button" onClick={onSwitch} className="text-black font-bold hover:underline">Sign up for free</button>
      </p>
    </div>
  );
}