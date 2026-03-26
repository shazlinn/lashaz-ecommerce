'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';

export default function ShopContent({ initialProducts }: { initialProducts: any[] }) {
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(initialProducts.map(p => p.category)));
    return ['All', ...uniqueCategories];
  }, [initialProducts]);

  // 1. Calculate the raw max price from the database
  const maxProductPrice = useMemo(() => {
    if (initialProducts.length === 0) return 1000;
    return Math.max(...initialProducts.map(p => p.price));
  }, [initialProducts]);

  // 2. NEW: Round up to the nearest 10 for a cleaner slider UI
  const sliderMax = useMemo(() => {
    return Math.ceil(maxProductPrice / 10) * 10;
  }, [maxProductPrice]);

  const [activeCategory, setActiveCategory] = useState('All');
  
  // 3. Initialize the range to our new rounded sliderMax
  const [priceRange, setPriceRange] = useState(sliderMax);
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredProducts = useMemo(() => {
    let results = initialProducts.filter(p => {
      const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
      const priceMatch = p.price <= priceRange;
      return categoryMatch && priceMatch;
    });

    if (sortOrder === 'low-to-high') results.sort((a, b) => a.price - b.price);
    if (sortOrder === 'high-to-low') results.sort((a, b) => b.price - a.price);
    
    return results;
  }, [activeCategory, priceRange, sortOrder, initialProducts]);

  return (
    <div className="flex flex-col lg:flex-row gap-12 font-sans">
      <aside className="w-full lg:w-64 space-y-12">
        <section>
          <h3 className="font-josefin font-bold uppercase tracking-widest text-xs mb-6 text-black/40">
            Categories
          </h3>
          <div className="flex flex-wrap lg:flex-col gap-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm text-left transition-all px-4 py-2 rounded-full lg:px-0 lg:py-0 lg:rounded-none ${
                  activeCategory === cat 
                  ? 'text-black font-bold underline underline-offset-8' 
                  : 'text-gray-400 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-6">
            <h3 className="font-josefin font-bold uppercase tracking-widest text-xs text-black/40">
              Price Range
            </h3>
            <span className="text-sm font-bold text-black">MYR {priceRange}</span>
          </div>
          {/* UPDATED: max is now the rounded sliderMax */}
          <input 
            type="range" 
            min="0" 
            max={sliderMax} 
            step="1"
            value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-black"
          />
          <div className="flex justify-between text-[10px] font-bold text-gray-300 mt-4 uppercase tracking-tighter">
            <span>MYR 0</span>
            {/* UPDATED: Label shows the rounded max */}
            <span>MYR {sliderMax}</span>
          </div>
        </section>
      </aside>

      <div className="flex-1">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <p className="text-sm text-gray-400 font-medium">
            Showing <span className="text-black font-bold">{filteredProducts.length}</span> of {initialProducts.length} results
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Sort by:</span>
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="text-sm border-none bg-transparent font-bold focus:ring-0 cursor-pointer p-0 pr-8"
            >
              <option value="newest">Newest</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </header>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-zinc-50 rounded-[2rem] border-2 border-dashed border-zinc-100">
            <p className="text-gray-400 font-medium italic">
              No products found in this range.
            </p>
            {/* FIXED: Removed the invalid comment from within the button tag */}
            <button 
              onClick={() => { setActiveCategory('All'); setPriceRange(sliderMax); }} 
              className="mt-4 text-black font-bold underline underline-offset-4 hover:opacity-70 transition-opacity"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}