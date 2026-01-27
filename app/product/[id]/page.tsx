import { getServerSideProductById } from '@/lib/api';
import ProductGallery from '@/components/frontstore/ProductGallery';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';
import AddToCartSection from '@/components/frontstore/AddToCartSection';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getServerSideProductById(id);

  if (!product) return <div>Product Not Found</div>;

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 lg:py-16">
        {/* Changed to a 12-column grid for finer control */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left: Product Image Gallery (Taking up 5 columns instead of 6) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <ProductGallery images={product.image ? product.image.split(',') : []} />
          </div>

          {/* Right: Product Info (Taking up 7 columns) */}
          <section className="lg:col-span-7 space-y-8 lg:sticky lg:top-32">
            <header className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                {product.category}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold font-josefin uppercase tracking-tight text-black leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-black">MYR {product.price}</p>
            </header>

            <div className="prose prose-zinc max-w-none border-t border-gray-100 pt-6">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {product.description || "A meticulously crafted beauty essential designed to enhance your natural radiance."}
              </p>
            </div>

            <AddToCartSection product={product} />

            <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-xs">
              <span className="font-bold text-black uppercase tracking-widest">Status:</span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500 font-bold'}>
                {/* {product.stock > 0 ? `Available (${product.stock} units)` : 'Sold Out'} */}
                {product.stock > 0 ? `Available` : 'Sold Out'}
              </span>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
}