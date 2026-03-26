// lashaz-ecommerce/app/api/admin/orders/resend/route.ts
import prisma from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { orderId, status, userEmail } = await req.json();

    // Query the database to retrieve the stored tracking number
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { trackingNumber: true }
    });

    // Trigger the email protocol with the retrieved tracking data
    // This solves the 'undefined' issue by providing the actual value from your schema
    await sendOrderEmail(
      userEmail, 
      orderId, 
      status, 
      order?.trackingNumber || undefined
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend Protocol Error:", error);
    return NextResponse.json({ error: "Failed to re-transmit email" }, { status: 500 });
  }
}