import { getHeroSliders } from "@/lib/hero-slider-actions";
import { HeroSliderManagement } from "../../../components/hero-slider-management";

export default async function HeroSliderManagementPage() {
  // Fetch all sliders from the server
  const { data = [], success } = await getHeroSliders();

  return <HeroSliderManagement initialSliders={data} />;
}
