// lashaz-ecommerce/components/frontstore/WishlistButton.tsx
'use client';

import { useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function WishlistButton({ productId, initialIsWishlisted = false }: { productId: string, initialIsWishlisted?: boolean }) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      return toast.error('Please login to save items', {
        style: { background: '#000', color: '#fff', borderRadius: '99px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }
      });
    }

    setLoading(true);
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsWishlisted(data.active);
        toast.success(data.active ? 'Added to Wishlist' : 'Removed from Wishlist', {
          style: { background: '#000', color: '#fff', borderRadius: '99px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }
        });
      }
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleWishlist}
      disabled={loading}
      // UPDATED CLASSES: Matches py-5 height of AddToCartSection
      className="flex items-center gap-3 px-8 py-5 rounded-full border border-gray-200 hover:border-black hover:bg-gray-50 transition-all active:scale-95 group min-w-[180px] justify-center"
    >
      {isWishlisted ? (
        <HeartSolid className="h-5 w-5 text-red-500" />
      ) : (
        <HeartOutline className="h-5 w-5 text-black group-hover:text-red-500 transition-colors" />
      )}
      <span className="text-[11px] font-bold uppercase tracking-widest">
        {isWishlisted ? 'Saved' : 'Save to Wishlist'}
      </span>
    </button>
  );
}