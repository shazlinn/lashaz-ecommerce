// ecommerce/app/new-arrivals/page.tsx
import prisma from '@/lib/prisma';
import ProductCard from '@/components/frontstore/ProductCard';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';

export default async function NewArrivalsPage() {
  // 1. Fetch products that have the tag "new"
  const newArrivals = await prisma.product.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: {
              equals: 'new',
              mode: 'insensitive' // Catches "New", "NEW", or "new"
            }
          }
        }
      }
    },
    include: {
      category: true,
      // CRITICAL: We must include the tags so the ProductCard 
      // can "see" them and display the NEW badge.
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {newArrivals.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  price: Number(product.price),
                  image: product.imageUrl // Mapping DB imageUrl to card image prop
                }} 
              />
            ))}
          </div>
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