// lib/users.ts
import prisma from '@/lib/prisma';

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string;
  role: 'admin' | 'customer' | string;
  createdAt: string;
  status: 'active' | 'deactivated';
};

export async function fetchUsers(): Promise<AdminUserRow[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,           // <--- NEW
      createdAt: true,
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: (u.role as any) ?? 'customer',
    createdAt: u.createdAt.toISOString().slice(0, 10),
    status: u.status as 'active' | 'deactivated',
  }));
}