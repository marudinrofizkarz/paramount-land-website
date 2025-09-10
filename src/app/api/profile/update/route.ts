import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-server";
import { updateUserProfile } from "@/lib/profile-actions";

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const authToken = request.cookies.get("auth_token")?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: "Tidak terautentikasi" },
        { status: 401 }
      );
    }

    const verification = await verifyToken(authToken);

    if (!verification.success || !verification.user) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, username, email, password, avatar_url } = body;

    // Validate at least one field is provided
    if (!name && !username && !email && !password && avatar_url === undefined) {
      return NextResponse.json(
        { success: false, message: "Setidaknya satu field harus diisi" },
        { status: 400 }
      );
    }

    // Update profile
    const result = await updateUserProfile(verification.user.id, {
      name,
      username,
      email,
      password,
      avatar_url,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui profile" },
      { status: 500 }
    );
  }
}
