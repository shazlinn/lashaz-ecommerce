// app/admin/layout.tsx
import type { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  // Guard: Ensure only admins can access these routes
  if (!session || session.user.role !== 'admin') {
    redirect('/login');
  }

  const userEmail = session.user.email || '';
  const userName = session.user.name || userEmail.split('@')[0] || 'Admin';

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
      {/* 1. SIDEBAR 
          Fixed to the left. Width is 64 (16rem / 256px).
      */}
      <AdminSidebar user={{ name: userName, email: userEmail }} />

      {/* 2. MAIN CONTENT AREA 
          Offset by the sidebar width (pl-64).
      */}
      <div className="flex flex-1 flex-col pl-64">
        {/* TOP HEADER 
            Contains Search, ThemeToggle, and Profile
        */}
        <AdminHeader />

        {/* PAGE CONTENT 
            Responsive container for Dashboard, Products, etc.
        */}
        <main className="p-8">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="mt-auto border-t p-8 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--color-muted)' }}>
          &copy; {new Date().getFullYear()} La Shaz SmartShop Admin System
        </footer>
      </div>
    </div>
  );
}