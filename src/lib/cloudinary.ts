import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
