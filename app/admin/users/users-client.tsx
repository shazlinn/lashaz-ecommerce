'use client';

import { useMemo, useState } from 'react';
import { Table } from '@/components/ui/Table';
import type { AdminUserRow } from '@/lib/users';
import EditUserModal from './EditUserModal';
import NewUserModal from './NewUserModal';
import { useRouter } from 'next/navigation';

export default function UsersClient({ initialRows }: { initialRows: AdminUserRow[] }) {
  const [query, setQuery] = useState('');
  const [showDeactivated, setShowDeactivated] = useState(false);
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return initialRows
      .filter((u) => (showDeactivated ? true : u.status === 'active'))
      .filter((u) =>
        [u.name ?? '', u.email, u.role].some((v) => v.toLowerCase().includes(q))
      );
  }, [query, initialRows, showDeactivated]);

  async function deactivateUser(id: string) {
    if (!confirm('Set user status to deactivated?')) return;
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'deactivated' }),
    });
    router.refresh();
  }

  async function activateUser(id: string) {
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' }),
    });
    router.refresh();
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            value={query ?? ''}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, or role..."
            autoComplete="off"
            className="w-72 rounded-md border px-3 py-2 text-sm outline-none"
            style={{ borderColor: 'var(--border)' }}
          />
          {/* <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
            <input
              type="checkbox"
              checked={showDeactivated}
              onChange={(e) => setShowDeactivated(e.target.checked)}
            />
            Show deactivated
          </label> */}
        </div>
        <NewUserModal onCreated={() => router.refresh()} />
      </div>

      <Table headers={['Name', 'Email', 'Role', 'Created', 'Status', '']}>
        {filtered.map((u) => (
          <tr key={u.id}>
            <td className="px-4 py-3">{u.name ?? '-'}</td>
            <td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3">{u.role}</td>
            <td className="px-4 py-3">{u.createdAt}</td>
            <td className="px-4 py-3">
              <span className={`rounded-full px-2 py-1 text-xs ${u.status === 'active' ? 'pill-active' : 'pill-muted'}`}>
                {u.status}
              </span>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">
                <EditUserModal user={u} onUpdated={() => router.refresh()} />
                {u.status === 'active' ? (
                  <button
                    onClick={() => deactivateUser(u.id)}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => activateUser(u.id)}
                    className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
                  >
                    Activate
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </Table>
      <br></br>
    <label className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
            <input
              type="checkbox"
              checked={showDeactivated}
              onChange={(e) => setShowDeactivated(e.target.checked)}
            />
            Show deactivated
    </label>
    </>
  );
}