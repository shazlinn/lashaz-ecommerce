'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import ThemeToggle from '../ThemeToggle';
import { BellIcon, ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';

export default function AdminHeader() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const initials = (
    session?.user?.name?.[0] ?? 
    session?.user?.email?.[0] ?? 
    'U'
  ).toUpperCase();

  return (
    <header 
      className="sticky top-0 z-10 flex h-16 items-center justify-end border-b px-8"
      style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="rounded-full p-2 text-muted hover:bg-black/5 dark:hover:bg-white/5 relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-bg" />
        </button>

        <ThemeToggle />

        {/* Profile Section */}
        <div className="relative" ref={dropdownRef}>
          {status === 'authenticated' ? (
            <>
              <button
                onClick={() => setOpen(!open)}
                className="grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold transition-colors hover:opacity-80"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
              >
                {initials}
              </button>

              {open && (
                <div
                  className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-md border shadow-lg"
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                    {session.user.email}
                  </div>
                  <div className="border-t" style={{ borderColor: 'var(--border)' }} />
                  
                  <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--fg)' }}>
                    View Profile
                  </Link>
                  <Link href="/admin" className="block px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5" style={{ color: 'var(--fg)' }}>
                    Admin Home
                  </Link>
                  
                  <div className="border-t" style={{ borderColor: 'var(--border)' }} />
                  
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
                    style={{ color: 'var(--clr-danger-a0)' }}
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="grid h-9 w-9 place-items-center rounded-full border transition-colors hover:bg-black/5"
              style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--fg)' }}
            >
              <UserIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}