import { getPublicHeroSliders } from "@/lib/hero-slider-actions";
import { HeroSlider } from "@/components/dynamic-hero-slider";
import { HeroSlider as StaticHeroSlider } from "@/components/hero-slider";

/**
 * Server-side Hero Slider Component untuk loading optimal
 * Data di-fetch di server sehingga tidak ada delay di client
 */
export async function ServerHeroSlider() {
  try {
    const response = await getPublicHeroSliders();

    if (response.success && response.data && response.data.length > 0) {
      return <HeroSlider sliders={response.data} />;
    }

    // Fallback ke static slider jika tidak ada data
    return <StaticHeroSlider />;
  } catch (error) {
    console.error("Error loading hero sliders:", error);
    // Fallback ke static slider jika error
    return <StaticHeroSlider />;
  }
}
