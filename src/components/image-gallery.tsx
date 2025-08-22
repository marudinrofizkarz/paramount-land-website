"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Eye,
  ZoomIn,
} from "lucide-react";
import { useSwipe } from "@/hooks/use-swipe";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const goToPrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Set up swipe handlers for mobile
  const swipeHandlers = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
  });

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === "Escape") {
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Camera className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No gallery images available</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 cursor-pointer group shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Image
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="bg-white/90 text-gray-800 rounded-full p-3 scale-0 group-hover:scale-100 transition-all duration-300 shadow-lg backdrop-blur-sm">
                <Eye className="h-6 w-6" />
              </div>
            </div>
            {/* <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Lihat Detail
            </div> */}
          </div>
        ))}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) closeLightbox();
          setIsOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[85vw] max-h-[95vh] p-0 gap-0 border-none bg-black/98 backdrop-blur-sm">
          <DialogTitle>
            <VisuallyHidden>{alt} - Image Gallery</VisuallyHidden>
          </DialogTitle>
          <div className="relative flex flex-col w-full h-full min-h-[80vh]">
            <div className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-md">
              <p className="text-white text-sm font-medium">
                {currentImageIndex + 1} dari {images.length}
              </p>
            </div>

            <div
              className="flex items-center justify-center flex-1 relative p-4"
              onTouchStart={swipeHandlers.handleTouchStart}
              onTouchMove={swipeHandlers.handleTouchMove}
              onTouchEnd={swipeHandlers.handleTouchEnd}
            >
              <div className="relative w-full h-full max-w-6xl max-h-[70vh] flex items-center justify-center">
                <Image
                  src={images[currentImageIndex]}
                  alt={`${alt} - Image ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 95vw, (max-width: 1200px) 90vw, 85vw"
                  className="object-contain rounded-lg shadow-2xl"
                  priority
                />
              </div>

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 rounded-full z-40 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm h-12 w-12"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 rounded-full z-40 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm h-12 w-12"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            <div className="p-4 bg-gradient-to-t from-black/90 to-black/60 backdrop-blur-sm flex justify-center items-center">
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full justify-center">
                  {images.map((thumb, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-16 h-12 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                        idx === currentImageIndex
                          ? "border-primary scale-110 shadow-lg"
                          : "border-white/30 hover:border-white/60"
                      } cursor-pointer hover:scale-105`}
                    >
                      <Image
                        src={thumb}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      {idx === currentImageIndex && (
                        <div className="absolute inset-0 bg-primary/20" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
