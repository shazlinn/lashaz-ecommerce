'use client';

import { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  phone?: string;
  form?: string;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function strongPw(pw: string) {
  // Example: at least 8 chars, includes a number and a letter
  return pw.length >= 8 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}

// Returns error message or empty string
function validateField(name: string, value: string, all: any) {
  switch (name) {
    case 'name':
      if (!value.trim()) return 'Please enter your full name';
      return '';
    case 'email':
      if (!isEmail(value)) return 'Please enter a valid email address';
      return '';
    case 'password':
      if (!strongPw(value))
        return 'Password must be 8+ chars and include a letter and a number';
      return '';
    case 'confirm':
      if (value !== all.password) return 'Passwords do not match';
      return '';
    case 'phone':
      if (value && !/^[0-9+\-\s()]{7,}$/.test(value))
        return 'Please enter a valid phone number';
      return '';
    default:
      return '';
  }
}

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirm: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
  };

  function setField(name: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [name]: value }));
    // Live validate on change
    const msg = validateField(name, value, { ...form, [name]: value });
    setErrors((e) => ({ ...e, [name]: msg }));
  }

  function onBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const msg = validateField(name, value, form);
    setErrors((e) => ({ ...e, [name]: msg }));
  }

  function focusFirstInvalid(names: (keyof typeof form)[]) {
    for (const n of names) {
      if (errors[n] || validateField(n, form[n], form)) {
        refs[n].current?.focus();
        break;
      }
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Run full validation
    const nextErrors: Record<string, string> = {};
    (Object.keys(form) as (keyof typeof form)[]).forEach((n) => {
      nextErrors[n] = validateField(n, form[n], form);
    });
    setErrors(nextErrors);

    // Native validity prompt (extra safety)
    const formEl = e.currentTarget;
    if (!formEl.checkValidity()) {
      formEl.reportValidity(); // triggers browser prompt bubbles
      // Focus first invalid ref we know
      focusFirstInvalid(['name', 'email', 'password', 'confirm', 'phone']);
      return;
    }

    // If we still have any custom errors, stop
    const hasCustomError = Object.values(nextErrors).some((m) => m);
    if (hasCustomError) {
      focusFirstInvalid(['name', 'email', 'password', 'confirm', 'phone']);
      return;
    }

    try {
      setLoading(true);
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
      if (!res.ok) {
        const msg = await res.text();
        alert(msg || 'Failed to sign up'); // JS prompt
        setLoading(false);
        return;
      }

      // Auto sign-in
      const login = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      setLoading(false);
      if (login?.error) {
        alert('Account created. Please sign in.');
        router.push('/login');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Failed to sign up');
    }
  }

  const inputStyle = { background: 'var(--card)', color: 'var(--fg)', borderColor: 'var(--border)' };

  return (
    <div className="grid min-h-dvh place-items-center px-4" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <div className="w-full max-w-sm rounded-lg border p-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <h1 className="text-lg font-semibold">Create account</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-muted)' }}>
          Sign up as a customer
        </p>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3" noValidate>
          <div>
            <input
              ref={refs.name}
              name="name"
              placeholder="Full name"
              required
              className={`rounded-md border px-3 py-2 ${errors.name ? 'ring-1 ring-[var(--clr-danger-a10)]' : ''}`}
              style={inputStyle}
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={onBlur}
            />
            {errors.name && <p className="mt-1 text-xs" style={{ color: 'var(--clr-danger-a10)' }}>{errors.name}</p>}
          </div>

          <div>
            <input
              ref={refs.email}
              type="email"
              name="email"
              placeholder="Email"
              required
              className={`rounded-md border px-3 py-2 ${errors.email ? 'ring-1 ring-[var(--clr-danger-a10)]' : ''}`}
              style={inputStyle}
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              onBlur={onBlur}
            />
            {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--clr-danger-a10)' }}>{errors.email}</p>}
          </div>

          <div>
            <input
              ref={refs.password}
              type="password"
              name="password"
              placeholder="Password (min 8, letter & number)"
              required
              minLength={8}
              className={`rounded-md border px-3 py-2 ${errors.password ? 'ring-1 ring-[var(--clr-danger-a10)]' : ''}`}
              style={inputStyle}
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              onBlur={onBlur}
            />
            {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--clr-danger-a10)' }}>{errors.password}</p>}
          </div>

          <div>
            <input
              ref={refs.confirm}
              type="password"
              name="confirm"
              placeholder="Confirm password"
              required
              className={`rounded-md border px-3 py-2 ${errors.confirm ? 'ring-1 ring-[var(--clr-danger-a10)]' : ''}`}
              style={inputStyle}
              value={form.confirm}
              onChange={(e) => setField('confirm', e.target.value)}
              onBlur={onBlur}
            />
            {errors.confirm && <p className="mt-1 text-xs" style={{ color: 'var(--clr-danger-a10)' }}>{errors.confirm}</p>}
          </div>

          <div>
            <input
              ref={refs.phone}
              name="phone"
              placeholder="Phone (optional)"
              className={`rounded-md border px-3 py-2 ${errors.phone ? 'ring-1 ring-[var(--clr-danger-a10)]' : ''}`}
              style={inputStyle}
              value={form.phone}
              onChange={(e) => setField('phone', e.target.value)}
              onBlur={onBlur}
            />
            {errors.phone && <p className="mt-1 text-xs" style={{ color: 'var(--clr-danger-a10)' }}>{errors.phone}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md px-3 py-2 text-sm disabled:opacity-60"
            style={{ background: 'var(--clr-primary-a10)', color: 'var(--clr-light-a0)' }}
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs" style={{ color: 'var(--color-muted)' }}>
          <a href="/forgot-password" className="underline" style={{ color: 'var(--clr-info-a10)' }}>
            Forgot password?
          </a>
          <a href="/login" className="underline" style={{ color: 'var(--clr-info-a10)' }}>
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}