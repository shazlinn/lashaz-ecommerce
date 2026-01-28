// lashaz-ecommerce/app/wishlist/page.tsx
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';
import ProductCard from '@/components/frontstore/ProductCard';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function WishlistPage() {
  const session = await getAuthSession();
  
  if (!session) redirect('/login');

  const wishlist = await prisma.wishlist.findUnique({
    where: { userId: (session.user as any).id },
    include: {
      items: {
        include: {
          product: {
            include: { category: true } //
          }
        }
      }
    }
  });

  const items = wishlist?.items.map(item => item.product) || [];

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2 block">
            Your Personal Collection
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-josefin uppercase tracking-tight text-black">
            My Wishlist
          </h1>
        </header>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {items.map((product) => (
              <ProductCard 
                key={product.id} 
                product={{
                  ...product,
                  price: Number(product.price), // Handle Decimal serialization
                  image: product.imageUrl      // FIX: Map DB imageUrl to component image
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 space-y-6">
            <p className="text-gray-400 font-medium">Your wishlist is currently empty.</p>
            <Link 
              href="/shop" 
              className="inline-block bg-black text-white px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}