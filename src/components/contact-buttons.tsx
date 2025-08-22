"use client";

import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface ContactButtonsProps {
  phoneNumber: string;
  whatsappNumber: string;
  whatsappMessage?: string;
}

export function ContactButtons({
  phoneNumber,
  whatsappNumber,
  whatsappMessage = "Halo, saya tertarik dengan properti Anda",
}: ContactButtonsProps) {
  const handlePhoneCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="grid grid-cols-2 gap-3 mt-6">
      <Button
        variant="default"
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={handlePhoneCall}
      >
        <Phone className="h-4 w-4 mr-2" />
        Telepon
      </Button>
      <Button
        variant="default"
        className="w-full bg-[#25D366] hover:bg-[#20BD5C]"
        onClick={handleWhatsApp}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 mr-2"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.95l.14.23-1.1 4.02 4.12-1.08.22.13A7.94 7.94 0 0 0 20 12.05a7.86 7.86 0 0 0-2.4-5.73zm1.57 5.73a6.6 6.6 0 0 1-6.17 6.6 6.64 6.64 0 0 1-3.5-.97l-.67-.4-2.75.72.73-2.7-.42-.67a6.6 6.6 0 0 1-.98-3.49A6.64 6.64 0 0 1 12.05 5.3a6.58 6.58 0 0 1 4.7 1.96 6.63 6.63 0 0 1 2.42 4.8z" />
          <path d="M9.65 7.65a.84.84 0 0 0-.62.29c-.24.26-.9.88-.9 2.13 0 1.26.92 2.48 1.04 2.64a8.4 8.4 0 0 0 3.74 3.21c1.85.73 2.23.58 2.64.55.4-.04 1.3-.54 1.48-1.05.19-.51.19-.95.13-1.04-.06-.09-.22-.14-.46-.25-.25-.1-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12-.16.26-.62.8-.76.97-.14.17-.28.19-.52.06-.25-.12-1.04-.38-1.98-1.22-.73-.66-1.23-1.46-1.37-1.7-.14-.26-.01-.39.11-.52.1-.12.23-.31.35-.47.11-.16.15-.27.22-.45.08-.17.04-.33-.02-.46-.06-.13-.55-1.32-.76-1.8-.2-.48-.4-.41-.55-.42h-.47z" />
        </svg>
        WhatsApp
      </Button>
    </div>
  );
}
