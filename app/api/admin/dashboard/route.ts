// lashaz-ecommerce/app/api/admin/dashboard/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetching comprehensive store intelligence in parallel
    const [
      salesData, 
      orderCount, 
      userCount, 
      lowStockCount, 
      recentOrders,
      topProductsRaw
    ] = await Promise.all([
      prisma.order.aggregate({
        where: { createdAt: { gte: today }, status: { not: 'CANCELLED' } },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count(),
      prisma.product.count({ where: { stock: { lt: 5 } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      }),
      // Calculate Top 5 Products by sales volume
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      })
    ]);

    // Resolve Product Names for the "Top Products" list
    const topProducts = await Promise.all(
      topProductsRaw.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        });
        return {
          name: product?.name || "Unknown Product",
          sales: item._sum.quantity || 0
        };
      })
    );

    return NextResponse.json({
      sales: Number(salesData._sum.total || 0),
      orders: orderCount,
      users: userCount,
      lowStock: lowStockCount,
      topProducts, // NEW: Data for your performance chart
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        customer: o.user?.name || "Guest",
        total: Number(o.total),
        status: o.status
      }))
    });
  } catch (error) {
    console.error("Dashboard Sync Error:", error);
    return NextResponse.json({ error: "Data Sync Failed" }, { status: 500 });
  }
}