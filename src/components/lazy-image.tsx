"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

// Simple color hash function for generating placeholder colors
const colorHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = Math.abs(hash).toString(16).substring(0, 6);
  return "#" + "0".repeat(6 - color.length) + color;
};

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  quality = 80,
  placeholder = "empty",
  blurDataURL,
  fill = false,
  style,
  objectFit = "cover",
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Generate a placeholder color based on image source if no blurDataURL
  const placeholderColor = !blurDataURL ? colorHash(src) : undefined;

  // Auto-generate a blur data URL if none provided
  const calculatedBlurData =
    !blurDataURL && placeholder === "blur"
      ? `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" style="background:${placeholderColor}"></svg>`
      : blurDataURL;

  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Load the image when it's 300px away from viewport for better perceived performance
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "300px",
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  // Style object to prevent layout shifts
  const containerStyle: React.CSSProperties = fill
    ? { position: "relative", width: "100%", height: "100%", ...style }
    : {
        position: "relative",
        overflow: "hidden",
        aspectRatio: `${width} / ${height}`,
        backgroundColor: placeholder === "blur" ? placeholderColor : undefined,
        ...style,
      };

  return (
    <div
      ref={imgRef}
      className={cn("image-container", className)}
      style={containerStyle}
      aria-label={alt}
    >
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          className={cn(
            "transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading={priority ? "eager" : "lazy"}
          placeholder={placeholder}
          blurDataURL={calculatedBlurData}
          onLoad={() => setIsLoaded(true)}
          style={{
            objectFit,
          }}
        />
      )}
    </div>
  );
}
