// lashaz-ecommerce/app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug, // 1. Added slug to the destructuring
      description,
      price,
      stock,
      imageUrl,
      categoryId,
      tags,
    } = body;

    // 2. Updated validation to require slug
    if (!name || !slug || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, price, categoryId' },
        { status: 400 }
      );
    }

    const priceNumber = typeof price === 'string' ? Number(price) : price;
    const stockNumber = typeof stock === 'string' ? Number(stock) : (stock ?? 0);

    // 3. Updated database creation logic
    const created = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.create({
        data: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(), // 4. Saving the slug is mandatory now
          description: (description ?? '').trim(),
          price: priceNumber,
          stock: stockNumber,
          imageUrl: imageUrl?.trim() || undefined,
          categoryId,
        },
      });

      if (tags?.length) {
        for (const raw of tags) {
          const t = raw.trim();
          if (!t) continue;
          const tag = await tx.tag.upsert({
            where: { name: t },
            update: {},
            create: { name: t },
          });
          await tx.productTag.create({
            data: { productId: prod.id, tagId: tag.id },
          });
        }
      }
      return prod;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error('[PRODUCT_CREATE_ERROR]', e?.message);
    // 5. Send back the specific error message to help debug (e.g., if slug is duplicate)
    return NextResponse.json({ error: e.message || 'Internal' }, { status: 500 });
  }
}

// Update the PATCH handler similarly to allow updating slugs
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const body = await req.json();
    const { name, slug, description, price, stock, imageUrl, categoryId, tags } = body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug.trim().toLowerCase(); // 6. Allow slug updates
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

    return NextResponse.json(updated);
  } catch (e: any) {
    console.error(`[PRODUCT_UPDATE_ERROR id=${id}]`, e);
    return NextResponse.json({ error: e.message || 'Update failed' }, { status: 500 });
  }
}