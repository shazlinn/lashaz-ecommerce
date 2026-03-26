// app/api/user/update/route.ts
import { NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PATCH(req: Request) {
  const session = await getAuthSession();
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    // Destructure the new individual address fields from the frontend
    const { name, phone, street, city, postalCode, state, newPassword } = body;

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Combine for the single 'address' string on the User model for quick display
    const combinedAddress = street ? `${street}, ${city}, ${postalCode}, ${state}` : '';

    const updateData: any = {
      name,
      phone,
      address: combinedAddress, 
    };

    if (newPassword && newPassword.trim() !== "") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.hashedPassword = hashedPassword;
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { email: session.user.email },
        data: updateData,
      });

      // Update the structured Address table with real data
      if (street) {
        await tx.address.upsert({
          where: { id: user.id }, 
          create: {
            id: user.id,
            userId: user.id,
            street: street, 
            city: city || 'Kuala Lumpur',
            state: state || 'Selangor',
            postalCode: postalCode || '00000',
            country: 'Malaysia',
          },
          update: {
            street,
            city,
            state,
            postalCode,
          },
        });
      }

      return user;
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Profile and Structured Address updated successfully',
      user: {
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address
      }
    });
  } catch (error) {
    console.error('Update User Error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}