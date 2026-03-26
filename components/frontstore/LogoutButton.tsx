// components/frontstore/LogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="mt-6 px-6 py-2 rounded-full font-bold text-sm transition-all active:scale-95"
      style={{ 
        background: 'var(--card)', 
        color: 'var(--fg)', 
        border: '1px solid var(--border)' 
      }}
    >
      Log Out
    </button>
  );
}