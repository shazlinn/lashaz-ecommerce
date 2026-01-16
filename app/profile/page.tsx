import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LogoutButton from '@/components/frontstore/LogoutButton';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 font-sans">
        <h1 className="text-3xl font-bold font-josefin uppercase tracking-tight">Profile</h1>
        <p className="mt-4 text-muted">You are not signed in.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 font-sans">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">
          Your Account
        </h1>
        <p className="text-muted mt-2">Manage your personal details and settings.</p>
      </header>

      <div 
        className="rounded-[1.5rem] border p-8 space-y-6 shadow-sm" 
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</span>
          <div className="text-lg font-medium">{session.user?.name ?? '-'}</div>
        </div>

        <div className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</span>
          <div className="text-lg font-medium">{session.user?.email ?? '-'}</div>
        </div>

        <div className="grid gap-1">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Account Role</span>
          <div className="text-lg font-medium capitalize">{(session.user as any)?.role ?? 'Customer'}</div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}