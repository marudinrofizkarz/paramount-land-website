import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    // Get the auth token from cookies
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // Verify the token
    const verification = await verifyToken(authToken);

    if (!verification.success) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid atau sudah kadaluarsa" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: verification.user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memeriksa autentikasi",
      },
      { status: 500 }
    );
  }
}
