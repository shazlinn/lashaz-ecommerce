import prisma from '@/lib/prisma';
import ProductsClient from './products-client';

export default async function ProductsPage() {
  // Fetch products from the database using the established schema 
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price.toString(), // Client formats this as MYR
    stock: p.stock,
    category: p.category?.name ?? '-',
    tags: p.tags.map((pt) => pt.tag?.name ?? ''),
    imageUrl: p.imageUrl,
  }));

  return (
    <section className="space-y-6">
      {/* Page Title & Subtitle - Aligned with your new Dashboard design */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted">
          Manage your catalog, track stock levels, and organize categories or tags.
        </p>
      </div>

      {/* The main client-side interface for search and table management */}
      <ProductsClient initialRows={rows} />
    </section>
  );
}