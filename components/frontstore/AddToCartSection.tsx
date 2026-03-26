// lashaz-ecommerce/components/frontstore/AddToCartSection.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/app/context/CartContext';
import toast from 'react-hot-toast'; // Optional: for a professional toast message

export default function AddToCartSection({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const adjustQty = (val: number) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= product.stock) setQuantity(newQty);
  };

  const handleAddToCart = () => {
    setIsAdding(true);

    const images = product.image ? product.image.split(',') : []; 
    const displayImage = images[0] || '/placeholder-makeup.png';

    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: displayImage,
      quantity: quantity,
    });

    // Premium Toast Notification
    toast.success(`${product.name} added to bag`, {
      style: {
        borderRadius: '99px',
        background: '#000',
        color: '#fff',
        fontSize: '10px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
    });

    // Reset animation state after 1 second
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center gap-6">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Quantity</span>
        <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 gap-6">
          <button 
            onClick={() => adjustQty(-1)} 
            className="hover:text-black transition-colors disabled:opacity-20"
            disabled={quantity <= 1}
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="font-bold w-4 text-center">{quantity}</span>
          <button 
            onClick={() => adjustQty(1)} 
            className="hover:text-black transition-colors disabled:opacity-20"
            disabled={quantity >= product.stock}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <button 
          onClick={handleAddToCart}
          className="w-full bg-black text-white rounded-full py-5 flex items-center justify-center gap-3 font-bold text-lg hover:bg-zinc-800 transition-all active:scale-95 shadow-xl disabled:opacity-50 overflow-hidden"
          disabled={product.stock <= 0 || isAdding}
        >
          <ShoppingBagIcon className="h-6 w-6" />
          {product.stock > 0 ? 'Add to Shopping Bag' : 'Out of Stock'}

          {/* Premium Shine Effect */}
          <AnimatePresence>
            {isAdding && (
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}
          </AnimatePresence>
        </button>

        {/* Floating "Added" Badge */}
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -80, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none"
            >
              <div className="bg-white border border-black text-black text-[10px] px-4 py-2 rounded-full font-bold uppercase tracking-[0.2em] shadow-2xl">
                Added +{quantity}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {product.stock > 0 && product.stock < 5 && (
        <p className="text-red-500 text-xs font-bold uppercase tracking-widest text-center animate-pulse">
          Only {product.stock} units left!
        </p>
      )}
    </div>
  );
}