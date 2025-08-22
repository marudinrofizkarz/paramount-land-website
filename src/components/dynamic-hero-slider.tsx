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
import { useRef } from "react";
import { HeroSlider as HeroSliderType } from "@/types/hero-slider";

interface HeroSliderProps {
  sliders: HeroSliderType[];
}

export function HeroSlider({ sliders = [] }: HeroSliderProps) {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  // If no sliders are provided, show a placeholder
  if (sliders.length === 0) {
    return (
      <section className="w-full">
        <div className="relative w-full bg-muted h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">No slider images configured</p>
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
                    data-ai-hint="hero banner"
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
                    data-ai-hint="mobile banner"
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
