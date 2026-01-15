import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body as {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
    };

    if (!name || !email || !password) {
      return new NextResponse('Missing required fields', { status: 400 });
    }
    if (password.length < 8) {
      return new NextResponse('Password must be at least 8 characters', { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) {
      return new NextResponse('Email already registered', { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        hashedPassword,
        role: 'customer',
        // phone, // uncomment if you added "phone String?" to your schema
        status: 'active', // relies on your enum default; safe to set explicitly
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (e) {
    console.error('[SIGNUP_ERROR]', e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}