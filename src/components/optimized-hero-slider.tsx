"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";

// Skeleton UI saat slider sedang dimuat
function HeroSliderSkeleton() {
  return (
    <div className="w-full h-[50vh] md:h-[60vh] bg-muted animate-pulse flex items-center justify-center">
      <span className="text-muted-foreground">Loading slider...</span>
    </div>
  );
}

const sliderImages = [
  {
    desktop:
      "https://primaland.id/storage/assets/puriasthagina/2023/banner1-desktop.webp",
    mobile:
      "https://primaland.id/storage/assets/puriasthagina/2023/banner1-mobile.webp",
    alt: "Modern house in a beautiful landscape",
  },
  {
    desktop:
      "https://primaland.id/storage/assets/puriasthagina/2023/banner-sec3-desktop.webp",
    mobile:
      "https://primaland.id/storage/assets/puriasthagina/2023/banner-sec3-mobile.webp",
    alt: "Elegant living room interior",
  },
];

export function HeroSlider() {
  const [autoplay, setAutoplay] = useState<any>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);

  // Dynamically import the autoplay plugin when component is mounted
  useEffect(() => {
    let isMounted = true;

    // Import the autoplay module dynamically to reduce initial bundle size
    const loadAutoplay = async () => {
      try {
        const AutoplayModule = await import("embla-carousel-autoplay");
        if (isMounted) {
          const autoplayPlugin = AutoplayModule.default({
            delay: 5000,
            stopOnInteraction: true,
          });
          setAutoplay(autoplayPlugin);
        }
      } catch (error) {
        console.error("Error loading autoplay module:", error);
      }
    };

    loadAutoplay();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle mouse interactions
  const handleMouseEnter = () => {
    if (autoplay && typeof autoplay.stop === "function") {
      autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && typeof autoplay.reset === "function") {
      autoplay.reset();
    }
  };

  return (
    <section className="w-full">
      <Suspense fallback={<HeroSliderSkeleton />}>
        <div className="relative">
          <div
            className="w-full overflow-hidden"
            ref={emblaRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex">
              {sliderImages.map((image, index) => (
                <div className="flex-[0_0_100%] min-w-0" key={index}>
                  <div className="relative w-full h-[50vh] md:h-[60vh]">
                    {/* Desktop Image */}
                    <div className="hidden md:block h-full">
                      <Image
                        src={image.desktop}
                        alt={image.alt}
                        width={1920}
                        height={1080}
                        className="w-full h-full object-cover"
                        priority={index === 0}
                        sizes="100vw"
                        data-ai-hint="hero banner"
                      />
                    </div>
                    {/* Mobile Image */}
                    <div className="block md:hidden h-full">
                      <Image
                        src={image.mobile}
                        alt={image.alt}
                        width={768}
                        height={1024}
                        className="w-full h-full object-cover"
                        priority={index === 0}
                        sizes="100vw"
                        data-ai-hint="mobile banner"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CarouselPrevious
            className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex z-10"
            onClick={() => emblaApi?.scrollPrev()}
          />
          <CarouselNext
            className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex z-10"
            onClick={() => emblaApi?.scrollNext()}
          />
        </div>
      </Suspense>
    </section>
  );
}
