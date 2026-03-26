'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function SignupForm({ onSuccess, onSwitch }: { onSuccess: () => void; onSwitch: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords do not match");
    
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phone: form.phone.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const login = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (login?.ok) onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h2 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">Sign Up</h2>
        <p className="text-gray-500 mt-2">Create an account to access all our products</p>
      </header>

      <form onSubmit={handleSubmit} className="grid gap-3">
        <input className="input py-3.5" placeholder="Full name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input className="input py-3.5" type="email" placeholder="Email address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input className="input py-3.5" type="password" placeholder="Password (8+ chars)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <input className="input py-3.5" type="password" placeholder="Confirm password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} required />
        
        <label className="flex items-start gap-2 text-xs text-gray-500 mt-2">
          <input type="checkbox" required className="mt-1" />
          <span>I agree to the <span className="underline">Terms of Use</span> and <span className="underline">Privacy Policy</span></span>
        </label>

        <button disabled={loading} className="btn-primary py-4 rounded-full font-bold text-lg mt-4 shadow-lg active:scale-95 transition-transform">
          {loading ? 'Processing...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account? <button onClick={onSwitch} className="text-black font-bold hover:underline">Log in</button>
      </p>
    </div>
  );
}