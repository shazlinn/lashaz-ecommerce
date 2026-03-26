// lashaz-ecommerce/app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to normalize Decimal for Next.js 15 serialization
function normalize(obj: any) {
  if (!obj) return obj;
  return {
    ...obj,
    price: obj.price?.toString() ?? obj.price,
  };
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const p = await prisma.product.findUnique({
      where: { id: id },
      include: { category: true, tags: { include: { tag: true } } },
    });

    if (!p) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const payload = {
      ...normalize(p),
      tags: p.tags.map((pt) => ({
        id: pt.tagId,
        name: pt.tag?.name ?? '',
      })),
    };

    return NextResponse.json(payload);
  } catch (e: any) {
    console.error(`[PRODUCT_GET_ERROR id=${id}]`, e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { name, slug, description, price, stock, imageUrl, skinType, categoryId, tags } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug.trim().toLowerCase();
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (stock !== undefined) data.stock = Number(stock);
    if (imageUrl !== undefined) data.imageUrl = imageUrl || null;
    if (skinType !== undefined) data.skinType = skinType || null; //
    if (categoryId !== undefined) data.categoryId = categoryId;

    const updated = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.update({
        where: { id: id },
        data,
      });

      if (tags) {
        await tx.productTag.deleteMany({ where: { productId: id } });
        for (const tName of tags) {
          if (!tName.trim()) continue;
          const tag = await tx.tag.upsert({
            where: { name: tName.trim() },
            update: {},
            create: { name: tName.trim() },
          });
          await tx.productTag.create({
            data: { productId: id, tagId: tag.id },
          });
        }
      }
      return prod;
    });

    return NextResponse.json(normalize(updated));
  } catch (e: any) {
    console.error(`[PRODUCT_UPDATE_ERROR id=${id}]`, e);
    return NextResponse.json({ error: e.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    await prisma.$transaction([
      prisma.productTag.deleteMany({ where: { productId: id } }),
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.wishlistItem.deleteMany({ where: { productId: id } }), // CLEANUP WISHLIST
      prisma.orderItem.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id: id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error(`[PRODUCT_DELETE_ERROR id=${id}]`, e);
    return NextResponse.json({ 
      error: 'Could not delete product. It may be linked to an existing order.' 
    }, { status: 500 });
  }
}