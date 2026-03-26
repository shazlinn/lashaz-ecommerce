// lashaz-ecommerce/app/api/cart/get/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getAuthSession();
  if (!session?.user?.id) return NextResponse.json([], { status: 200 });

  try {
    const userCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true } // Get product details like name and price
        }
      }
    });

    if (!userCart) return NextResponse.json([]);

    // Map the DB structure to your frontend CartItem type
    const formattedItems = userCart.items.map((item) => ({
      productId: item.productId,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
      imageUrl: item.product.imageUrl?.split(',')[0] || ''
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}