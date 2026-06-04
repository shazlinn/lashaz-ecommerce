//ecommerce/app/api/payment/process-return/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusId = searchParams.get("status_id");
  const billcode = searchParams.get("billcode");

  // ToyyibPay Status 1 = Success, Status 3 = Failed
  if (statusId === "1") {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/payment-success?billcode=${billcode}`);
  } else {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/payment-failed?billcode=${billcode}`);
  }
}