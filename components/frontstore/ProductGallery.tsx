// lashaz-ecommerce/components/frontstore/ProductGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MagnifyingGlassPlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductGallery({ images }: { images: string[] }) {
  const [mainImage, setMainImage] = useState(images[0] || '/placeholder-makeup.png');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });

  // Handle Magnifying Glass Zoom logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Main Display Container */}
      <div 
        className="relative aspect-square max-h-[500px] overflow-hidden rounded-[2rem] bg-zinc-50 border border-gray-100 cursor-zoom-in group"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomPos({ ...zoomPos, show: false })}
        onClick={() => setIsModalOpen(true)}
      >
        {/* Original Image: Changed to object-contain so it's not cut out */}
        <Image
          src={mainImage}
          alt="Product Display"
          fill
          className={`object-contain transition-opacity duration-300 ${zoomPos.show ? 'opacity-0' : 'opacity-100'}`}
          priority
        />

        {/* Zoomed "Magnifying Glass" Effect */}
        {zoomPos.show && (
          <div 
            className="absolute inset-0 pointer-events-none scale-150 transition-transform duration-200"
            style={{
              backgroundImage: `url(${mainImage})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: '200%', // Adjust for more/less zoom
            }}
          />
        )}

        {/* Hover Hint */}
        <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <MagnifyingGlassPlusIcon className="h-5 w-5 text-black" />
        </div>
      </div>

      {/* Thumbnails (Keep smaller as requested) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                mainImage === img ? 'border-black scale-95' : 'border-transparent opacity-50'
              }`}
            >
              <Image src={img} alt="Thumbnail" fill className="object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* Full-Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform"
          >
            <XMarkIcon className="h-10 w-10" />
          </button>
          
          <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
            <Image
              src={mainImage}
              alt="Full View"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}