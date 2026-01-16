// ecommerce/app/layout.tsx
import type { Metadata } from 'next';
import { Poppins, Josefin_Sans, Work_Sans } from 'next/font/google'; // Combined imports
import './globals.css';
import ThemeScript from './theme-script';
import Providers from './providers';

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
  title: 'SmartShop',
  description: 'La Shaz SmartShop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* Added both font variables to the className */
    <html 
      lang="en" 
      className={`${poppins.variable} ${josefin.variable} ${workSans.variable}`} 
      data-theme="light"
    >
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}