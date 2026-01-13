import { PageHeader } from '@/components/admin/PageHeader';
import { Table } from '@/components/ui/Table';
import prisma from '@/lib/prisma';
import ProductsClient from './products-client';

export default async function ProductsPage() {
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
    price: p.price.toString(), // render formatting in client
    stock: p.stock,
    category: p.category?.name ?? '-',
    tags: p.tags.map((pt) => pt.tag.name),
    imageUrl: p.imageUrl,
  }));

  return (
    <section>
      <PageHeader
        title="Products"
        subtitle="Manage catalog, stock, categories, and tags"
      />
      <ProductsClient initialRows={rows} />
    </section>
  );
}