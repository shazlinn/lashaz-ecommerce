// app/admin/products/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { Table } from "@/components/ui/Table";

type ProductRow = {
  id: string;
  name: string;
  price: string;
  stock: number;
  category: string;
  tags: string[];
};

const MOCK: ProductRow[] = [
  { id: "p_1", name: "Matte Lipstick", price: "RM 29.00", stock: 42, category: "Makeup", tags: ["lip", "matte"] },
  { id: "p_2", name: "Hydrating Serum", price: "RM 59.00", stock: 12, category: "Skincare", tags: ["serum", "hydration"] },
];

export default function ProductsPage() {
  const [query, setQuery] = useState("");

  const filtered = MOCK.filter((p) =>
    [p.name, p.category, p.tags.join(" ")].some((v) =>
      v.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <section>
      <PageHeader
        title="Products"
        subtitle="Manage catalog, stock, categories, and tags"
        actions={
          <button className="rounded-md bg-zinc-900 px-3 py-2 text-white">
            New Product
          </button>
        }
      />
      <div className="mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search product name, category, or tag..."
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
        />
      </div>

      <Table headers={["Name", "Price", "Stock", "Category", "Tags", ""]}>
        {filtered.map((p) => (
          <tr key={p.id}>
            <td className="px-4 py-3">{p.name}</td>
            <td className="px-4 py-3">{p.price}</td>
            <td className="px-4 py-3">{p.stock}</td>
            <td className="px-4 py-3">{p.category}</td>
            <td className="px-4 py-3">
              <div className="flex flex-wrap gap-1">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-2">
                <button className="rounded-md border border-zinc-300 px-2 py-1 text-xs">
                  Edit
                </button>
                <button className="rounded-md border border-zinc-300 px-2 py-1 text-xs">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>
    </section>
  );
}