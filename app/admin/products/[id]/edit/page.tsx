// app/admin/products/[id]/edit/page.tsx
import prisma from '@/lib/prisma';
import EditProductForm from './EditProductForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!product) notFound();

  // Normalize data for the form component
  const initialData = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    stock: product.stock,
    categoryId: product.categoryId,
    imageUrl: product.imageUrl ?? '',
    tags: product.tags.map(pt => pt.tag.name).join(', '),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/products" className="text-xs text-muted hover:underline">← Back to Product List</Link>
          <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
          <p className="text-sm text-muted">ID: {product.id}</p>
        </div>
      </div>
      <EditProductForm product={initialData} />
    </div>
  );
}