// ecommerce/app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/app/context/CartContext'; 
import { 
  ChevronLeftIcon, 
  CreditCardIcon, 
  MapPinIcon, 
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart } = useCart();

  const [shippingData, setShippingData] = useState({
    name: session?.user?.name || '',
    phone: '',
    address: '',
  });

  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 10; // Free shipping for orders above 200, otherwise 10
  const total = subtotal + shipping;

  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent any default form behavior
    e.preventDefault();

    if (!shippingData.phone || !shippingData.address || !shippingData.name) {
      alert("Protocol Error: Please complete delivery information.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          orderId: `LS-${Date.now()}`, 
          userEmail: session?.user?.email || 'guest@example.com',
          userName: shippingData.name,
          userPhone: shippingData.phone,
          items: cart 
        }),
      });

      // If the response isn't OK, don't try to parse it as JSON
      if (!response.ok) {
        throw new Error('Handshake failed on server');
      }

      const data = await response.json();
      
      if (data.url) {
        // This is the critical line that moves the browser to the bank page
        window.location.assign(data.url); 
      } else {
        alert(data.error || "Handshake with ToyyibPay failed.");
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("A system error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 font-sans">
        <div className="bg-zinc-50 p-8 rounded-full">
          <ShoppingBagIcon className="h-12 w-12 text-zinc-200" />
        </div>
        <h2 className="text-3xl font-josefin uppercase font-bold tracking-tight text-zinc-300">Bag is Empty</h2>
        <Link href="/shop" className="btn-primary px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px]">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 font-sans text-black">
      <nav className="mb-12 flex items-center justify-between border-b border-zinc-100 pb-8">
        <Link 
          href="/cart" 
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Review Bag
        </Link>
        <div className="flex items-center gap-2">
           <span className={`h-1.5 w-1.5 rounded-full bg-black ${loading ? 'animate-ping' : 'animate-pulse'}`}></span>
           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black">Checkout Protocol</span>
        </div>
      </nav>

      <div className="grid lg:grid-cols-12 gap-16 items-start">
        {/* Step 1 & 2: User Inputs */}
        <div className="lg:col-span-7 space-y-16">
          <section className="space-y-8">
            <header className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">01</div>
              <h2 className="text-2xl font-josefin font-bold uppercase tracking-tight">Delivery Details</h2>
            </header>
            
            <form className="grid gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm font-medium" 
                    value={shippingData.name}
                    onChange={(e) => setShippingData({...shippingData, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Contact Number</label>
                  <input 
                    type="text" 
                    placeholder="01XXXXXXXX" 
                    className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm font-medium" 
                    value={shippingData.phone}
                    onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Shipping Address</label>
                <textarea 
                  placeholder="Complete Address (Unit, Street, City, State, Postcode)" 
                  rows={4} 
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl outline-none focus:border-black focus:bg-white transition-all text-sm font-medium resize-none" 
                  value={shippingData.address}
                  onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                />
              </div>
            </form>
          </section>

          <section className="space-y-8">
            <header className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">02</div>
              <h2 className="text-2xl font-josefin font-bold uppercase tracking-tight">Payment Method</h2>
            </header>
            
            <div className="relative overflow-hidden p-6 border-2 border-black rounded-[2rem] bg-white flex items-center justify-between shadow-xl shadow-black/5">
              <div className="flex items-center gap-5">
                <div className="bg-zinc-100 p-3 rounded-2xl">
                  <CreditCardIcon className="h-6 w-6 text-black" />
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-tight text-black">ToyyibPay Secure Gateway</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">FPX / Online Banking</p>
                </div>
              </div>
              <div className="flex items-center opacity-80">
                 <img src="/toyyibpay.png" alt="ToyyibPay" className="h-8 w-auto object-contain" />
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5">
          <div className="bg-zinc-50 p-10 rounded-[3rem] sticky top-32 border border-zinc-100 shadow-sm">
            <h2 className="font-josefin font-bold text-2xl uppercase tracking-tight mb-10">Order Summary</h2>
            
            <div className="space-y-8 mb-10 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item: any) => (
                <div key={item.productId} className="flex justify-between items-center group text-black">
                  <div className="flex flex-col">
                    <span className="font-josefin font-bold text-sm uppercase tracking-tight group-hover:text-zinc-600 transition-colors">{item.name}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Qty {item.quantity}</span>
                  </div>
                  <span className="font-bold text-sm">MYR {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-200 pt-8 space-y-4">
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                <span>Subtotal</span>
                <span className="text-black">MYR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                <span>Logistics</span>
                <span className="text-black font-bold">
                  {shipping === 0 ? 'COMPLIMENTARY' : `MYR ${shipping.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between items-end pt-8 border-t border-zinc-200 mt-6">
                <div>
                    <span className="block text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400 mb-1">Grand Total</span>
                    <span className="font-josefin font-bold text-3xl uppercase tracking-tighter text-black">Total</span>
                </div>
                <span className="text-4xl font-bold font-josefin tracking-tighter text-black">
                  MYR {total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button" // <--- CRITICAL: Prevents default form navigation
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-12 bg-black text-white py-6 rounded-full font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 shadow-2xl shadow-black/20 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Processing Handshake...
                </>
              ) : 'Verify & Pay Now'}
            </button>

            <div className="mt-8 flex items-center justify-center gap-2 opacity-30 text-black">
                <MapPinIcon className="h-3 w-3" />
                <p className="text-[8px] uppercase font-bold tracking-[0.3em]">
                  Malaysia Logistics Protocol
                </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}