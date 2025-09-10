import { NextRequest, NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email diperlukan" },
        { status: 400 }
      );
    }

    const result = await requestPasswordReset(email);

    // Untuk keamanan, kita selalu mengembalikan success
    // Agar user tidak bisa mengetahui email mana yang terdaftar
    return NextResponse.json({
      success: true,
      message: "Jika email terdaftar, instruksi reset password akan dikirimkan",
      // Dalam produksi, jangan kembalikan token seperti ini
      ...(process.env.NODE_ENV !== "production" && {
        resetToken: result.resetToken,
      }),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat request reset password",
      },
      { status: 500 }
    );
  }
}
