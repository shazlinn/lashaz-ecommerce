// ecommerce/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { amount, userName, userPhone, items } = await req.json();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Find the user in your DB to get their ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. CREATE the order in Prisma first (Status: PENDING)
    // This is why they weren't showing up before!
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: amount,
        status: "PENDING", // Uses the new Enum
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // 3. Prepare ToyyibPay Details
    const subtotal = Math.round(amount * 100); 

    const details = new URLSearchParams({
      userSecretKey: process.env.TOYYIBPAY_SECRET!,
      categoryCode: process.env.TOYYIBPAY_CATEGORY!,
      billName: "La Shaz Order",
      billDescription: `Payment for Order #${order.id}`,
      billPriceSetting: "1",
      billPayorInfo: "1",
      billAmount: subtotal.toString(),
      billReturnUrl: `${process.env.NEXTAUTH_URL}/payment-success`, 
      billCallbackUrl: `${process.env.NEXTAUTH_URL}/api/payment/webhook`,
      billExternalReferenceNo: order.id, // We use the Prisma Order ID here
      billTo: userName,
      billEmail: session.user.email,
      billPhone: userPhone,
    });

    // 4. Handshake with ToyyibPay
    const response = await fetch(process.env.TOYYIBPAY_URL!, {
      method: "POST",
      body: details,
    });

    const data = await response.json();

    if (!data || !data[0] || !data[0].BillCode) {
      return NextResponse.json({ error: "ToyyibPay Handshake Failed" }, { status: 400 });
    }

    const billCode = data[0].BillCode;

    // 5. Update the order with the BillCode so we can track it
    await prisma.order.update({
      where: { id: order.id },
      data: { toyyibPayBillCode: billCode }
    });

    return NextResponse.json({ 
      url: `https://dev.toyyibpay.com/${billCode}` 
    });

  } catch (error) {
    console.error("Checkout System Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}