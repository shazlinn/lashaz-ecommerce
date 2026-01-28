// lashaz-ecommerce/app/shop/page.tsx
import { getServerSideProducts } from '@/lib/api';
import ShopContent from '@/components/frontstore/ShopContent';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';
import prisma from '@/lib/prisma'; //
import ProductCard from '@/components/frontstore/ProductCard';
import Link from 'next/link';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tags?: string }>;
}) {
  // 1. Await and parse tags from the Shade Finder
  const { tags } = await searchParams;
  const tagList = tags ? tags.split(',') : [];

  // 2. Refined Multi-Column Query
  // This checks the Tags relationship OR the specific skinType column
  const matches = tagList.length > 0 
    ? await prisma.product.findMany({
        where: {
          OR: [
            {
              tags: {
                some: {
                  tag: {
                    name: { in: tagList }
                  }
                }
              }
            },
            {
              skinType: { in: tagList } //
            }
          ]
        },
        include: { category: true }
      })
    : [];

  // 3. Fetch standard products for the main collection
  const initialProducts = await getServerSideProducts();

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-12">
        
        {/* PERSONALIZED PROTOCOL SECTION */}
        {tagList.length > 0 && (
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-2 block">
                  Identity Matching Result
                </span>
                <h1 className="text-5xl font-bold font-josefin uppercase tracking-tight text-black">
                  Your Protocol
                </h1>
              </div>
              
              {/* Reset Filter Button */}
              <Link 
                href="/shop" 
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors border-b border-transparent hover:border-black pb-1"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear Results
              </Link>
            </div>

            {/* Match Grid */}
            {matches.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-20">
                {matches.map((product) => (
                  <ProductCard key={product.id} product={{
                    ...product,
                    price: Number(product.price), // Handle Decimal serialization
                    image: product.imageUrl // Mapping DB field correctly
                  }} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400 italic mb-20">No exact shade matches found, but explore our essentials below.</p>
            )}
            
            <div className="h-[1px] w-full bg-zinc-100 mb-20" />
          </div>
        )}

        {/* DEFAULT SHOP HEADER */}
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h2 className="text-5xl font-bold font-josefin uppercase tracking-tight text-black">
            {tagList.length > 0 ? "Extended Collection" : "Shop All"}
          </h2>
          <p className="text-gray-500 mt-2">La Shaz: Curated Beauty Essentials</p>
        </header>

        {/* Passes products to the filterable client component */}
        <ShopContent initialProducts={initialProducts} />
      </div>
      <Footer />
    </main>
  );
}