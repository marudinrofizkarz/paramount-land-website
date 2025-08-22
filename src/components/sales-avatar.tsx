"use client";

import Image from "next/image";
import { useState } from "react";

interface SalesAvatarProps {
  imagePath: string;
  fallbackPath: string;
  alt: string;
}

export function SalesAvatar({
  imagePath,
  fallbackPath,
  alt,
}: SalesAvatarProps) {
  const [imageSrc, setImageSrc] = useState(imagePath);
  const [hasError, setHasError] = useState(false);

  // Gunakan fallback lokal untuk mencegah error
  const localFallback = "/sales-avatar-fallback.jpg";

  return (
    <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary">
      <Image
        src={hasError ? localFallback : imageSrc}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
