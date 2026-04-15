// lashaz-ecommerce/app/admin/orders/page.tsx
import prisma from '@/lib/prisma';
import OrdersClient from './orders-client';

export default async function AdminOrdersPage() {
  // 1. Fetch orders including the new paymentReason field
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } }
    },
  });

  // 2. Map the data to match the OrderRow type in orders-client.tsx
  const rows = orders.map((o) => ({
    id: o.id,
    customerName: o.user?.name ?? 'Unknown',
    customerEmail: o.user?.email ?? '-',
    total: Number(o.total), 
    // We cast status as any here to handle the PENDING/PAID enum gracefully
    status: o.status as any, 
    paymentReason: o.paymentReason, // <--- PROHIBIT PENDING: Passing the reason to the UI
    createdAt: o.createdAt.toISOString(),
    items: o.items.map(i => i.product.name),
    trackingNumber: o.trackingNumber, // Ensure tracking is passed if it exists
  }));

  return (
    <section className="space-y-6 font-sans">
      <div className="flex flex-col gap-2 border-b border-gray-100 pb-6 px-1">
        <h1 className="text-3xl font-bold font-josefin uppercase tracking-tight text-black">
          Order Ledger
        </h1>
        <p className="text-sm text-gray-500">
          Manage customer fulfillment, track logistics, and analyze payment protocols.
        </p>
      </div>

      <OrdersClient initialRows={rows} />
    </section>
  );
}