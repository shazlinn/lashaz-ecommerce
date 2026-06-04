// ecommerce/app/api/admin/users/route.ts
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

    // 1. STRICTION CHECK: Prevent blank, missing, or whitespace-only names
    if (!name || name.trim().length === 0) {
      return new NextResponse('Name is required and cannot be empty', { status: 400 });
    }

    if (!email || !password) {
      return new NextResponse('Missing email or password', { status: 400 });
    }

    // 2. STRICTION CHECK: Regular expression check to reject invalid email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse('Invalid email format structure', { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (exists) return new NextResponse('User already exists', { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
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