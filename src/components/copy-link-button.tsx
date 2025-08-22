'use client';

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { TooltipTrigger } from "@/components/ui/tooltip";

interface CopyLinkButtonProps {
  shareUrl: string;
}

export function CopyLinkButton({ shareUrl }: CopyLinkButtonProps) {
  return (
    <TooltipTrigger asChild>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => {
          navigator.clipboard.writeText(shareUrl);
          // Tambahkan notifikasi toast di sini jika diinginkan
        }}
        aria-label="Copy link"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
  );
}