"use client";

import { serializeData } from "@/lib/serialization";

// Type untuk data contact inquiry
interface ContactInquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  projectId: string;
  projectName: string;
  unitSlug?: string | null;
}

// Type untuk response dari server action
interface ContactInquiryResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// Import server action di sini
let submitContactInquiry: ((data: ContactInquiryData) => Promise<ContactInquiryResponse>) | null = null;

// Gunakan dynamic import untuk server action
async function importServerAction() {
  if (!submitContactInquiry) {
    const module = await import("@/lib/contact-inquiry-actions");
    submitContactInquiry = module.submitContactInquiry;
  }
  return submitContactInquiry;
}

/**
 * Wrapper untuk memanggil server action dengan serialisasi data
 * Mengatasi masalah "Only plain objects can be passed to Client Components from Server Components"
 * 
 * @param _actionFn - Parameter ini tidak digunakan, hanya untuk kompatibilitas
 * @param data - Data yang akan dikirim ke server action
 * @returns Hasil dari server action yang telah diserialisasi
 */
export async function submitContactInquiryWrapper(
  _actionFn: any, 
  data: ContactInquiryData
): Promise<ContactInquiryResponse> {
  try {
    // Dapatkan server action
    const actionFn = await importServerAction();
    
    if (!actionFn) {
      throw new Error('Failed to load server action');
    }
    
    // Serialize data sebelum mengirim ke server action
    const serializedData = serializeData(data);
    
    // Panggil server action
    const result = await actionFn(serializedData);
    
    // Serialize hasil dari server action
    return serializeData(result);
  } catch (error) {
    console.error('Error in submitContactInquiryWrapper:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}