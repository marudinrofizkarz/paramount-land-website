import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
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

    if (!verification.success) {
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid" },
        { status: 401 }
      );
    }

    // Get the uploaded file
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "File harus berupa gambar" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "Ukuran file maksimal 5MB" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append(
      "upload_preset",
      process.env.CLOUDINARY_UPLOAD_PRESET || ""
    );
    uploadFormData.append("folder", "avatars");

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    if (!cloudinaryResponse.ok) {
      throw new Error("Failed to upload to Cloudinary");
    }

    const cloudinaryData = await cloudinaryResponse.json();

    return NextResponse.json({
      success: true,
      url: cloudinaryData.secure_url,
      public_id: cloudinaryData.public_id,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengupload avatar" },
      { status: 500 }
    );
  }
}
