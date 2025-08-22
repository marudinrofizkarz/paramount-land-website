'use client';

import { HeroSlider as DynamicHeroSlider } from "@/components/dynamic-hero-slider";
import { getPublicHeroSliders } from "@/lib/hero-slider-actions";
import { HeroSlider as HeroSliderType } from "@/types/hero-slider";
import { useEffect, useState } from "react";
import { HeroSlider } from "@/components/hero-slider";

export function HeroSliderSection() {
  const [sliders, setSliders] = useState<HeroSliderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSliders() {
      try {
        setLoading(true);
        const response = await getPublicHeroSliders();
        
        if (response.success && response.data) {
          const slidersData = response.data as unknown as HeroSliderType[];
          setSliders(slidersData);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching hero sliders:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSliders();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section className="w-full">
        <div className="relative w-full bg-muted h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading slider...</p>
        </div>
      </section>
    );
  }

  // If error or no sliders, fall back to static component
  if (error || sliders.length === 0) {
    return <HeroSlider />;
  }

  return <DynamicHeroSlider sliders={sliders} />;
}
