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
      description:
        "The unit you are looking for does not exist or has been removed.",
      noIndex: true,
    });
  }

  const unit = unitResponse.unit;

  // Use the unit's main image for og:image if available, or fall back to a good quality image
  const imageUrl =
    unit.main_image ||
    unit.gallery_images?.[0] ||
    "https://res.cloudinary.com/dx7xttb8a/image/upload/v1755585343/Rizal_ok36fo.jpg";

  return constructMetadata({
    title: `${unit.name} - ${unit.project_name}`,
    description: unit.description
      ? unit.description.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
      : `${unit.name} property details at ${unit.project_name}, ${unit.location}`,
    image: imageUrl,
  });
}
