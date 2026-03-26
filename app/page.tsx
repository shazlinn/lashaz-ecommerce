// lashaz-ecommerce/app/page.tsx
import TopBanner from '@/components/frontstore/TopBanner';
import Header from '@/components/frontstore/Header';
import HeroSection from '@/components/frontstore/HeroSection';
import Footer from '@/components/frontstore/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col font-sans">
      <TopBanner />
      <Header />
      
      {/* Page Content */}
      <div className="flex-grow">
        <HeroSection />
        
        {/* Brand Statement Section */}
        <section className="py-16 bg-black text-white text-center flex items-center justify-center">
          {/* font-josefin: Uses your editorial font
            text-huge: Uses the responsive clamp size (3rem to 9rem)
            tracking-[0.2em]: Matches the wide letter-spacing in Figma 
          */}
          <h2 className="font-josefin text-huge font-light tracking-wider uppercase" style={{ fontSize: '40px' }}>
            LA SHAZ: Beauty, Redefined.
        </h2>
        </section>

        {/* New Arrivals Section */}
        <section id="new-arrivals" className="py-24 container mx-auto px-4 text-center">
           <h2 className="font-josefin text-5xl md:text-6xl font-bold uppercase mb-16 tracking-tighter">
             New Arrivals
           </h2>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
             {/* Product grid will go here */}
             <p className="col-span-full text-gray-400 font-medium italic">
               Curating the latest in glow... coming soon.
             </p>
           </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}