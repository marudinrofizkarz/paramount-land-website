"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WhatsAppButtonProps {
  phoneNumber?: string; // Format: country code + number (e.g., "6281234567890")
  message?: string;
}

export function WhatsAppButton({
  phoneNumber = "6281387118533",
  message = "Halo, saya tertarik dengan properti Paramount Land. Boleh saya tahu informasi lebih lanjut?",
}: WhatsAppButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Show initial tooltip briefly on load
  useEffect(() => {
    // Show tooltip briefly when component mounts
    const initialTooltipTimer = setTimeout(() => {
      setShowTooltip(true);

      // Hide tooltip after 3 seconds
      const hideTooltipTimer = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);

      return () => clearTimeout(hideTooltipTimer);
    }, 1000);

    return () => clearTimeout(initialTooltipTimer);
  }, []);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Ensure phone number is properly formatted (remove any non-numeric characters)
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // Only open in new tab/window
    try {
      const newWindow = window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      // If pop-up is blocked, create a temporary link and click it
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        // Create temporary invisible link
        const tempLink = document.createElement("a");
        tempLink.href = whatsappUrl;
        tempLink.target = "_blank";
        tempLink.rel = "noopener noreferrer";

        // Add to DOM, click, and remove
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);

      // Final fallback: create and click link
      const tempLink = document.createElement("a");
      tempLink.href = whatsappUrl;
      tempLink.target = "_blank";
      tempLink.rel = "noopener noreferrer";

      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Main WhatsApp button with pulse effect inside */}
      <motion.button
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#20c15c] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-opacity-50"
        aria-label="Contact via WhatsApp"
        title="Chat via WhatsApp: 081387118533"
        type="button"
      >
        {/* Pulse animation effect inside button */}
        <motion.div
          className="absolute inset-0 rounded-full bg-[#25D366]/30 pointer-events-none"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.7, 0.3, 0.7],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 relative z-10"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.95l.14.23-1.1 4.02 4.12-1.08.22.13A7.94 7.94 0 0 0 20 12.05a7.86 7.86 0 0 0-2.4-5.73zm1.57 5.73a6.6 6.6 0 0 1-6.17 6.6 6.64 6.64 0 0 1-3.5-.97l-.67-.4-2.75.72.73-2.7-.42-.67a6.6 6.6 0 0 1-.98-3.49A6.64 6.64 0 0 1 12.05 5.3a6.58 6.58 0 0 1 4.7 1.96 6.63 6.63 0 0 1 2.42 4.8z" />
          <path d="M9.65 7.65a.84.84 0 0 0-.62.29c-.24.26-.9.88-.9 2.13 0 1.26.92 2.48 1.04 2.64a8.4 8.4 0 0 0 3.74 3.21c1.85.73 2.23.58 2.64.55.4-.04 1.3-.54 1.48-1.05.19-.51.19-.95.13-1.04-.06-.09-.22-.14-.46-.25-.25-.1-1.46-.72-1.68-.8-.23-.09-.39-.13-.55.12-.16.26-.62.8-.76.97-.14.17-.28.19-.52.06-.25-.12-1.04-.38-1.98-1.22-.73-.66-1.23-1.46-1.37-1.7-.14-.26-.01-.39.11-.52.1-.12.23-.31.35-.47.11-.16.15-.27.22-.45.08-.17.04-.33-.02-.46-.06-.13-.55-1.32-.76-1.8-.2-.48-.4-.41-.55-.42h-.47z" />
        </svg>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute bottom-full right-0 mb-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg px-4 py-2 w-max max-w-[200px] text-sm pointer-events-none"
          >
            <div className="font-medium mb-1">Butuh bantuan?</div>
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Hubungi kami via WhatsApp
            </div>
            <div className="absolute bottom-[-6px] right-4 transform rotate-45 w-3 h-3 bg-white dark:bg-gray-800"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
