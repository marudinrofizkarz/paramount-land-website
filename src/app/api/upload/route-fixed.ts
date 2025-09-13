import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Check if we're in production and have proper Cloudinary config
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        {
          error: "Upload service not configured",
          message: "Cloudinary configuration is missing",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided", message: "Tidak ada file yang dikirim" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type",
          message: "Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP",
        },
        { status: 400 }
      );
    }

    // Validate file size (max 4MB for Vercel compatibility)
    const maxSize = 4 * 1024 * 1024; // 4MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "File too large",
          message: "Ukuran file maksimal 4MB",
        },
        { status: 400 }
      );
    }

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    // Upload directly to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64String, {
      folder: "custom-components",
      resource_type: "auto",
      transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
      timeout: 25000, // 25 seconds timeout (within Vercel's 30s limit)
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    // Handle specific Cloudinary errors
    if (error.http_code === 413) {
      return NextResponse.json(
        {
          error: "File too large",
          message: "Ukuran file terlalu besar untuk diupload",
        },
        { status: 413 }
      );
    }

    if (error.message?.includes("timeout")) {
      return NextResponse.json(
        {
          error: "Upload timeout",
          message:
            "Upload memakan waktu terlalu lama, coba dengan file yang lebih kecil",
        },
        { status: 408 }
      );
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Upload failed",
        message: "Gagal mengupload gambar. Silakan coba lagi.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Custom Image Upload API",
    supportedTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ],
    maxSize: "4MB",
    status: "available",
  });
}
