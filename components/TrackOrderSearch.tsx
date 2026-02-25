// lashaz-ecommerce/components/TrackOrderSearch.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function TrackOrderSearch() {
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    // Redirects to the dynamic route: app/track/[orderId]/page.tsx
    router.push(`/track/${orderId.trim()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-xs">
      <input
        type="text"
        placeholder="Enter Order ID (e.g. #ING-01)"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-5 py-2.5 text-[10px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-600 transition-all font-josefin uppercase tracking-widest"
      />
      <button 
        type="submit" 
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-white transition-colors"
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
      </button>
    </form>
  );
}