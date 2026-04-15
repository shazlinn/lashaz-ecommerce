import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. Extract and cast all potential fields to strings
    const status = formData.get("status")?.toString(); 
    const billCode = formData.get("billcode")?.toString();
    const reason = formData.get("reason")?.toString();
    
    // ToyyibPay documentation says they use 'order_id' for the callback
    const orderId = formData.get("order_id")?.toString();

    console.log("--- TOYYIBPAY WEBHOOK INBOUND ---");
    console.log(`Status: ${status} | OrderRef: ${orderId} | BillCode: ${billCode}`);

    if (!orderId) {
      console.error("[Webhook] Protocol Error: No Order ID found in payload.");
      return new NextResponse("OK", { status: 200 });
    }

    // 2. FUZZY MATCH: Find the order even if the ID was truncated by ToyyibPay
    // We use findFirst instead of findUnique to allow for the 'startsWith' safety net
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { id: { startsWith: orderId } } 
        ]
      }
    });

    if (!order) {
      console.error(`[Webhook] Database Mismatch: Order ID ${orderId} not found in Prisma.`);
      return new NextResponse("OK", { status: 200 });
    }

    // 3. Process Status Logic
    if (status === "1") {
      await prisma.order.update({
        where: { id: order.id }, // Use the verified ID from our search
        data: { 
          status: "PAID", 
          toyyibPayBillCode: billCode 
        },
      });
      console.log(`[Webhook] SUCCESS: Order ${order.id} verified and updated to PAID.`);
    } 
    else if (status === "3") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "CANCELLED" },
      });
      console.log(`[Webhook] FAILED: Order ${order.id} updated to CANCELLED. Reason: ${reason}`);
    }

    // Always return 200 OK so ToyyibPay stops sending the notification
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("[Webhook Exception]:", error);
    // Return 200 even on crash to stop the ToyyibPay retry loop
    return new NextResponse("OK", { status: 200 });
  }
}