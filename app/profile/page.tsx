import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-lg font-semibold">Profile</h1>
        <p className="mt-2">You are not signed in.</p>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-lg font-semibold">Profile</h1>
      <div className="mt-4 rounded-lg border p-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div>Name: {session.user?.name ?? '-'}</div>
        <div>Email: {session.user?.email ?? '-'}</div>
        <div>Role: {(session.user as any)?.role ?? '-'}</div>
      </div>
    </div>
  );
}