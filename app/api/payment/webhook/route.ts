// ecommerce/app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // 1. Extract and cast all potential fields to strings
    const status = formData.get("status")?.toString(); 
    const billCode = formData.get("billcode")?.toString();
    const reason = formData.get("reason")?.toString(); // This is the "Status Reason"
    
    // ToyyibPay uses 'order_id' to send back your external reference
    const orderId = formData.get("order_id")?.toString();

    console.log("--- TOYYIBPAY WEBHOOK INBOUND ---");
    console.log(`Status: ${status} | OrderRef: ${orderId} | Reason: ${reason}`);

    if (!orderId) {
      console.error("[Webhook] Protocol Error: No Order ID found in payload.");
      return new NextResponse("OK", { status: 200 });
    }

    // 2. Locate the order in your database
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

    // 3. Update status AND save the reason
    if (status === "1") {
      // SUCCESS
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: "PAID", 
          toyyibPayBillCode: billCode,
          // If you have a 'paymentReason' field, we clear it or set it to 'Success'
          paymentReason: "Payment Successful" 
        },
      });
      console.log(`[Webhook] SUCCESS: Order ${order.id} updated to PAID.`);
    } 
    else if (status === "3") {
      // FAILED / CANCELLED
      await prisma.order.update({
        where: { id: order.id },
        data: { 
          status: "CANCELLED",
          paymentReason: reason || "User cancelled or transaction failed" // Save the specific reason
        },
      });
      console.log(`[Webhook] FAILED: Order ${order.id} updated to CANCELLED. Reason: ${reason}`);
    }
    else if (status === "2") {
       // PENDING
       await prisma.order.update({
        where: { id: order.id },
        data: { paymentReason: "Pending Bank Verification" },
      });
    }

    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("[Webhook Exception]:", error);
    return new NextResponse("OK", { status: 200 });
  }
}