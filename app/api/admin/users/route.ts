// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, role } = body;

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return new NextResponse('User already exists', { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        role: role ?? 'customer',
        hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    console.error('[USER_CREATE]', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}