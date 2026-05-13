// ecommerce/app/sale/page.tsx
import prisma from '@/lib/prisma';
import ProductCard from '@/components/frontstore/ProductCard';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';

export const revalidate = 0;
export default async function SalePage() {
  // Fetch products with the "sale" tag and include relationships for the badge logic
  const saleProducts = await prisma.product.findMany({
    where: {
      tags: {
        some: {
          tag: {
            name: {
              equals: 'sale',
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
      price: 'asc'
    }
  });

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-12">
        {/* UNIFORM HEADER SECTION */}
        <header className="mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-2 block">
            Limited Time
          </span>
          <h1 className="text-6xl font-bold font-josefin uppercase tracking-tight text-black">
            The Sale
          </h1>
          <div className="h-1 w-20 bg-black mt-4" />
        </header>

        {saleProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {saleProducts.map((product) => (
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
          <div className="py-20 text-center border border-dashed border-zinc-200 rounded-[3rem]">
            <p className="text-zinc-400 uppercase text-xs font-bold tracking-widest">
              The archive is currently empty. Check back for seasonal protocols.
            </p>
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
}