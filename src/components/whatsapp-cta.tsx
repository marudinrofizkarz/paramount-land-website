"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp, IconPhone, IconMessage } from "@tabler/icons-react";
import { UTMTracker } from "@/lib/utm-tracker";

interface WhatsAppCTAProps {
  phoneNumber: string;
  message?: string;
  buttonText?: string;
  style?: "floating" | "inline" | "header";
  trackingId?: string;
}

export function WhatsAppCTA({
  phoneNumber,
  message = "Hi! I'm interested in Altadena Residence. Can you provide more information?",
  buttonText = "WhatsApp Sekarang",
  style = "inline",
  trackingId = "whatsapp_cta",
}: WhatsAppCTAProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    // Track click event for analytics
    if (typeof window !== "undefined") {
      const utmTracker = UTMTracker.getInstance();
      const utmParams = utmTracker.getUTMParams();

      // Enhanced tracking for Google Ads
      if ((window as any).gtag) {
        (window as any).gtag("event", "click", {
          event_category: "engagement",
          event_label: "whatsapp_cta",
          value: 1,
          custom_parameters: {
            source: utmTracker.getSource(),
            campaign: utmTracker.getCampaign(),
            ...utmParams,
          },
        });
      }

      // Track in our analytics
      fetch("/api/analytics/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "whatsapp_click",
          trackingId,
          utmParams,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }

    // Format WhatsApp URL
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  if (style === "floating") {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleWhatsAppClick}
          className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <IconBrandWhatsapp className="h-8 w-8 text-white" />
        </Button>
        {isHovered && (
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            {buttonText}
          </div>
        )}
      </div>
    );
  }

  if (style === "header") {
    return (
      <Button
        onClick={handleWhatsAppClick}
        variant="outline"
        size="sm"
        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
      >
        <IconBrandWhatsapp className="h-4 w-4 mr-2" />
        {buttonText}
      </Button>
    );
  }

  // Inline style (default)
  return (
    <Button
      onClick={handleWhatsAppClick}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
      size="lg"
    >
      <IconBrandWhatsapp className="h-5 w-5 mr-2" />
      {buttonText}
    </Button>
  );
}
