"use client";

import { useEffect, useState } from "react";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { usePathname } from "next/navigation";

/**
 * GlobalWhatsAppButton - Komponen wrapper untuk menampilkan WhatsApp button
 * di semua halaman website. Komponen ini harus dimasukkan ke layout utama.
 */
export function GlobalWhatsAppButton() {
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Cek apakah saat ini di dashboard atau halaman admin
    const isAdminOrAuthPage =
      pathname.startsWith("/dashboard") || pathname.startsWith("/auth");

    setShouldRender(!isAdminOrAuthPage);
  }, [pathname]);

  // Render kondisional: Jangan tampilkan di halaman admin/dashboard
  if (!shouldRender) {
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
