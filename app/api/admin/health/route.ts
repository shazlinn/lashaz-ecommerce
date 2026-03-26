// lashaz-ecommerce/app/api/admin/health/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Performs a low-level 'ping' to verify the Neon connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ONLINE" });
  } catch (error) {
    return NextResponse.json({ status: "OFFLINE" }, { status: 500 });
  }
}