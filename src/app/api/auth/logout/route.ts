import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Create a response
    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    // Delete the auth token cookie
    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat logout" },
      { status: 500 }
    );
  }
}
