// lashaz-ecommerce/lib/api.ts
import prisma from '@/lib/prisma';

export async function getServerSideProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
      },
    });

    // Map the data to match the format your ShopContent expects
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price.toString()), // Convert Decimal to number for the filter
      category: p.category?.name ?? 'Uncategorized',
      image: p.imageUrl || '/images/placeholder-makeup.png',
      slug: p.id, // Or use a slug field if you have one
    }));
  } catch (error) {
    console.error("Prisma Fetch Error:", error);
    return [];
  }
}