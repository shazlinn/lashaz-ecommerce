import TopBanner from '@/components/frontstore/TopBanner';
import Header from '@/components/frontstore/Header';
import HeroSection from '@/components/frontstore/HeroSection';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <TopBanner />
      <Header />
      <HeroSection />
      
      {/* Placeholder for "New Arrivals" section to be added later */}
      <section className="py-10 bg-black text-white text-center">
        <h2 className="font-josefin text-huge font-light tracking-wider uppercase" style={{ fontSize: '40px' }}>
            LA SHAZ: Beauty, Redefined.
        </h2>
      </section>
      <section id="new-arrivals" className="py-20 container mx-auto px-4 text-center">
         <h2 className="text-4xl font-bold uppercase mb-12">New Arrivals</h2>
         <p className="text-gray-500">(Product grid will go here)</p>
      </section>
    </main>
  );
}