// app/admin/users/users-client.tsx
'use client';

import { useMemo, useState } from 'react';
import { Table } from '@/components/ui/Table';
import type { AdminUserRow } from '@/lib/users';
import EditUserModal from './EditUserModal';
import NewUserModal from './NewUserModal';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PencilSquareIcon, 
  UserMinusIcon, 
  UserPlusIcon 
} from '@heroicons/react/24/outline';

export default function UsersClient({ initialRows }: { initialRows: AdminUserRow[] }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'customer' | 'admin'>('customer');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeactivated, setShowDeactivated] = useState(false);
  const router = useRouter();
  
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return initialRows
      .filter((u) => u.role === activeTab)
      .filter((u) => (showDeactivated ? true : u.status === 'active'))
      .filter((u) =>
        [u.name ?? '', u.email].some((v) => v.toLowerCase().includes(q))
      );
  }, [query, initialRows, showDeactivated, activeTab]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleTabChange = (tab: 'customer' | 'admin') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  async function toggleUserStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'deactivated' : 'active';
    if (newStatus === 'deactivated' && !confirm('Deactivate this user?')) return;
    
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Role Toggle Tabs */}
      <div className="flex justify-center">
        <div 
          className="p-1 rounded-full flex gap-1 border transition-colors" 
          style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}
        >
          <button 
            onClick={() => handleTabChange('customer')}
            className={`px-8 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'customer' 
              ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' 
              : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-200'
            }`}
          >
            Customers
          </button>
          <button 
            onClick={() => handleTabChange('admin')}
            className={`px-8 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              activeTab === 'admin' 
              ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' 
              : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-zinc-200'
            }`}
          >
            Admins
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        {/* FIXED: Using the 'input' class for theme-aware visibility */}
        <input
          value={query ?? ''}
          onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
          placeholder={`Search ${activeTab}s...`}
          className="w-full max-w-md input rounded-full px-5 py-2.5"
        />
        <NewUserModal onCreated={() => router.refresh()} />
      </div>

      <Table headers={['Name', 'Email', 'Created', 'Status', 'Actions']}>
        {paginatedRows.map((u) => (
          <tr 
            key={u.id} 
            className="table-row border-b" 
            style={{ borderColor: 'var(--border)' }}
          >
            {/* FIXED: Using 'text-fg' for the name */}
            <td className="px-4 py-4 font-josefin font-bold uppercase text-xs tracking-tight text-fg">
              {u.name ?? '-'}
            </td>
            <td className="px-4 py-4 text-sm text-muted">{u.email}</td>
            <td className="px-4 py-4 text-xs text-muted">{u.createdAt}</td>
            <td className="px-4 py-4">
              <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter ${u.status === 'active' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-muted text-muted'}`}>
                {u.status}
              </span>
            </td>
            <td className="px-4 py-4 w-28">
              <div className="flex items-center gap-4">
                <EditUserModal 
                  user={u} 
                  onUpdated={() => router.refresh()} 
                  renderTrigger={() => (
                    <button className="text-muted hover:text-fg transition-colors" title="Edit User">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                  )}
                />
                <button
                  onClick={() => toggleUserStatus(u.id, u.status)}
                  className={`transition-colors ${u.status === 'active' ? 'text-muted hover:text-red-500' : 'text-muted hover:text-green-600'}`}
                >
                  {u.status === 'active' ? <UserMinusIcon className="h-5 w-5" /> : <UserPlusIcon className="h-5 w-5" />}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <div className="flex items-center justify-between pt-4">
        <label className="flex items-center gap-2 text-[10px] font-bold uppercase text-muted tracking-widest cursor-pointer hover:text-fg transition-colors">
          <input
            type="checkbox"
            className="rounded border-gray-300 dark:border-zinc-700 bg-transparent text-black focus:ring-black"
            checked={showDeactivated}
            onChange={(e) => setShowDeactivated(e.target.checked)}
          />
          Show deactivated
        </label>

        <div className="flex items-center gap-4">
          <p className="text-xs text-muted font-medium">
            Page <span className="text-fg font-bold">{currentPage}</span> of {totalPages || 1}
          </p>
          <div className="flex gap-1">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 rounded-full border border-border disabled:opacity-30 hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronLeftIcon className="h-4 w-4 text-muted" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 rounded-full border border-border disabled:opacity-30 hover:bg-muted transition-colors"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronRightIcon className="h-4 w-4 text-muted" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}