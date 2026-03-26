// app/admin/products/products-client.tsx
'use client';

import { useMemo, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Added icons for Edit and Delete
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export type ProductRow = {
  id: string;
  slug: string; // Added slug
  name: string;
  price: string; 
  stock: number;
  category: string;
  tags: string[];
  imageUrl?: string | null;
};

export default function ProductsClient({ initialRows }: { initialRows: ProductRow[] }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return initialRows.filter((p) =>
      [p.name, p.category, p.tags.join(' ')].some((v) =>
        v.toLowerCase().includes(q)
      )
    );
  }, [query, initialRows]);

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product? This will also remove it from cloud storage.')) return;
    
    // API call still uses ID as the primary identifier
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const txt = await res.text().catch(() => '');
    
    if (!res.ok) {
      alert(`Delete failed: ${res.status} ${txt}`);
      return;
    }
    router.refresh();
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, category, or tag..."
          className="w-full max-w-md input"
        />
        <div className="flex items-center gap-2">
          <Link href="/admin/products/new" className="btn-secondary">
              + Add Product
          </Link>
        </div>
      </div>

      <Table headers={['', 'Name', 'Price', 'Stock', 'Category', 'Tags', '']}>
        {filtered.map((p) => {
          const firstImage = p.imageUrl?.split(',')[0];

          return (
            <tr key={p.id} className="table-row">
              <td className="px-4 py-3">
                <div 
                  className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border bg-muted" 
                  style={{ borderColor: 'var(--border)' }}
                >
                  {firstImage ? (
                    <img 
                      src={firstImage} 
                      alt={p.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-muted leading-tight text-center px-1">
                      No Image
                    </div>
                  )}
                </div>
              </td>

              <td className="px-4 py-3 font-medium text-fg">{p.name}</td>
              <td className="px-4 py-3">
                {formatMYR(p.price)}
              </td>
              <td className="px-4 py-3">
                <span className={p.stock < 5 ? "text-red-500 font-bold" : ""}>
                  {p.stock}
                </span>
              </td>
              <td className="px-4 py-3 text-muted">{p.category}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => (
                    <span 
                      key={t} 
                      className="rounded-full px-2 py-0.5 xs" 
                      style={{ 
                        background: 'var(--card)', 
                        color: 'var(--muted)', 
                        border: '1px solid var(--border)' 
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                      {/* Updated to use slug for the URL */}
                      <Link 
                        href={`/admin/products/${p.slug}/edit`} 
                        className="btn-muted p-2 hover:text-black transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button 
                        onClick={() => deleteProduct(p.id)} 
                        className="btn-muted p-2 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                  </div>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}

function formatMYR(val: string | number) {
  const num = typeof val === 'string' ? Number(val) : val;
  if (Number.isNaN(num)) return val;
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(num);
}