import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, remember } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password diperlukan" },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password, remember);

    if (result.success && result.token) {
      // Set JWT token as HTTP-only cookie using NextResponse
      const response = NextResponse.json({
        success: result.success,
        message: result.message,
        user: result.user,
      });

      // Set HTTP-only cookie with the token
      const maxAge = remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24; // 7 days or 1 day
      response.cookies.set({
        name: "auth_token",
        value: result.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge,
      });

      return response;
    }

    return NextResponse.json(result, { status: result.success ? 200 : 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
