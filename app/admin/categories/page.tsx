import prisma from '@/lib/prisma';
import CategoriesClient from './categories-client';

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  });

  const rows = categories.map(c => ({
    id: c.id,
    name: c.name,
    description: c.description || '-',
    productCount: c._count.products,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted">Manage product groupings and organization.</p>
        </div>
      </div>
      <CategoriesClient initialRows={rows} />
    </div>
  );
}