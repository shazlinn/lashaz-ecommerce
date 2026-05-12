// ecommerce/components/frontstore/ProductCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { ShoppingBagIcon, CheckIcon, HeartIcon as HeartOutline, SparklesIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion'; 
import toast from 'react-hot-toast'; 
import { useSession } from 'next-auth/react'; 
import { useSearchParams } from 'next/navigation';

export default function ProductCard({ product }: { product: any }) {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // --- IDENTITY MATCH LOGIC ---
  const activeTags = searchParams.get('tags')?.split(',') || [];
  const productTags = product.tags?.map((t: any) => t.tag.name) || [];
  
  const matchReason = activeTags.find(tag => 
    productTags.includes(tag) || product.skinType === tag
  );

  // --- AUTOMATIC BADGE LOGIC ---
  const isNewArrival = productTags.some((tagName: string) => tagName.toLowerCase() === 'new');
  const isSale = productTags.some((tagName: string) => tagName.toLowerCase() === 'sale');

  const images = product.image ? product.image.split(',') : []; 
  const displayImage = images[0] || '/placeholder-makeup.png';

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdding) return;

    setIsAdding(true);
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: displayImage,
    });

    setTimeout(() => setIsAdding(false), 1500);
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      return toast.error('Please login to save favorites', {
        style: { background: '#000', color: '#fff', borderRadius: '99px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }
      });
    }

    setIsWishlistLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsWishlisted(data.active);
        toast.success(data.active ? 'Added to Favorites' : 'Removed from Favorites', {
          style: { background: '#000', color: '#fff', borderRadius: '99px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }
        });
      }
    } catch (error) {
      toast.error('Wishlist error');
    } finally {
      setIsWishlistLoading(false);
    }
  };

  return (
    <div className="group block relative">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-50 mb-4 transition-transform group-hover:scale-[1.02]">
          
          {/* BADGE STACKING CONTAINER */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {isNewArrival && (
              <div className="bg-white text-black text-[9px] font-bold uppercase px-3 py-1.5 rounded-full tracking-[0.2em] shadow-lg shadow-black/5 border border-zinc-100 animate-in fade-in slide-in-from-left-2 duration-700 w-fit">
                New
              </div>
            )}

            {isSale && (
              <div className="bg-red-600 text-white text-[9px] font-bold uppercase px-3 py-1.5 rounded-full tracking-[0.2em] shadow-lg animate-in fade-in slide-in-from-left-2 duration-700 w-fit">
                Sale
              </div>
            )}
          </div>

          {/* MATCH REASON BADGE */}
          {matchReason && (
            <div 
              className={`absolute left-4 z-20 flex items-center gap-1.5 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-xl animate-in fade-in zoom-in duration-500
                ${(isNewArrival && isSale) ? 'top-24' : (isNewArrival || isSale) ? 'top-14' : 'top-4'}`}
            >
              <SparklesIcon className="h-3 w-3 text-amber-400" />
              <span className="text-[8px] font-bold uppercase tracking-[0.1em] text-white">
                Matched: {matchReason}
              </span>
            </div>
          )}

          <Image 
            src={displayImage} 
            alt={product.name} 
            fill 
            className="object-cover" 
            sizes="33vw" 
          />

          <button 
            onClick={toggleWishlist}
            disabled={isWishlistLoading}
            className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all group/wishlist"
          >
            {isWishlisted ? (
              <HeartSolid className="h-4 w-4 text-red-500" />
            ) : (
              <HeartOutline className="h-4 w-4 text-black group-hover/wishlist:text-red-400 transition-colors" />
            )}
          </button>

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
          
          <button 
            onClick={handleAdd}
            disabled={isAdding}
            className={`absolute bottom-4 left-4 right-4 backdrop-blur-sm py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl flex items-center justify-center gap-2 overflow-hidden z-20
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
        
        {/* PRICE DISPLAY WITH STRIKETHROUGH LOGIC */}
        <div className="flex items-center gap-3 mt-2">
          {isSale ? (
            <>
              <span className="text-red-600 font-bold text-xl">
                MYR {Number(product.price).toFixed(2)}
              </span>
              <span className="text-gray-400 text-sm line-through decoration-1">
                was MYR {(Number(product.price) + 20).toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-black font-bold text-xl">
              MYR {Number(product.price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}