// app/admin/products/products-client.tsx
'use client';

import { useMemo, useState } from 'react';
import { Table } from '@/components/ui/Table';
import { useRouter } from 'next/navigation';
import NewProductModal from './NewProductModal';
import EditProductModal from './EditProductModal';
import NewCategoryModal from './NewCategoryModal';

export type ProductRow = {
  id: string;
  name: string;
  price: string; // as string from server; formatted in render
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
  if (!confirm('Delete this product?')) return;
  const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
  const txt = await res.text().catch(() => '');
  console.log('DELETE product', id, res.status, txt);
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
        <NewCategoryModal onCreated={() => router.refresh()} />
        <NewProductModal onCreated={() => router.refresh()} />
      </div>
    </div>

      <Table headers={['Name', 'Price', 'Stock', 'Category', 'Tags', '']}>
        {filtered.map((p) => (
          <tr key={p.id} className="table-row">
            <td className="px-4 py-3">{p.name}</td>
            <td className="px-4 py-3">
              {formatMYR(p.price)}
            </td>
            <td className="px-4 py-3">{p.stock}</td>
            <td className="px-4 py-3">{p.category}</td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full px-2 py-0.5 xs" style={{ background: 'var(--card)', color: 'var(--color-muted)', border: '1px solid var(--border)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                    {/* Add the key prop here using p.id */}
                    <EditProductModal 
                    key={p.id} 
                    product={p} 
                    onUpdated={() => router.refresh()} 
                    />
                    <button onClick={() => deleteProduct(p.id)} className="btn-muted xs">
                    Delete
                    </button>
                </div>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}

function formatMYR(val: string | number) {
  const num = typeof val === 'string' ? Number(val) : val;
  if (Number.isNaN(num)) return val;
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(num);
}