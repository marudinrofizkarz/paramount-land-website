import { constructMetadata } from "@/app/metadata";
import { getUnitBySlug } from "@/lib/unit-actions";
import { Metadata } from "next";

// Generate metadata for the unit detail page with dynamic og:image
export async function generateMetadata({
  params,
}: {
  params: { slug: string; unitSlug: string };
}): Promise<Metadata> {
  // Get the unit data
  const unitResponse = await getUnitBySlug(params.slug, params.unitSlug);
  
  if (!unitResponse.success || !unitResponse.unit) {
    return constructMetadata({
      title: "Unit Not Found",
      description: "The unit you are looking for does not exist or has been removed.",
      noIndex: true,
    });
  }
  
  const unit = unitResponse.unit;
  
  // Use the unit's main image for og:image if available
  const imageUrl = unit.main_image || undefined;
  
  return constructMetadata({
    title: `${unit.name} - ${unit.project_name}`,
    description: unit.description ? 
      unit.description.replace(/<[^>]*>/g, "").substring(0, 160) + "..." : 
      `${unit.name} property details at ${unit.project_name}, ${unit.location}`,
    image: imageUrl,
  });
}
