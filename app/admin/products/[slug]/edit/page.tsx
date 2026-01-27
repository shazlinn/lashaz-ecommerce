// lashaz-ecommerce/app/admin/products/[slug]/edit/page.tsx
import prisma from '@/lib/prisma';
import EditProductForm from './EditProductForm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Unwrapping params to get the slug
  const { slug } = await params;

  // 2. Fetch product by slug since the folder name changed to [slug]
  const product = await prisma.product.findUnique({
    where: { slug }, // Updated from id to slug
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });

  if (!product) notFound();

  // 3. Normalize data for the form
  const initialData = {
    id: product.id,
    slug: product.slug, // Pass the slug to the form
    name: product.name,
    description: product.description ?? '',
    price: product.price.toString(),
    stock: product.stock,
    categoryId: product.categoryId ?? '',
    imageUrl: product.imageUrl ?? '', 
    tags: product.tags.map(pt => pt.tag?.name).filter(Boolean).join(', '),
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 font-sans p-6 lg:p-0">
      <div className="flex flex-col gap-6">
        <Link 
          href="/admin/products" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors w-fit"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Inventory
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold font-josefin uppercase tracking-tight text-black">
              Edit Product
            </h1>
            <p className="text-sm text-gray-500">
              Refine details for <span className="text-black font-semibold">{product.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="hidden md:block text-[10px] font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 uppercase">
              Slug: {product.slug}
            </p>
            {/* Updated preview link to use slug */}
            <Link 
              href={`/product/${product.slug}`}
              target="_blank"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-6 py-3 border border-black rounded-full hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
            >
              <EyeIcon className="h-4 w-4" />
              Preview Store
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden">
        <div className="bg-zinc-50/50 px-8 py-4 border-b border-gray-100">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Product Specifications
          </span>
        </div>
        <div className="p-8 md:p-14">
          <EditProductForm product={initialData} />
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 italic">
        Changes made here will update the live storefront immediately.
      </p>
    </div>
  );
}