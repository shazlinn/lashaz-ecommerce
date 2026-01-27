import prisma from '@/lib/prisma';

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
      price: parseFloat(p.price.toString()),
      category: p.category?.name ?? 'Uncategorized',
      image: p.imageUrl || '', 
      stock: p.stock,
      slug: p.id, 
    }));
  } catch (error) {
    console.error("Prisma Fetch Error (All Products):", error);
    return [];
  }
}

export async function getServerSideProductById(id: string) {
  // SAFETY CHECK: Ensure ID exists and is a valid string
  if (!id || typeof id !== 'string') return null;

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        category: { select: { name: true } },
      },
    });

    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      description: product.description ?? '',
      price: parseFloat(product.price.toString()),
      category: product.category?.name ?? 'Uncategorized',
      image: product.imageUrl || '',
      stock: product.stock,
    };
  } catch (error) {
    console.error(`Prisma Fetch Error (Product ID: ${id}):`, error);
    return null;
  }
}