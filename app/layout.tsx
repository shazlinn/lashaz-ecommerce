// app/layout.tsx
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import ThemeScript from './theme-script';
import Providers from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'], // adjust if you need lighter/heavier
});

export const metadata: Metadata = {
  title: 'SmartShop',
  description: 'La Shaz SmartShop',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable} data-theme="light">
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}