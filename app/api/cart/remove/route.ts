// lashaz-ecommerce/app/api/cart/remove/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request) {
  const session = await getAuthSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId } = await req.json();

    // Find the user's cart
    const userCart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!userCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // Delete the specific item using the composite unique key
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: userCart.id,
          productId: productId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Cart Item Error:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
}