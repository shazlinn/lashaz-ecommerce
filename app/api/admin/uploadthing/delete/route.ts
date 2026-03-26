import { utapi } from "@/app/api/uploadthing/core"; // You need to export utapi from core
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Security check: Only admins can delete files
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileKey } = await req.json();
    if (!fileKey) return NextResponse.json({ error: "No key provided" }, { status: 400 });

    // 2. Call UploadThing API to delete the file
    await utapi.deleteFiles(fileKey);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UT_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}