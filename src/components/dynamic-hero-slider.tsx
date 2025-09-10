"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef, useState, useEffect } from "react";
import { HeroSlider as HeroSliderType } from "@/types/hero-slider";

interface HeroSliderProps {
  sliders: HeroSliderType[];
}

export function HeroSlider({ sliders = [] }: HeroSliderProps) {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);

  // Preload next slide image
  useEffect(() => {
    if (sliders.length > 1) {
      const nextIndex = (currentSlide + 1) % sliders.length;
      const nextSlider = sliders[nextIndex];

      // Preload desktop image
      const imgDesktop = new window.Image();
      imgDesktop.src = nextSlider.desktopImage;

      // Preload mobile image
      const imgMobile = new window.Image();
      imgMobile.src = nextSlider.mobileImage;
    }
  }, [currentSlide, sliders]);

  // Loading state for first render
  if (sliders.length === 0) {
    return (
      <section className="w-full">
        <div className="relative w-full bg-muted h-[50vh] md:h-[60vh] flex items-center justify-center animate-pulse">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted-foreground/20 rounded-full animate-pulse"></div>
            <p className="text-muted-foreground">Loading slider...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {sliders.map((slider, index) => (
            <CarouselItem key={slider.id}>
              <div className="relative w-full">
                {/* Desktop Image */}
                <div className="hidden md:block">
                  <Image
                    src={slider.desktopImage}
                    alt={slider.title}
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                    priority={index === 0}
                    quality={index === 0 ? 90 : 75}
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    data-ai-hint="hero banner"
                    onLoad={() => {
                      setImagesLoaded((prev) => new Set(prev).add(index));
                    }}
                    style={{
                      transition: "opacity 0.3s ease-in-out",
                      opacity: imagesLoaded.has(index) ? 1 : 0,
                    }}
                  />
                </div>
                {/* Mobile Image */}
                <div className="block md:hidden">
                  <Image
                    src={slider.mobileImage}
                    alt={slider.title}
                    width={768}
                    height={1024}
                    className="w-full h-auto object-cover"
                    priority={index === 0}
                    quality={index === 0 ? 90 : 75}
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    data-ai-hint="mobile banner"
                    onLoad={() => {
                      setImagesLoaded((prev) => new Set(prev).add(index));
                    }}
                    style={{
                      transition: "opacity 0.3s ease-in-out",
                      opacity: imagesLoaded.has(index) ? 1 : 0,
                    }}
                  />
                </div>

                {/* Slider Content - Removed to only show images */}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex" />
      </Carousel>
    </section>
  );
}
