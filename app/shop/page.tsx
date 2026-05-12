// ecommerce/app/shop/page.tsx
import { getServerSideProducts } from '@/lib/api';
import ShopContent from '@/components/frontstore/ShopContent';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/frontstore/ProductCard';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string; q?: string }>; // Added q for search
}) {
  const { tags, q: searchQuery } = await searchParams;
  const tagList = tags ? tags.split(',') : [];

  // 1. Search & Filter Logic
  const filteredProducts = (tagList.length > 0 || searchQuery)
    ? await prisma.product.findMany({
        where: {
          AND: [
            // If there's a search query, look in name or description
            searchQuery ? {
              OR: [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } },
              ]
            } : {},
            // If there are tags (from Shade Finder), filter by them too
            tagList.length > 0 ? {
              OR: [
                { tags: { some: { tag: { name: { in: tagList } } } } },
                { skinType: { in: tagList } }
              ]
            } : {}
          ]
        },
        include: { 
          category: true,
          tags: { include: { tag: true } } 
        }
      })
    : [];

  const initialProducts = await getServerSideProducts();

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-12">
        
        {/* SEARCH & TAG RESULTS SECTION */}
        {(tagList.length > 0 || searchQuery) && (
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-2 block">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "Identity Matching Result"}
                </span>
                <h1 className="text-5xl font-bold font-josefin uppercase tracking-tight text-black">
                  {searchQuery ? "Filtered Findings" : "Your Protocol"}
                </h1>
              </div>
              
              <Link href="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">
                <XMarkIcon className="h-4 w-4" />
                Clear Filters
              </Link>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={{
                    ...product,
                    price: Number(product.price),
                    image: product.imageUrl
                  }} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 italic mb-20">No items match your current criteria.</p>
            )}
            <div className="h-[1px] w-full bg-zinc-100 mb-20" />
          </div>
        )}

        <header className="mb-12 border-b border-gray-100 pb-8">
          <h2 className="text-5xl font-bold font-josefin uppercase tracking-tight text-black">
            {(tagList.length > 0 || searchQuery) ? "Extended Collection" : "Shop All"}
          </h2>
          <p className="text-gray-500 mt-2">La Shaz: Curated Beauty Essentials</p>
        </header>

        <ShopContent initialProducts={initialProducts} />
      </div>
      <Footer />
    </main>
  );
}