// app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { getAuthSession } from '@/lib/auth'; //

type Params = Promise<{ id: string }>;

// 1. GET: Fetch detailed customer info for the admin view
export async function GET(_req: Request, ctx: { params: Params }) {
  try {
    const session = await getAuthSession();
    // Only allow Admins to view detailed user info
    if (session?.user?.role?.toUpperCase() !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await ctx.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        // Including relations helpful for admin context
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        addresses: true, // If they have multiple saved addresses
      }
    });

    if (!user) return new NextResponse('User not found', { status: 404 });

    // Exclude the password for safety
    const { hashedPassword, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (e) {
    console.error('[USER_GET]', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// 2. PATCH: Update user info (including new phone/address fields)
export async function PATCH(req: Request, ctx: { params: Params }) {
  try {
    const session = await getAuthSession();
    if (session?.user?.role?.toUpperCase() !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await ctx.params;
    const body = await req.json();
    const { name, email, role, password, status, phone, address } = body;

    const data: Record<string, any> = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (role !== undefined) data.role = role;
    if (status !== undefined) data.status = status;
    if (phone !== undefined) data.phone = phone; //
    if (address !== undefined) data.address = address; //
    
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
        phone: true, // Return updated fields
        address: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (e) {
    console.error('[USER_UPDATE]', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

// 3. DELETE: Soft delete (Deactivate)
export async function DELETE(_req: Request, ctx: { params: Params }) {
  try {
    const session = await getAuthSession();
    if (session?.user?.role?.toUpperCase() !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await ctx.params;
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