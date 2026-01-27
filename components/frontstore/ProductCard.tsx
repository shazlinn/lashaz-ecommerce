// lashaz-ecommerce/components/frontstore/ProductCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { ShoppingBagIcon, CheckIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion'; //

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const images = product.image ? product.image.split(',') : []; 
  const displayImage = images[0] || '/placeholder-makeup.png';

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdding) return;

    setIsAdding(true);
    
    // Trigger the cart logic
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: displayImage,
    });

    // Reset the animation after 1.5 seconds
    setTimeout(() => setIsAdding(false), 1500);
  };

  return (
    <div className="group block relative">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-50 mb-4 transition-transform group-hover:scale-[1.02]">
          <Image 
            src={displayImage} 
            alt={product.name} 
            fill 
            className="object-cover" 
            sizes="33vw" 
          />

          {/* Luxury Shine Effect */}
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ x: '-100%', skewX: -20 }}
                animate={{ x: '200%' }}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              />
            )}
          </AnimatePresence>
          
          {/* Animated Add to Bag Button */}
          <button 
            onClick={handleAdd}
            disabled={isAdding}
            className={`absolute bottom-4 left-4 right-4 backdrop-blur-sm py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 overflow-hidden
              ${isAdding 
                ? 'bg-black text-white translate-y-0 opacity-100' 
                : 'bg-white/90 text-black opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hover:bg-black hover:text-white'
              }`}
          >
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.div
                  key="added"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Added
                </motion.div>
              ) : (
                <motion.div
                  key="add"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBagIcon className="h-4 w-4" />
                  Add to Bag
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </Link>
      
      <div className="space-y-1">
        <h3 className="font-josefin font-bold text-lg uppercase tracking-tight text-black">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm">
          {product.category?.name || product.category}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-black font-bold text-xl">MYR {product.price}</span>
        </div>
      </div>
    </div>
  );
}