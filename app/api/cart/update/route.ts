// lashaz-ecommerce/app/api/cart/add/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request) {
  const session = await getAuthSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await req.json();

    if (quantity < 1) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    const userCart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!userCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Update the record to the specific number
    const updatedItem = await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: userCart.id,
          productId: productId,
        },
      },
      data: { quantity: quantity },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Update Cart Quantity Error:', error);
    return NextResponse.json({ error: 'Failed to update quantity' }, { status: 500 });
  }
}