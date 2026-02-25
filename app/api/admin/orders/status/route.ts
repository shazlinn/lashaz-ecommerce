// lashaz-ecommerce/app/api/admin/orders/status/route.ts
import prisma from '@/lib/prisma';
import { sendOrderEmail } from "@/lib/mail"; 
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    // 1. EXTRACT: Pull trackingNumber from the request body sent by the prompt
    const { orderId, status, userEmail, trackingNumber } = await req.json();

    // 2. SAVE: Update the database record with BOTH status and trackingNumber
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status, 
        trackingNumber: trackingNumber || null // Saves to your schema field
      },
    });

    // 3. TRANSMIT: Pass the trackingNumber into the mailer
    // This is where your console.log in mail.ts gets its value!
    await sendOrderEmail(userEmail, orderId, status, trackingNumber);

    return NextResponse.json({ success: true, updatedOrder });
  } catch (error) {
    console.error("Fulfillment API Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}