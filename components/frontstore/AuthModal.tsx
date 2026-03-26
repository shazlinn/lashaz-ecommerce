'use client';

import { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const router = useRouter();

  const handleAuthSuccess = async () => {
    const session = await getSession();
    // Redirect admin to dashboard, keep customer on current page
    if (session?.user?.role === 'admin') {
      router.push('/admin');
    } else {
      onClose();
      router.refresh();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[650px]">
        
        <button onClick={onClose} className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition-all">
          <XMarkIcon className="h-6 w-6 text-black" />
        </button>

        {/* Left Side: Illustration from image_2f4069.png */}
        <div className="relative w-full md:w-1/2 bg-zinc-100 hidden md:block">
          <Image src="/sign-up.png" alt="Auth Illustration" fill className="object-cover" priority />
        </div>

        {/* Right Side: Form Logic */}
        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full">
            {view === 'login' ? (
              <LoginForm 
                onSuccess={handleAuthSuccess} 
                onSwitch={() => setView('signup')} 
              />
            ) : (
              <SignupForm 
                onSuccess={handleAuthSuccess} 
                onSwitch={() => setView('login')} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}