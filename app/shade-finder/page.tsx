// lashaz-ecommerce/app/shade-finder/page.tsx
import Header from '@/components/frontstore/Header';
import Footer from '@/components/frontstore/Footer';
import ShadeFinder from '@/components/frontstore/ShadeFinder';

export const metadata = {
  title: 'Shade Finder | La Shaz',
  description: 'Identify your unique skin signature and find your perfect match.',
};

export default function ShadeFinderPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-sans selection:bg-black selection:text-white">
      <Header />
      
      {/* Background with a very subtle "studio" gradient */}
      <div className="relative flex-grow flex flex-col items-center justify-center bg-[#FAFAFA]">
        
        {/* Decorative background elements - reduced for cleaner focus */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_0%,transparent_70%)]" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10 flex flex-col items-center">
          
          {/* Header Section: Professional & Curated */}
          <header className="max-w-3xl text-center mb-16 space-y-6">
            <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-6 bg-zinc-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400">
                  La Shaz Shade Finder
                </span>
                <span className="h-[1px] w-6 bg-zinc-200" />
              </div>
              
              <h1 className="text-6xl md:text-8xl font-josefin font-bold uppercase tracking-tighter text-black leading-[0.85]">
                Find Your <br /> 
                <span className="text-zinc-300 italic font-light">Perfect Shade</span>
              </h1>
            </div>
            
            <p className="text-zinc-500 text-[11px] uppercase tracking-[0.3em] max-w-sm mx-auto leading-relaxed font-bold animate-in fade-in slide-in-from-bottom-6 duration-1000">
              Answer a few quick questions <br /> to find your perfect shade.
            </p>
          </header>

          {/* The Focused Quiz Container */}
          <div className="w-full max-w-4xl relative group">
            {/* Minimalist Tech Borders */}
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t border-l border-zinc-200 pointer-events-none transition-all group-hover:-top-2 group-hover:-left-2" />
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b border-r border-zinc-200 pointer-events-none transition-all group-hover:-bottom-2 group-hover:-right-2" />
            
            {/* The Actual ShadeFinder Component is inside here */}
            <ShadeFinder />
          </div>
          
          {/* Scientific Validation Footer */}
          <footer className="mt-20 flex flex-col items-center gap-8 animate-in fade-in duration-1000 delay-500">
            <div className="flex gap-16 items-center">
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-black uppercase tracking-widest">High Accuracy</p>
                <p className="text-[9px] text-zinc-400 font-medium">Pigment Sync 99.8%</p>
              </div>
              <div className="h-8 w-[1px] bg-zinc-100" />
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-black uppercase tracking-widest">Ethical Origin</p>
                <p className="text-[9px] text-zinc-400 font-medium">100% Vegan Protocol</p>
              </div>
              <div className="h-8 w-[1px] bg-zinc-100" />
              <div className="text-center space-y-1">
                <p className="text-[10px] font-bold text-black uppercase tracking-widest">Dermatological</p>
                <p className="text-[9px] text-zinc-400 font-medium">Non-Comedogenic</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-[1px] bg-gradient-to-b from-zinc-200 to-transparent" />
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-300">
                Lashaz Intelligence Systems © 2026
              </p>
            </div>
          </footer>
        </div>
      </div>

      <Footer />
    </main>
  );
}