import { NextRequest, NextResponse } from "next/server";
import { resetUserPassword } from "@/lib/auth-server";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  try {
    // Token is now from params
    // const searchParams = request.nextUrl.searchParams;
    // const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token reset password diperlukan" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password baru diperlukan" },
        { status: 400 }
      );
    }

    const result = await resetUserPassword(token, password);

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat reset password" },
      { status: 500 }
    );
  }
}
