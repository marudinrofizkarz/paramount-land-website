"use client";

import { GlobalWhatsAppButton } from "@/components/global-whatsapp-button";

export function WhatsAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GlobalWhatsAppButton />
    </>
  );
}
