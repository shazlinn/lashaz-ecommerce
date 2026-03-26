// lashaz-ecommerce/app/product/[slug]/page.tsx
import { getServerSideProductBySlug } from '@/lib/api';
import ProductGallery from '@/components/frontstore/ProductGallery';
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';
import AddToCartSection from '@/components/frontstore/AddToCartSection';
import RelatedProducts from '@/components/frontstore/RelatedProducts';
import WishlistButton from '@/components/frontstore/WishlistButton'; //
import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getAuthSession } from '@/lib/auth'; //
import prisma from '@/lib/prisma'; //

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getServerSideProductBySlug(slug);
  const session = await getAuthSession();

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans">
        <h1 className="text-2xl font-josefin uppercase tracking-widest text-black">Product Not Found</h1>
        <p className="text-gray-400 mt-2">The beauty essential you're looking for might have moved.</p>
        <Link href="/" className="mt-6 btn-primary px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px]">
          Return to Shop
        </Link>
      </div>
    );
  }

  // Server-side check for wishlist status
  let isWishlisted = false;
  if (session?.user) {
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        productId: product.id,
        wishlist: {
          userId: (session.user as any).id
        }
      }
    });
    isWishlisted = !!wishlistItem;
  }

  // Convert Decimal price to Number for Client Component serialization
  const plainProduct = {
    ...product,
    price: Number(product.price)
  };

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        {/* Editorial Back Button */}
        <div className="mb-8">
          <Link 
            href="/shop" 
            className="group inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left: Product Image Gallery */}
          <div className="lg:col-span-5 w-full max-w-[450px] mx-auto lg:max-w-none">
            <ProductGallery images={product.image ? product.image.split(',') : []} />
          </div>

          {/* Right: Product Info */}
          <section className="lg:col-span-7 space-y-8 lg:sticky lg:top-32">
            <header className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                {product.category}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold font-josefin uppercase tracking-tight text-black leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-black">MYR {Number(product.price).toFixed(2)}</p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
              <WishlistButton 
                  productId={product.id} 
                  initialIsWishlisted={isWishlisted} 
                />
              </div>

            <div className="prose prose-zinc max-w-none border-t border-gray-100 pt-6">
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">
                {product.description || "A meticulously crafted beauty essential designed to enhance your natural radiance."}
              </p>
            </div>

            {/* Action Buttons: Add to Cart and Wishlist */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow">
                <AddToCartSection product={plainProduct} />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center gap-4 text-xs">
              <span className="font-bold text-black uppercase tracking-widest">Status:</span>
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500 font-bold'}>
                {product.stock > 0 ? `Available` : 'Sold Out'}
              </span>
            </div>
          </section>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        <RelatedProducts 
          currentProductId={product.id} 
          categoryName={product.category} 
        />
      </div>

      <Footer />
    </main>
  );
}