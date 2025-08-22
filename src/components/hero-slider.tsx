
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

const sliderImages = [
    {
        desktop: 'https://primaland.id/storage/assets/puriasthagina/2023/banner1-desktop.webp',
        mobile: 'https://primaland.id/storage/assets/puriasthagina/2023/banner1-mobile.webp',
        alt: 'Modern house in a beautiful landscape'
    },
    {
        desktop: 'https://primaland.id/storage/assets/puriasthagina/2023/banner-sec3-desktop.webp',
        mobile: 'https://primaland.id/storage/assets/puriasthagina/2023/banner-sec3-mobile.webp',
        alt: 'Elegant living room interior'
    }
];

export function HeroSlider() {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

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
          {sliderImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full">
                {/* Desktop Image */}
                <div className="hidden md:block">
                  <Image
                    src={image.desktop}
                    alt={image.alt}
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
                    src={image.mobile}
                    alt={image.alt}
                    width={768}
                    height={1024}
                    className="w-full h-auto object-cover"
                    priority={index === 0}
                    data-ai-hint="mobile banner"
                  />
                </div>
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
