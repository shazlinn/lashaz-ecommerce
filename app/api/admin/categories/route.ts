import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const cats = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });
  return NextResponse.json(cats);
}

export async function POST(req: Request) {
  try {
    const { name, description } = (await req.json()) as {
      name?: string;
      description?: string;
    };
    if (!name || !name.trim()) {
      return new NextResponse('Name is required', { status: 400 });
    }
    const exists = await prisma.category.findUnique({ where: { name } });
    if (exists) {
      return new NextResponse('Category already exists', { status: 409 });
    }
    const cat = await prisma.category.create({
      data: { name: name.trim(), description: description?.trim() || undefined },
      select: { id: true, name: true },
    });
    return NextResponse.json(cat, { status: 201 });
  } catch (e) {
    console.error('[CATEGORY_CREATE]', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}