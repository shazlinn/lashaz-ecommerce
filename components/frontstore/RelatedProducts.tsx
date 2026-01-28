// lashaz-ecommerce/components/frontstore/RelatedProducts.tsx
import prisma from '@/lib/prisma';
import ProductCard from './ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  categoryName: string;
}

export default async function RelatedProducts({ currentProductId, categoryName }: RelatedProductsProps) {
  // Fetch up to 4 related products from the same category
  const related = await prisma.product.findMany({
    where: {
      category: {
        name: categoryName
      },
      NOT: {
        id: currentProductId
      },
      stock: {
        gt: 0 // Only suggest items that are in stock
      }
    },
    take: 4,
  });

  if (related.length === 0) return null;

  return (
  <section className="mt-24 pt-16 border-t border-gray-100">
    <div className="flex items-end justify-between mb-10">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-2 block">
          Complete the Look
        </span>
        <h2 className="text-3xl font-bold font-josefin uppercase tracking-tight text-black">
          You May Also Like
        </h2>
      </div>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
    {related.map((product) => {
        const formattedProduct = {
        ...product,
        price: Number(product.price),
        image: product.imageUrl,
        };

        return <ProductCard key={product.id} product={formattedProduct} />;
    })}
    </div>
  </section>
);
}