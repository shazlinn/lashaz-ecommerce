// app/admin/layout.tsx
import type { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import ProfileMenu from '@/components/ProfileMenu';
import ThemeToggle from '@/components/ThemeToggle';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const displayName =
    session?.user?.name ||
    session?.user?.email?.split('@')[0] ||
    'Admin';

  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      <header className="border-b" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="text-lg font-semibold">{displayName}</div>
          <div className="flex items-center gap-3">
            <AdminNav />
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

      <footer className="mt-12 border-t" style={{ borderColor: 'var(--border)' }}>
        <div
          className="mx-auto max-w-6xl px-4 py-6 text-xs"
          style={{ color: 'var(--color-muted)' }}
        >
          La Shaz SmartShop Admin
        </div>
      </footer>
    </div>
  );
}