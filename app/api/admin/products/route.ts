//api/admin/products/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, tags: { include: { tag: true } } },
    });
    // Optional: normalize Decimal to string for clients that expect strings
    const normalized = products.map((p) => ({
      ...p,
      price: p.price?.toString?.() ?? p.price,
      // imageUrl is optional in your schema; no change needed
    }));
    return NextResponse.json(normalized);
  } catch (e: any) {
    console.error('[PRODUCT_LIST_ERROR]', e?.message ?? e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      price,
      stock,
      imageUrl,
      categoryId,
      tags,
    } = body as {
      name?: string;
      description?: string;
      price?: number | string;
      stock?: number | string;
      imageUrl?: string;
      categoryId?: string;
      tags?: string[];
    };

    // Basic validation
    if (!name || !categoryId || price === undefined || price === null) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, categoryId' },
        { status: 400 }
      );
    }

    const priceNumber =
      typeof price === 'string' ? Number(price) : (price as number);
    const stockNumber =
      stock === undefined || stock === null
        ? 0
        : typeof stock === 'string'
        ? Number(stock)
        : (stock as number);

    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }
    if (Number.isNaN(stockNumber) || stockNumber < 0) {
      return NextResponse.json({ error: 'Invalid stock' }, { status: 400 });
    }

    // Ensure category exists
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const created = await prisma.$transaction(async (tx) => {
      const prod = await tx.product.create({
        data: {
          name: name.trim(),
          description: (description ?? '').trim(),
          price: priceNumber, // Decimal handled by Prisma
          stock: stockNumber,
          imageUrl: imageUrl?.trim() || undefined, // optional in schema
          categoryId,
        },
      });

      // Upsert and connect tags
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

    // Optional: normalize price for client
    const normalized = {
      ...created,
      price: created.price?.toString?.() ?? created.price,
    };

    return NextResponse.json(normalized, { status: 201 });
  } catch (e: any) {
    console.error('[PRODUCT_CREATE_ERROR]', e?.message ?? e, e?.stack ?? '');
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}