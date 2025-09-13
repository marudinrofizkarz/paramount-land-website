"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  fallbackText?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

/**
 * SafeImage Component
 *
 * Automatically handles image loading errors by showing fallback image or placeholder.
 * Useful for landing page components where image URLs might be broken or missing.
 */
export function SafeImage({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/placeholder.svg",
  fallbackText,
  priority = false,
  fill = false,
  sizes,
  style,
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleError = () => {
    if (!error && currentSrc !== fallbackSrc) {
      setError(true);
      setCurrentSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    // Reset error state when image loads successfully
    if (error && currentSrc === src) {
      setError(false);
    }
  };

  // If we're in fallback mode and have fallback text, show text placeholder
  if (error && fallbackText && currentSrc === fallbackSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm",
          className
        )}
        style={style}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🖼️</div>
          <div>{fallbackText}</div>
        </div>
      </div>
    );
  }

  // Use Next.js Image component with error handling
  const imageProps = {
    src: currentSrc,
    alt: alt,
    onError: handleError,
    onLoad: handleLoad,
    priority,
    className: cn(className, error && "opacity-75"),
    style,
    ...(fill
      ? { fill: true, sizes: sizes || "100vw" }
      : { width: width || 400, height: height || 300 }),
  };

  return <Image {...imageProps} />;
}

/**
 * SafeBackgroundImage Component
 *
 * For components that use background images with CSS
 */
export function SafeBackgroundImage({
  src,
  fallbackSrc = "/placeholder.svg",
  className,
  children,
  style,
  ...props
}: {
  src: string;
  fallbackSrc?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [error, setError] = useState(false);

  // Check if image exists
  const checkImageExists = (url: string) => {
    return new Promise<boolean>((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Use effect to validate image on mount
  useEffect(() => {
    if (src && src !== fallbackSrc) {
      checkImageExists(src).then((exists) => {
        if (!exists) {
          setError(true);
          setCurrentSrc(fallbackSrc);
        }
      });
    }
  }, [src, fallbackSrc]);

  const backgroundStyle = {
    backgroundImage: `url(${currentSrc})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    ...style,
  };

  return (
    <div
      className={cn(className, error && "bg-gray-100 dark:bg-gray-800")}
      style={backgroundStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default SafeImage;
