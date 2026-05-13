// ecommerce/app/new-arrivals/page.tsx
import { Suspense } from 'react'; // 1. Added Suspense import
import prisma from '@/lib/prisma';
import ProductCard from '@/components/frontstore/ProductCard';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';

export default async function NewArrivalsPage() {
  const newArrivals = await prisma.product.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: {
              equals: 'new',
              mode: 'insensitive'
            }
          }
        }
      }
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc' 
    }
  });

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-12">
        <header className="mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-2 block">
            Freshly Curated
          </span>
          <h1 className="text-6xl font-bold font-josefin uppercase tracking-tight text-black">
            New Arrivals
          </h1>
          <div className="h-1 w-20 bg-black mt-4" />
        </header>

        {newArrivals.length > 0 ? (
          /* 2. Wrapped the product grid in a Suspense boundary */
          <Suspense fallback={
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-zinc-50 animate-pulse rounded-2xl" />
              ))}
            </div>
          }>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {newArrivals.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    price: Number(product.price),
                    image: product.imageUrl 
                  }} 
                />
              ))}
            </div>
          </Suspense>
        ) : (
          <div className="py-20 text-center border border-dashed border-zinc-200 rounded-[3rem]">
            <p className="text-zinc-400 uppercase text-xs font-bold tracking-widest">
              Our latest protocol is currently being calibrated.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}