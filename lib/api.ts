import prisma from '@/lib/prisma';

/**
 * Fetches all products for the Shop page.
 * Returns the unique slug for cleaner URLs.
 */
export async function getServerSideProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
      },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      price: parseFloat(p.price.toString()), // Convert Prisma Decimal to number
      category: p.category?.name ?? 'Uncategorized',
      image: p.imageUrl || '', 
      stock: p.stock,
      slug: p.slug, // Now using the actual slug from your database
    }));
  } catch (error) {
    console.error("Prisma Fetch Error (All Products):", error);
    return [];
  }
}

/**
 * Fetches a single product using its unique slug.
 * Used for the /product/[slug] dynamic route.
 */
export async function getServerSideProductBySlug(slug: string) {
  // SAFETY CHECK: Prevent Prisma from running if slug is missing
  if (!slug || typeof slug !== 'string') return null;

  try {
    const product = await prisma.product.findUnique({
      where: { slug: slug }, // Querying by slug instead of ID
      include: {
        category: { select: { name: true } },
      },
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      price: parseFloat(product.price.toString()),
      category: product.category?.name ?? 'Uncategorized',
      image: product.imageUrl || '',
      stock: product.stock,
    };
  } catch (error) {
    console.error(`Prisma Fetch Error (Slug: ${slug}):`, error);
    return null;
  }
}