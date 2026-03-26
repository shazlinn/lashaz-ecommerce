// lashaz-ecommerce/app/api/wishlist/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session?.user?.email) return new NextResponse('Unauthorized', { status: 401 });

  const { productId } = await req.json();

  try {
    // 1. Get or Create the user's wishlist
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: (session.user as any).id }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: (session.user as any).id }
      });
    }

    // 2. Check if item exists to "toggle" it
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId
        }
      }
    });

    if (existingItem) {
      await prisma.wishlistItem.delete({ where: { id: existingItem.id } });
      return NextResponse.json({ active: false });
    } else {
      await prisma.wishlistItem.create({
        data: { wishlistId: wishlist.id, productId }
      });
      return NextResponse.json({ active: true });
    }
  } catch (error) {
    return new NextResponse('Error toggling wishlist', { status: 500 });
  }
}