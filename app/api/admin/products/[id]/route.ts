import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper to normalize Decimal to string safely [cite: 476, 480]
function normalize(obj: any) {
  if (!obj) return obj;
  return {
    ...obj,
    price: obj.price?.toString() ?? obj.price,
  };
}

// GET Handler [cite: 750]
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Unwrapping params as required by Next.js 15 
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

// PATCH Handler [cite: 750]
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { name, description, price, stock, imageUrl, categoryId, tags } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = Number(price);
    if (stock !== undefined) data.stock = Number(stock);
    if (imageUrl !== undefined) data.imageUrl = imageUrl || null;
    if (categoryId !== undefined) data.categoryId = categoryId;

    const updated = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.update({
        where: { id: id },
        data,
      });

      if (tags) {
        // Syncing many-to-many ProductTag [cite: 927]
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

// DELETE Handler [cite: 750]
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Transactional delete to handle related tables [cite: 929]
    await prisma.$transaction([
      prisma.productTag.deleteMany({ where: { productId: id } }),
      prisma.cartItem.deleteMany({ where: { productId: id } }),
      // Note: OrderItem typically shouldn't be deleted if the order is already placed [cite: 924]
      // but we include it here to ensure the Product can be removed during testing.
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