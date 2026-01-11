// app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

type Params = Promise<{ id: string }>;

export async function PATCH(req: Request, ctx: { params: Params }) {
  try {
    const { id } = await ctx.params; // await the params
    const body = await req.json();
    const { name, email, role, password, status } = body as {
      name?: string | null;
      email?: string;
      role?: 'admin' | 'customer' | string;
      password?: string;
      status?: 'active' | 'deactivated';
    };

    const data: Record<string, any> = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) data.role = role;
    if (status !== undefined) data.status = status;
    if (password && password.length > 0) {
      data.hashedPassword = await bcrypt.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (e) {
    console.error('[USER_UPDATE]', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Params }) {
  try {
    const { id } = await ctx.params; // await the params
    await prisma.user.update({
      where: { id },
      data: { status: 'deactivated' },
    });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error('[USER_SOFT_DELETE]', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}