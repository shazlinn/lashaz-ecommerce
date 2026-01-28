// lashaz-ecommerce/app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      price,
      stock,
      imageUrl,
      skinType, //
      categoryId,
      tags,
    } = body;

    // Validation including slug
    if (!name || !slug || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slug, price, categoryId' },
        { status: 400 }
      );
    }

    const priceNumber = typeof price === 'string' ? Number(price) : price;
    const stockNumber = typeof stock === 'string' ? Number(stock) : (stock ?? 0);

    const created = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.create({
        data: {
          name: name.trim(),
          slug: slug.trim().toLowerCase(),
          description: (description ?? '').trim(),
          price: priceNumber,
          stock: stockNumber,
          imageUrl: imageUrl?.trim() || undefined,
          skinType: skinType || null, //
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
    return NextResponse.json({ error: e.message || 'Internal' }, { status: 500 });
  }
}