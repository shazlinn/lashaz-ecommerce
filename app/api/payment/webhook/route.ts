// ecommerce/app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // 1. ToyyibPay sends data as x-www-form-urlencoded (FormData)
    const formData = await req.formData();
    
    // Extract fields sent by ToyyibPay
    const status = formData.get("status"); // 1=Success, 2=Pending, 3=Fail
    const orderId = formData.get("order_id") as string; // Your LS-12345 ID
    const billCode = formData.get("billcode") as string;
    const reason = formData.get("reason") as string; // Helpful for debugging failures

    console.log(`[Webhook] Processing Order: ${orderId} | Status: ${status}`);

    // 2. Validate that we have an orderId
    if (!orderId) {
      return new NextResponse("Missing Order ID", { status: 400 });
    }

    // 3. Update the database based on status
    if (status === "1") {
      // Payment Successful
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: "PAID", 
          toyyibPayBillCode: billCode 
        },
      });
      console.log(`[Webhook] Success: Order ${orderId} updated to PAID.`);
    } else if (status === "3") {
      // Payment Failed
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
      console.log(`[Webhook] Failed: Order ${orderId} updated to CANCELLED. Reason: ${reason}`);
    }

    // 4. ToyyibPay expects a simple "OK" or 200 response to stop retrying the webhook
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("[Webhook Error]:", error);
    // Even if it fails, we return a 200 so ToyyibPay doesn't spam your endpoint
    // But you should check your Vercel logs to see what went wrong
    return new NextResponse("Internal Error", { status: 500 });
  }
}