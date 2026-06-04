// ecommerce/app/payment-failed/page.tsx
'use client';

import Link from 'next/link';
import { XCircleIcon, ArrowPathIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const billCode = searchParams.get('billcode') || 'N/A';

  return (
    <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 text-center border border-zinc-100 shadow-2xl shadow-black/5 animate-in fade-in zoom-in duration-300">
      <div className="flex justify-center mb-6">
        <div className="bg-red-50 p-4 rounded-full">
          <XCircleIcon className="h-12 w-12 text-red-600 animate-pulse" />
        </div>
      </div>

      <header className="space-y-2 mb-8">
        <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-red-600 block">Transaction Aborted</span>
        <h1 className="text-4xl font-josefin font-bold uppercase tracking-tighter text-black">Payment Failed</h1>
        <p className="text-xs text-gray-400 font-medium">
          Your transaction was declined or cancelled by the issuing bank provider.
        </p>
      </header>

      <div className="bg-zinc-50 rounded-2xl p-4 text-left border border-zinc-100/50 space-y-2 mb-8">
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>Gateway Code</span>
          <span className="text-black font-mono select-all">{billCode}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>Resolution Status</span>
          <span className="text-red-600 font-bold">CANCELLED / DECLINED</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Link 
          href="/checkout" 
          className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-95 shadow-lg"
        >
          <ArrowPathIcon className="h-4 w-4" /> Retry Checkout Protocol
        </Link>
        <Link 
          href="/shop" 
          className="w-full border border-zinc-200 text-zinc-400 hover:text-black hover:border-black py-4 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all"
        >
          <ShoppingBagIcon className="h-4 w-4" /> Return to Catalog
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-zinc-50/50 flex items-center justify-center p-4 font-sans text-black">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-zinc-200 border-t-black rounded-full animate-spin"></div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Processing Gateway Hook...</p>
        </div>
      }>
        <PaymentFailedContent />
      </Suspense>
    </main>
  );
}