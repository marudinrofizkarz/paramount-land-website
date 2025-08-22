import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "./env-config";

// Validate Cloudinary configuration
if (!CLOUDINARY_CONFIG.cloudName && process.env.NODE_ENV === "production") {
  throw new Error(
    "❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required for production deployment"
  );
}

if (!CLOUDINARY_CONFIG.apiKey && process.env.NODE_ENV === "production") {
  throw new Error(
    "❌ CLOUDINARY_API_KEY is required for production deployment"
  );
}

if (!CLOUDINARY_CONFIG.apiSecret && process.env.NODE_ENV === "production") {
  throw new Error(
    "❌ CLOUDINARY_API_SECRET is required for production deployment"
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.cloudName,
  api_key: CLOUDINARY_CONFIG.apiKey,
  api_secret: CLOUDINARY_CONFIG.apiSecret,
});

export { cloudinary };

export async function uploadToCloudinary(
  file: string,
  folder: string = "hero-sliders"
) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: "auto",
      transformation: [{ quality: "auto" }],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      success: true,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return {
      url: null,
      publicId: null,
      success: false,
      error,
    };
  }
}
