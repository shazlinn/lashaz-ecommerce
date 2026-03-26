// lashaz-ecommerce/app/cart/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import { 
  TrashIcon, 
  PlusIcon, 
  MinusIcon, 
  ArrowRightIcon, 
  ShoppingBagIcon,
  ChevronLeftIcon // Import the back icon
} from '@heroicons/react/24/outline';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const subtotal = cart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 font-sans">
        <div className="bg-zinc-50 p-8 rounded-full">
          <ShoppingBagIcon className="h-12 w-12 text-zinc-300" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-josefin font-bold uppercase tracking-tight">Your bag is empty</h1>
          <p className="text-gray-400 mt-2">Looks like you haven't added anything to your bag yet.</p>
        </div>
        <Link href="/shop" className="btn-primary px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 font-sans">
      {/* 1. Added Back Navigation */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
        >
          <ChevronLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Continue Shopping
        </Link>
      </div>

      <header className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-4xl font-josefin font-bold uppercase tracking-tighter">Shopping Bag</h1>
        <p className="text-gray-400 mt-1">
          You have <span className="text-black font-bold">{cart.length}</span> items in your bag
        </p>
      </header>

      <div className="grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-8">
          {cart.map((item: any) => {
            const rawImage = item.imageUrl || item.image || "";
            const images = rawImage.split(',').filter((url: string) => url.trim() !== "");
            const displayImage = images.length > 0 
              ? images[0] 
              : 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800';

            return (
              <div key={item.productId} className="flex gap-6 pb-8 border-b border-zinc-100 group">
                <div className="relative h-40 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-50 border border-gray-100">
                  <Image 
                    src={displayImage} 
                    alt={item.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    unoptimized 
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-josefin font-bold text-xl uppercase tracking-tight">{item.name}</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                        MYR {item.price.toFixed(2)} / Unit
                      </p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="text-zinc-300 hover:text-red-500 transition-colors p-2"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center border border-zinc-200 rounded-full px-2 py-1 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="p-2 hover:bg-zinc-50 rounded-full transition-colors disabled:opacity-20"
                        disabled={item.quantity <= 1}
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-2 hover:bg-zinc-50 rounded-full transition-colors"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xl font-bold font-josefin text-black">
                      MYR {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-zinc-50 rounded-[2.5rem] p-10 sticky top-32 border border-gray-100 shadow-sm">
            <h2 className="font-josefin font-bold text-2xl uppercase tracking-tight mb-8">Summary</h2>
            
            <div className="space-y-4 text-sm font-medium">
              <div className="flex justify-between text-gray-400 uppercase tracking-widest text-[10px]">
                <span>Subtotal</span>
                <span className="text-black font-bold text-sm">MYR {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 uppercase tracking-widest text-[10px]">
                <span>Shipping</span>
                <span className="text-black font-bold text-sm">
                  {shipping === 0 ? 'FREE' : `MYR ${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-zinc-200 pt-6 mt-6 flex justify-between items-end">
                <span className="font-josefin font-bold text-lg uppercase tracking-tight">Total</span>
                <span className="text-3xl font-bold font-josefin">MYR {total.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              href="/checkout" 
              className="w-full mt-10 bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all shadow-2xl active:scale-95"
            >
              Checkout Now
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <p className="text-[9px] text-gray-300 text-center mt-6 uppercase tracking-widest font-bold">
              Secure Payments • La Shaz Standard
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}