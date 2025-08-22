"use client";

import { WhatsAppButton } from "@/components/whatsapp-button";

/**
 * GlobalWhatsAppButton - Komponen wrapper untuk menampilkan WhatsApp button
 * di semua halaman website. Komponen ini harus dimasukkan ke layout utama.
 */
export function GlobalWhatsAppButton() {
  // Cek apakah saat ini di dashboard atau halaman admin
  const isAdminPage = () => {
    if (typeof window !== "undefined") {
      return (
        window.location.pathname.startsWith("/dashboard") ||
        window.location.pathname.startsWith("/auth")
      );
    }
    return false;
  };

  // Render kondisional: Jangan tampilkan di halaman admin/dashboard
  if (isAdminPage()) {
    return null;
  }

  // Make sure we explicitly set the number in international format
  return (
    <WhatsAppButton
      phoneNumber="6281387118533"
      message="Halo, saya tertarik dengan properti Paramount Land. Boleh saya tahu informasi lebih lanjut?"
    />
  );
}
