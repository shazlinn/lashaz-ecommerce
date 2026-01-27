// lashaz-ecommerce/app/admin/products/page.tsx
import prisma from '@/lib/prisma';
import ProductsClient from './products-client';

export default async function ProductsPage() {
  // Fetch products including the new slug field from your schema
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { name: true } },
      tags: { include: { tag: true } },
    },
  });

  const rows = products.map((p) => ({
    id: p.id,
    slug: p.slug, // NEW: Include the slug for dynamic routing
    name: p.name,
    price: p.price.toString(),
    stock: p.stock,
    category: p.category?.name ?? '-',
    tags: p.tags.map((pt) => pt.tag?.name ?? ''),
    imageUrl: p.imageUrl,
  }));

  return (
    <section className="space-y-6 font-sans">
      {/* Page Title & Header - Optimized for the La Shaz aesthetic */}
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold font-josefin uppercase tracking-tight text-black">
          Inventory
        </h1>
        <p className="text-sm text-gray-500">
          Manage your beauty catalog, track stock, and organize collections.
        </p>
      </div>

      {/* The client-side table interface */}
      <ProductsClient initialRows={rows} />
    </section>
  );
}