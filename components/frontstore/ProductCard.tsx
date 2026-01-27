//  lashaz-ecommerce/components/frontstore/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product }: { product: any }) {
  // Handle the comma-separated string from your database
  const images = product.image ? product.image.split(',') : [];
  const displayImage = images[0] || '/images/placeholder-makeup.png';

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-50 mb-4 transition-transform group-hover:scale-[1.02]">
        <Image
          src={displayImage} // Now passes a single clean URL
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="space-y-1">
        <h3 className="font-josefin font-bold text-lg uppercase tracking-tight text-black group-hover:underline">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm">{product.category}</p>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-black font-bold text-xl">MYR {product.price}</span>
        </div>
      </div>
    </Link>
  );
}