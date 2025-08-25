"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { CopyLinkButton } from "@/components/copy-link-button";

interface ShareButtonsProps {
  shareUrl: string;
  newsTitle: string;
  featuredImage?: string;
}

export default function ShareButtons({
  shareUrl,
  newsTitle,
  featuredImage,
}: ShareButtonsProps) {
  const [absoluteUrl, setAbsoluteUrl] = useState("");
  const [mounted, setMounted] = useState(false);
  const [facebookShareUrl, setFacebookShareUrl] = useState("");

  useEffect(() => {
    setMounted(true);

    // Check if shareUrl is already absolute
    if (shareUrl.startsWith("http")) {
      setAbsoluteUrl(shareUrl);
    } else {
      // Convert relative URL to absolute using window.location
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      setAbsoluteUrl(`${baseUrl}${shareUrl}`);
    }

    // Create Facebook share URL with image parameter if available
    let fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl.startsWith("http")
        ? shareUrl
        : `${
            typeof window !== "undefined" ? window.location.origin : ""
          }${shareUrl}`
    )}`;

    setFacebookShareUrl(fbUrl);
  }, [shareUrl, featuredImage]);

  // Only render share buttons on the client side
  if (!mounted) {
    return null;
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <a
                href={facebookShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Facebook</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  absoluteUrl
                )}&text=${encodeURIComponent(newsTitle)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on Twitter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  absoluteUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on LinkedIn</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <CopyLinkButton shareUrl={shareUrl} />
          <TooltipContent>
            <p>Copy link</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
