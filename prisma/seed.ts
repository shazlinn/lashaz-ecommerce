// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Upsert admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lashaz.com' },
    update: {},
    create: {
      email: 'admin@lashaz.com',
      name: 'Admin',
      role: 'admin',
      hashedPassword: await bcrypt.hash('Admin123!', 12),
    },
  });

  // Upsert a couple of customers
  const customers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'farah@example.com' },
      update: {},
      create: {
        email: 'farah@example.com',
        name: 'Farah',
        role: 'customer',
        hashedPassword: await bcrypt.hash('Password123!', 12),
      },
    }),
    prisma.user.upsert({
      where: { email: 'amina@example.com' },
      update: {},
      create: {
        email: 'amina@example.com',
        name: 'Amina',
        role: 'customer',
        hashedPassword: await bcrypt.hash('Password123!', 12),
      },
    }),
    prisma.user.upsert({
      where: { email: 'shaz@example.com' },
      update: {},
      create: {
        email: 'shaz@example.com',
        name: 'Shazlin',
        role: 'customer',
        hashedPassword: await bcrypt.hash('Password123!', 12),
      },
    }),
  ]);

  console.log({ admin, customers });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });