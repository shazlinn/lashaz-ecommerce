// lashaz-ecommerce/components/frontstore/ProductCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext'; // 2. IMPORT THIS
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function ProductCard({ product }: { product: any }) {
    const { addToCart } = useCart(); // 3. GET ADD FUNCTION
    const images = product.image ? product.image.split(',') : []; 
    const displayImage = images[0] || '/placeholder-makeup.png';

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // 4. PREVENT NAVIGATION TO PRODUCT PAGE
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: displayImage,
    });
  };

  return (
    <div className="group block relative">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-50 mb-4 transition-transform group-hover:scale-[1.02]">
          <Image src={displayImage} alt={product.name} fill className="object-cover" sizes="33vw" />
          
          {/* 5. HOVER ADD TO CART BUTTON */}
          <button 
            onClick={handleAdd}
            className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-black py-3 rounded-xl text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 hover:bg-black hover:text-white"
          >
            <ShoppingBagIcon className="h-4 w-4" />
            Add to Bag
          </button>
        </div>
      </Link>
      
      <div className="space-y-1">
        <h3 className="font-josefin font-bold text-lg uppercase tracking-tight text-black">{product.name}</h3>
        <p className="text-gray-400 text-sm">{product.category?.name || product.category}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-black font-bold text-xl">MYR {product.price}</span>
        </div>
      </div>
    </div>
  );
}