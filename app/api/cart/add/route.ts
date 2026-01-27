// lashaz-ecommerce/app/api/cart/add/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getAuthSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantity = 1 } = await req.json();

    // 1. Validation: Ensure the product actually exists and check stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true, name: true }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    if (product.stock < quantity) {
      return NextResponse.json({ error: `Only ${product.stock} items left in stock` }, { status: 400 });
    }

    // 2. Find or create the User's Cart
    const userCart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      update: {}, 
      create: { userId: session.user.id },
    });

    // 3. Upsert the CartItem
    // This uses the unique constraint: @@unique([cartId, productId])
    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: userCart.id,
          productId: productId,
        },
      },
      update: {
        // If it exists, we increment the quantity
        quantity: { increment: quantity },
      },
      create: {
        cartId: userCart.id,
        productId: productId,
        quantity: quantity,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `${product.name} added to bag`,
      item: cartItem 
    });
  } catch (error) {
    console.error('Cart API Error:', error);
    return NextResponse.json({ error: 'Failed to update database cart' }, { status: 500 });
  }
}