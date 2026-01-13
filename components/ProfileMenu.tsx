'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function ProfileMenu() {
  const { data: session, status } = useSession(); // requires SessionProvider in root
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const userName = session?.user?.name ?? 'Account';
  const initials =
    (session?.user?.name?.[0] ??
      session?.user?.email?.[0] ??
      'U'
    ).toUpperCase();

  // Not logged in -> single button to login
  if (status !== 'loading' && !session) {
    return (
      <button
        onClick={() => signIn(undefined, { callbackUrl: '/' })}
        aria-label="Sign in"
        className="relative grid h-9 w-9 place-items-center rounded-full border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
        title="Sign in"
      >
        {/* simple user icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21a8 8 0 0 0-16 0"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
    );
  }

  // Logged in -> avatar + dropdown
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="relative grid h-9 w-9 place-items-center rounded-full border"
        style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
        title={userName}
      >
        <span className="text-xs font-semibold">{initials}</span>
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-md border shadow-sm"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="px-3 py-2 text-xs" style={{ color: 'var(--color-muted)' }}>
            {session?.user?.email ?? userName}
          </div>
          <Divider />
          <MenuItem href="/profile">View profile</MenuItem>
          <MenuItem href="/admin">Admin home</MenuItem>
          <Divider />
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="block w-full px-3 py-2 text-left text-sm hover:opacity-80"
            style={{ color: 'var(--fg)' }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-sm hover:opacity-80"
      style={{ color: 'var(--fg)' }}
    >
      {children}
    </Link>
  );
}
function Divider() {
  return <div style={{ borderTop: '1px solid var(--border)' }} />;
}