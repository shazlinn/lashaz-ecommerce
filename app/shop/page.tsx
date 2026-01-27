// lashaz-ecommerce/app/shop/page.tsx
import { getServerSideProducts } from '@/lib/api';
import ShopContent from '@/components/frontstore/ShopContent';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';

export default async function ShopPage() {
  const products = await getServerSideProducts();

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-12">
        <header className="mb-12 border-b border-gray-100 pb-8">
          <h1 className="text-5xl font-bold font-josefin uppercase tracking-tight text-black">
            Shop All
          </h1>
          <p className="text-gray-500 mt-2">La Shaz: Curated Beauty Essentials</p>
        </header>

        {/* Passes the database rows to the filterable client component */}
        <ShopContent initialProducts={products} />
      </div>
      <Footer />
    </main>
  );
}