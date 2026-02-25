// lashaz-ecommerce/app/api/admin/orders/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetching orders with expanded relations for the Ledger
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transforming the data to match the OrderRow type exactly
    const formattedOrders = orders.map(order => ({
      id: order.id,
      customerName: order.user?.name || 'Guest',
      customerEmail: order.user?.email || 'No Email',
      total: Number(order.total),
      status: order.status,
      // Critical: Added trackingNumber to the data transfer object
      // This allows the frontend to display it in the 'View Details' modal
      trackingNumber: (order as any).trackingNumber || null, 
      createdAt: order.createdAt.toISOString(),
      items: order.items.map(item => item.product.name),
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error("Ledger Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}