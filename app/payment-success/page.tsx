// ecommerce/app/payment-success/page.tsx
'use client';

import Link from 'next/link';
import { CheckCircleIcon, ShoppingBagIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { useCart } from '@/app/context/CartContext';

export default function SuccessPage() {
  const { clearCart } = useCart();

  // Clear the cart once the user reaches this page
  useEffect(() => {
    if (clearCart) {
      clearCart();
    }
  }, [clearCart]);

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
        
        {/* Success Icon */}
        <div className="relative mx-auto w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center">
          <CheckCircleIcon className="h-12 w-12 text-black" />
          <div className="absolute inset-0 rounded-full border border-black/5 animate-ping"></div>
        </div>

        <header className="space-y-2">
          <h1 className="text-4xl font-josefin font-bold uppercase tracking-tighter">
            Order Confirmed
          </h1>
          <p className="text-gray-400 text-sm uppercase tracking-widest font-medium">
            Your identity glow is on its way.
          </p>
        </header>

        <div className="bg-zinc-50 rounded-[2rem] p-8 border border-zinc-100 space-y-4">
          <p className="text-xs text-gray-500 leading-relaxed uppercase tracking-tight font-bold">
            Thank you for your purchase. A confirmation email with your tracking details will be sent shortly via our Resend protocol.
          </p>
          <div className="h-px bg-zinc-200 w-12 mx-auto"></div>
          <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em]">
            Transaction Secure • La Shaz Standard
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/profile" 
            className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 shadow-xl"
          >
            <ShoppingBagIcon className="h-4 w-4" />
            View My Orders
          </Link>
          
          <Link 
            href="/" 
            className="group flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors py-2"
          >
            Return to Home
            <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </main>
  );
}