// ecommerce/app/api/admin/products/route.ts
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
      skinType, 
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

    // pre-process tags safely using an atomic deduplication stream
    let validTagIds: string[] = [];
    if (tags && Array.isArray(tags)) {
      
      // Filter out empty rows and enforce strict uniqueness before hit execution
      const uniqueCleanTags = Array.from(
        new Set(
          tags
            .map((rawName: string) => rawName.trim())
            .filter((trimmedName: string) => trimmedName.length > 0)
        )
      );

      //concurrent execution is now fully secure against race-conditions
      const tagRecords = await Promise.all(
        uniqueCleanTags.map(async (trimmed) => {
          return prisma.tag.upsert({
            where: { name: trimmed },
            update: {},
            create: { name: trimmed },
          });
        })
      );
      
      validTagIds = tagRecords.filter((t) => t !== null).map((t) => t!.id);
    }

    //perform a single, clean atomic operation to build out your product schema
    const created = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: (description ?? '').trim(),
        price: priceNumber,
        stock: stockNumber,
        imageUrl: imageUrl?.trim() || undefined,
        skinType: skinType || null, 
        categoryId,
        tags: {
          create: validTagIds.map((tagId) => ({
            tagId: tagId,
          })),
        },
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error('[PRODUCT_CREATE_ERROR]', e?.message);
    return NextResponse.json({ error: e.message || 'Internal' }, { status: 500 });
  }
}