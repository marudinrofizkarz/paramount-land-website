"use client";

import { useState, useEffect } from "react";
import { LazyImage } from "./lazy-image";

interface OptimizedGalleryProps {
  images: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
  className?: string;
  imageClassName?: string;
}

/**
 * OptimizedGallery component that progressively loads images
 * and optimizes for Core Web Vitals
 */
export function OptimizedGallery({
  images,
  className = "",
  imageClassName = "",
}: OptimizedGalleryProps) {
  const [visibleImages, setVisibleImages] = useState<number>(1);

  useEffect(() => {
    // Load first image immediately, then progressively load others
    if (images.length > 1) {
      // Load the second image after 100ms
      const timer1 = setTimeout(() => {
        setVisibleImages(2);
      }, 100);

      // Load all remaining images after LCP is likely complete
      const timer2 = setTimeout(() => {
        setVisibleImages(images.length);
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [images.length]);

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={`overflow-hidden rounded-lg ${imageClassName}`}
        >
          {index < visibleImages ? (
            <LazyImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority={index === 0}
              placeholder="blur"
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
          ) : (
            <div
              className="w-full bg-gray-200 dark:bg-gray-800 animate-pulse"
              style={{
                aspectRatio: `${image.width} / ${image.height}`,
              }}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}
