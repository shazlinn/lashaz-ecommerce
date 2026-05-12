'use client';

import { useMemo, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CategoriesClient({ initialRows }: { initialRows: any[] }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = useMemo(() => {
    return initialRows.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, initialRows]);

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? Products in this category must be reassigned first.')) return;
    
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { 
        method: 'DELETE' 
      });

      if (res.ok) {
        router.refresh();
      } else {
        const errorMsg = await res.text();
        alert(errorMsg || 'Failed to delete category.');
      }
    } catch (error) {
      alert('A network error occurred.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input 
          className="input max-w-sm" 
          placeholder="Search categories..." 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
        />
        <Link href="/admin/categories/new" className="btn-secondary">+ New Category</Link>
      </div>

      <Table headers={['Name', 'Description', 'Products', 'Actions']}>
        {filtered.map((c) => (
          <tr key={c.id} className="table-row">
            <td className="px-4 py-3 font-medium">{c.name}</td>
            <td className="px-4 py-3 text-muted">{c.description}</td>
            <td className="px-4 py-3">{c.productCount}</td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => deleteCategory(c.id)} 
                  className="btn-muted xs hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}