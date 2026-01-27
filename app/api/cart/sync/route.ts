// lashaz-ecommerce/app/api/cart/remove/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getAuthSession();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { localItems } = await req.json();

  try {
    // 1. Ensure the user has a cart container
    const cart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id },
      update: {},
    });

    // 2. Sync guest items to the database
    for (const item of localItems) {
      await prisma.cartItem.upsert({
        where: { 
          cartId_productId: {
            cartId: cart.id,
            productId: item.productId,
          },
        },
        create: {
          cartId: cart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
        update: {
          // FIXED: Set the quantity directly instead of incrementing
          // This prevents items from doubling if the sync runs twice.
          quantity: item.quantity 
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Sync Error:", e);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}