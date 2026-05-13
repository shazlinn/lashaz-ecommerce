// ecommerce/app/page.tsx
import { Suspense } from 'react'; // 1. Import Suspense
import prisma from '@/lib/prisma';
import Header from '@/components/frontstore/Header';
import HeroSection from '@/components/frontstore/HeroSection';
import Footer from '@/components/frontstore/Footer';
import ProductCard from '@/components/frontstore/ProductCard';

export default async function HomePage() {
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
    take: 4,
    include: {
      category: true,
      tags: { include: { tag: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <div className="flex-grow">
        <HeroSection />
        
        <section className="py-16 bg-black text-white text-center flex items-center justify-center">
          <h2 className="font-josefin font-light tracking-wider uppercase" style={{ fontSize: '40px' }}>
            LA SHAZ: Beauty, Redefined.
          </h2>
        </section>

        <section id="new-arrivals" className="py-24 container mx-auto px-4">
           <h2 className="font-josefin text-5xl md:text-6xl font-bold uppercase mb-16 tracking-tighter text-center">
             New Arrivals
           </h2>
           
           {/* 2. Wrap the ProductCard grid in Suspense */}
           <Suspense fallback={
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-[4/5] bg-zinc-50 animate-pulse rounded-2xl" />
               ))}
             </div>
           }>
             {newArrivals.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
             ) : (
               <div className="text-center py-20 border border-dashed border-zinc-200 rounded-[3rem]">
                 <p className="text-zinc-400 font-medium italic">
                   Curating the latest in glow... coming soon.
                 </p>
               </div>
             )}
           </Suspense>
        </section>
      </div>

      <Footer />
    </main>
  );
}