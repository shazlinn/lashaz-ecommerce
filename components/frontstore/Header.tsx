'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import AuthModal from './AuthModal';

export default function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 font-sans">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
          {/* 1. Logo & Nav Links */}
          <div className="flex items-center gap-12">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/lashaz-logo.svg" 
                alt="La Shaz"
                width={120}
                height={40}
                className="object-contain h-10 w-auto"
                priority
              />
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-800">
              <button className="flex items-center gap-1 hover:text-black transition-colors">
                Shop
                <ChevronDownIcon className="h-4 w-4" />
              </button>
              <Link href="/sale" className="hover:text-black transition-colors">
                On Sale
              </Link>
              <Link href="/new-arrivals" className="hover:text-black transition-colors">
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* 2. Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
            />
          </div>

          {/* 3. Action Icons */}
          <div className="flex items-center gap-6 text-gray-800">
            <button aria-label="Search" className="lg:hidden hover:text-black transition-colors">
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
            
            <Link href="/cart" aria-label="Cart" className="hover:text-black transition-colors relative">
              <ShoppingBagIcon className="h-6 w-6" />
            </Link>

            {/* Profile Logic: Trigger Modal if logged out, go to profile if logged in */}
            {session ? (
              <Link href={session.user.role === 'admin' ? '/admin' : '/profile'} aria-label="Account" className="hover:text-black transition-colors">
                <UserCircleIcon className="h-6 w-6" />
              </Link>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)} 
                aria-label="Login or Sign Up" 
                className="hover:text-black transition-colors"
              >
                <UserCircleIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal Integration */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}