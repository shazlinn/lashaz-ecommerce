// ecommerce/components/frontstore/Header.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Added for search navigation
import { useSession } from 'next-auth/react';
import { useCart } from '@/app/context/CartContext';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // Search state
  const router = useRouter();
  const { data: session } = useSession();
  const { cart } = useCart();

  const itemCount = cart.reduce((total: number, item: any) => total + item.quantity, 0);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Redirect to shop page with search query
    router.push(`/shop?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm(''); // Clear input after search
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 font-sans">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex-shrink-0">
              <Image src="/lashaz-logo.svg" alt="La Shaz" width={120} height={40} className="h-10 w-auto" priority />
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800">
              <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
              <Link href="/sale" className="hover:text-black transition-colors">On Sale</Link>
              <Link href="/new-arrivals" className="hover:text-black transition-colors">New Arrivals</Link>
              <Link href="/shade-finder" className="relative group flex items-center gap-1.5 hover:text-black transition-colors">
                Shade Finder
                <span className="flex h-1.5 w-1.5 rounded-full bg-black group-hover:scale-125 transition-transform" />
                <span className="absolute -top-4 -right-2 text-[8px] font-bold uppercase tracking-tighter text-zinc-400">New</span>
              </Link>
            </nav>
          </div>

          {/* ACTIVE SEARCH BAR */}
          <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..." 
              className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-black/5 transition-all" 
            />
          </form>

          <div className="flex items-center gap-6 text-gray-800">
            {session && (
              <Link href="/wishlist" className="hover:text-black transition-colors p-1" title="My Wishlist">
                <HeartIcon className="h-6 w-6" />
              </Link>
            )}

            <Link href="/cart" className="hover:text-black transition-colors relative p-1">
              <ShoppingBagIcon className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {session ? (
              <Link href={session.user.role === 'admin' ? '/admin' : '/profile'} className="hover:text-black transition-colors p-1">
                <UserCircleIcon className="h-6 w-6" />
              </Link>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="hover:text-black transition-colors p-1">
                <UserCircleIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}