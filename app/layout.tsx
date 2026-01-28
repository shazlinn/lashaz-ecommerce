// lashaz-ecommerce/app/layout.tsx
import type { Metadata } from 'next';
import { Poppins, Josefin_Sans, Work_Sans } from 'next/font/google';
import './globals.css';
import ThemeScript from './theme-script';
import Providers from './providers';
import { Toaster } from 'react-hot-toast';
import ChatWidget from '@/components/frontstore/ChatWidget'; //

// Main Body Font
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

// Editorial/Heading Font for the Hero Section
const josefin = Josefin_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600', '700'],
  variable: '--font-josefin' 
});

const workSans = Work_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-work',
});

export const metadata: Metadata = {
  title: 'La Shaz',
  description: 'La Shaz Ecommerce - Beauty & Makeup',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="en" 
      className={`${poppins.variable} ${josefin.variable} ${workSans.variable}`} 
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased font-sans bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300">
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              color: '#fff',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '12px 24px',
            },
          }} 
        />
        <Providers>
          {children}
          
          {/* THE BEAUTY ASSISTANT */}
          {/* Placing it here ensures it floats above all page content */}
          <ChatWidget /> 
        </Providers>
      </body>
    </html>
  );
}