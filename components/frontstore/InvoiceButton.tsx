// lashaz-ecommerce/components/frontstore/InvoiceButton.tsx
'use client';

import { generateInvoice } from '@/lib/invoice'; 

export default function InvoiceButton({ order }: { order: any }) {
  return (
    <button 
      onClick={() => generateInvoice(order)}
      className="text-[9px] font-bold uppercase tracking-widest border border-zinc-200 px-4 py-2.5 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
    >
      Get Invoice
    </button>
  );
}