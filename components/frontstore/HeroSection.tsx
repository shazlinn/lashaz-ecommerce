import Image from 'next/image';
import Link from 'next/link';

// Decorative Star Icon Component
function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

export default function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden font-sans">
      <div className="container mx-auto px-4 min-h-[calc(100vh-8rem)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full items-center">
          
          <div className="flex flex-col items-start z-10 max-w-[600px]">
            {/* font-josefin: Uses the editorial font
               text-huge: Uses the massive scaling size
               tracking-tighter: Matches the tight Figma character spacing
            */}
            <h1 className="font-josefin text-huge font-bold text-black uppercase mb-8 tracking-tighter" style={{ fontSize: '60px' }}>
              Find products that matches your glow
            </h1>
            
            
            <p className="text-gray-500 text-lg mb-10 max-w-[450px] leading-relaxed">
              Browse through our curated collection of meticulously crafted beauty
              essentials, designed to enhance your natural radiance.
            </p>

            <Link
              href="/shop"
              className="rounded-full bg-black text-white px-12 py-5 text-xl font-bold hover:bg-zinc-900 transition-all mb-16"
            >
              Shop Now
            </Link>

            <div className="flex flex-col">
              <span className="text-5xl font-bold text-black font-josefin">10,000+</span>
              <span className="text-gray-400 font-medium">Happy Customers</span>
            </div>
          </div>

          <div className="relative h-full flex justify-end items-center">
            {/* Your Makeup Image */}
            <img src="/hero-makeup-2.png" alt="Hero" className="object-contain max-h-[85vh] scale-110 origin-right" />
          </div>
        </div>
      </div>
    </section>
  );
}