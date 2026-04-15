import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Convert FormDataEntryValue to string explicitly to fix TS(2322)
    const status = formData.get("status")?.toString(); 
    const orderId = (formData.get("order_id") || formData.get("billExternalReferenceNo"))?.toString();
    const billCode = formData.get("billcode")?.toString();
    const reason = formData.get("reason")?.toString();

    console.log(`[Webhook] Raw Data: OrderID: ${orderId}, Status: ${status}, BillCode: ${billCode}`);

    // 1. Validate Order ID existence and type
    if (!orderId) {
      console.error("[Webhook] Protocol Error: Missing Order ID in ToyyibPay payload.");
      return new NextResponse("Missing Order ID", { status: 400 });
    }

    // 2. Process Status Updates
    if (status === "1") {
      // SUCCESS Handshake
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          status: "PAID", 
          toyyibPayBillCode: billCode 
        },
      });
      console.log(`[Webhook] Verification Success: Order ${orderId} is now PAID.`);
    } 
    else if (status === "2") {
      // PENDING - Usually means the user is still at the bank UI or it's processing
      console.log(`[Webhook] Status 2: Order ${orderId} is currently processing.`);
    }
    else if (status === "3") {
      // FAILED/CANCELLED
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });
      console.log(`[Webhook] Termination: Order ${orderId} marked as CANCELLED. Reason: ${reason}`);
    }

    // ToyyibPay requires a plain text "OK" or 200 status to stop retrying
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("[Webhook Exception]:", error);
    // Return 200 even on error to prevent ToyyibPay from infinitely retrying 
    // while you debug the logs.
    return new NextResponse("Handled Error", { status: 200 });
  }
}