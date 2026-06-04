'use client';

import { useState } from 'react';
import Link from 'next/link';
import InvoiceButton from '@/components/frontstore/InvoiceButton'; 
import { MagnifyingGlassIcon, TruckIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function OrderListWithSearch({ initialOrders }: { initialOrders: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = initialOrders.filter((order) => {
    const cleanId = order.id.toLowerCase();
    const truncatedId = order.id.slice(-6).toLowerCase();
    const term = searchQuery.toLowerCase().trim();
    
    return cleanId.includes(term) || truncatedId.includes(term);
  });

  return (
    <div className="space-y-6 text-black">
      {/* HEADER SECTION ROW */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 flex-shrink-0">
          <ShoppingBagIcon className="h-4 w-4 text-black" />
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-black">
            Recent Purchases
          </h2>
        </div>

        {/* FIXED BOX INTERACTION LAYOUT */}
        <div className="w-full sm:w-64 max-w-sm">
          {/* Isolation layer with explicit relative context layout boundary */}
          <div className="relative w-full flex items-center">
            
            {/* The Icon is absolute positioned 16px from the extreme left boundary edge */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            
            {/* 
              HARD ENFORCED INLINE MOUNT:
              Using style={{ paddingLeft: '44px' }} forces Next.js and Tailwind 
              to yield rendering space to the icon asset layout, regardless of CSS inheritance rules.
            */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Order ID (e.g. #8UP33Z)..."
              style={{ paddingLeft: '44px' }}
              className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pr-4 text-[11px] font-medium outline-none focus:border-black focus:bg-white transition-all text-black placeholder-gray-400 z-10"
            />
          </div>
        </div>
      </div>

      {/* RECENT ORDERS CARDS CONTENT CONTAINER */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-zinc-200 p-12 text-center bg-white">
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-medium">
            {searchQuery ? 'No matching identifiers located.' : 'No order history found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="rounded-3xl border border-zinc-100 bg-white p-6 flex flex-col md:flex-row justify-between items-center gap-4 group hover:border-black transition-all duration-500"
            >
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold font-mono text-zinc-400">
                    #{order.id.slice(-6).toUpperCase()}
                  </span>
                  <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                    order.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    order.status === 'SHIPPED' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    'bg-zinc-50 text-zinc-500 border-zinc-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                <span className="text-[12px] font-bold whitespace-nowrap text-black">
                  RM {Number(order.total).toFixed(2)}
                </span>
                
                <div className="flex items-center gap-3">
                  <Link 
                    href={`/track/${order.id}`}
                    className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 shadow-sm"
                  >
                    <TruckIcon className="h-3 w-3" />
                    Track Glow
                  </Link>
                  <InvoiceButton order={order} /> 
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}