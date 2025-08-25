"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

interface CopyLinkButtonProps {
  shareUrl: string;
}

export function CopyLinkButton({ shareUrl }: CopyLinkButtonProps) {
  const [absoluteUrl, setAbsoluteUrl] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if shareUrl is already absolute
    if (shareUrl.startsWith("http")) {
      setAbsoluteUrl(shareUrl);
    } else {
      // Convert relative URL to absolute using window.location, safely check for window
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      setAbsoluteUrl(`${baseUrl}${shareUrl}`);
    }
  }, [shareUrl]);

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

  return (
    <TooltipTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(absoluteUrl);
          // Tambahkan notifikasi toast di sini jika diinginkan
        }}
        aria-label="Copy link"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
  );
}
