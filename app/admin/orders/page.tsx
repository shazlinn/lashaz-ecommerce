// lashaz-ecommerce/app/admin/orders/page.tsx
import prisma from '@/lib/prisma';
import OrdersClient from './orders-client';

export default async function AdminOrdersPage() {
  // Fetch orders with related user and item data
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } }
    },
  });

  const rows = orders.map((o) => ({
    id: o.id,
    customerName: o.user?.name ?? 'Unknown',
    customerEmail: o.user?.email ?? '-',
    total: Number(o.total), // Handle Decimal conversion
    status: o.status as 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
    createdAt: o.createdAt.toISOString(),
    items: o.items.map(i => i.product.name),
  }));

  return (
    <section className="space-y-6 font-sans">
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold font-josefin uppercase tracking-tight text-black">
          Order Ledger
        </h1>
        <p className="text-sm text-gray-500">
          Manage customer fulfillment, track logistics, and generate identity invoices.
        </p>
      </div>

      <OrdersClient initialRows={rows} />
    </section>
  );
}