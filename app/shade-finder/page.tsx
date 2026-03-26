// lashaz-ecommerce/app/shade-finder/page.tsx
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';
import ShadeFinder from '@/components/frontstore/ShadeFinder';

export default function ShadeFinderPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-sans selection:bg-black selection:text-white">
      <Header />
      
      <div className="relative flex-grow flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle Luxury Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.03),transparent)] pointer-events-none" />
        
        <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center">
          <header className="max-w-2xl text-center mb-16 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400 animate-in fade-in slide-in-from-bottom-2 duration-700">
                La Shaz Identity Protocol
              </span>
              <h1 className="text-5xl md:text-7xl font-josefin font-bold uppercase tracking-tighter text-black leading-[0.9] animate-in fade-in slide-in-from-bottom-4 duration-1000">
                Find Your <br /> Perfect Match
              </h1>
            </div>
            
            <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-1000">
              A curated experience designed to identify the beauty essentials that harmonize with your unique skin profile.
            </p>
          </header>

          {/* Combined Personalization Component */}
          <div className="w-full max-w-3xl animate-in fade-in zoom-in-95 duration-1000 delay-300">
            <ShadeFinder />
          </div>
          
          <div className="mt-16 flex flex-col items-center gap-4">
            <div className="h-12 w-[1px] bg-zinc-100" />
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-300">
              Meticulously Calculated results
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}