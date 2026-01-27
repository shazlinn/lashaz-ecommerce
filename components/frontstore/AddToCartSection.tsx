'use client';

import { useState } from 'react';
import { MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function AddToCartSection({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);

  const adjustQty = (val: number) => {
    const newQty = quantity + val;
    if (newQty >= 1 && newQty <= product.stock) setQuantity(newQty);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Quantity</span>
        <div className="flex items-center border border-gray-200 rounded-full px-4 py-2 gap-6">
          <button onClick={() => adjustQty(-1)} className="hover:text-black transition-colors"><MinusIcon className="h-4 w-4" /></button>
          <span className="font-bold w-4 text-center">{quantity}</span>
          <button onClick={() => adjustQty(1)} className="hover:text-black transition-colors"><PlusIcon className="h-4 w-4" /></button>
        </div>
      </div>

      <button 
        className="w-full bg-black text-white rounded-full py-5 flex items-center justify-center gap-3 font-bold text-lg hover:bg-zinc-800 transition-all active:scale-95 shadow-xl disabled:opacity-50"
        disabled={product.stock <= 0}
      >
        <ShoppingBagIcon className="h-6 w-6" />
        {product.stock > 0 ? 'Add to Shopping Bag' : 'Out of Stock'}
      </button>
    </div>
  );
}