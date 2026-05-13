// ecommerce/app/api/admin/products/[id]/route.ts
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

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase();
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (skinType !== undefined) updateData.skinType = skinType || null;
    if (categoryId !== undefined) updateData.categoryId = categoryId;

    if (tags) {
      const tagRecords = await Promise.all(
        tags.map(async (tName: string) => {
          const trimmed = tName.trim();
          if (!trimmed) return null;
          return prisma.tag.upsert({
            where: { name: trimmed },
            update: {},
            create: { name: trimmed },
          });
        })
      );

      const validTagIds = tagRecords.filter(t => t !== null).map(t => t!.id);

      // Add nested delete/create logic to the main update object
      updateData.tags = {
        deleteMany: {}, // Clear all existing product-tag links
        create: validTagIds.map(tagId => ({
          tagId: tagId
        }))
      };
    }

    const updated = await prisma.product.update({
      where: { id: id },
      data: updateData,
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
    // Sequential transaction is fine for simple deletions
    await prisma.$transaction([
      prisma.productTag.deleteMany({ where: { productId: id } }),
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      prisma.wishlistItem.deleteMany({ where: { productId: id } }),
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