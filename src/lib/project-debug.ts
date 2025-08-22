// Patch untuk memperbaiki masalah upload file dan pembuatan project

import { createProject } from "@/lib/project-actions";

// Fungsi debug untuk membantu mendiagnosis masalah
export async function debugCreateProject(formData: FormData) {
  console.log("=== Debug Create Project ===");
  console.log("Memulai proses pembuatan project...");

  try {
    // Log semua field dari formData
    console.log("Fields dalam FormData:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `${key}: File (${value.name}, ${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    // Verifikasi mainImage
    const mainImage = formData.get("mainImage") as File;
    if (mainImage && mainImage instanceof File) {
      console.log(
        `Main Image ditemukan: ${mainImage.name}, ${mainImage.size} bytes`
      );

      // Verifikasi content type
      if (!mainImage.type.startsWith("image/")) {
        console.warn(
          `⚠️ PERINGATAN: Main Image memiliki tipe konten yang tidak valid: ${mainImage.type}`
        );
      }
    } else {
      console.error("❌ ERROR: Main Image tidak ditemukan atau bukan File");
    }

    // Panggil create project
    console.log("Memanggil createProject...");
    const result = await createProject(formData);

    console.log("Hasil createProject:", result);
    return result;
  } catch (error) {
    console.error("Error dalam debugCreateProject:", error);
    throw error;
  }
}

// Versi yang diperbaiki dari fileToBase64
export async function improvedFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}
