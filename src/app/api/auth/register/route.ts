import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, name, password } = body;

    if (!username || !email || !name || !password) {
      return NextResponse.json(
        { success: false, message: "Semua data diperlukan" },
        { status: 400 }
      );
    }

    const result = await registerUser({ username, email, name, password });

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat registrasi" },
      { status: 500 }
    );
  }
}
