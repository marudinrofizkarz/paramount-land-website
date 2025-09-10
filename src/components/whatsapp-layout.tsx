"use client";

import dynamic from "next/dynamic";
import { GlobalWhatsAppButton } from "@/components/global-whatsapp-button";

// Create a client-only version of the GlobalWhatsAppButton
const DynamicWhatsAppButton = dynamic(
  () => Promise.resolve(GlobalWhatsAppButton),
  { ssr: false }
);

export function WhatsAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <DynamicWhatsAppButton />
    </>
  );
}
