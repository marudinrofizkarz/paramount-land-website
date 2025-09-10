import { getUnitBySlug } from "@/lib/unit-actions";
import { getPublicProjects } from "@/lib/project-actions";
import UnitDetailClient from "./client";
import { Metadata } from "next";
import { constructMetadata } from "@/app/metadata";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; unitSlug: string };
}): Promise<Metadata> {
  // Get the unit data
  const { slug, unitSlug } = await params;
  const unitResponse = await getUnitBySlug(slug, unitSlug);
  const unit = unitResponse.success ? unitResponse.unit : null;

  // Set image URL for sharing
  const imageUrl =
    unit?.main_image ||
    (unit?.gallery_images && unit.gallery_images.length > 0
      ? unit.gallery_images[0]
      : null) ||
    "https://res.cloudinary.com/dwqiuq8cq/image/upload/v1755585343/Rizal_ok36fo.jpg";

  return constructMetadata({
    title: unit
      ? `${unit.name} - ${unit.project_name} | Paramount Land`
      : "Unit Detail",
    description: unit?.description
      ? unit.description.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
      : "Property unit details and specifications",
    image: imageUrl,
    canonical: `https://www.rizalparamountland.com/projects/${slug}/units/${unitSlug}`,
  });
}

export default async function UnitDetailPage({
  params,
}: {
  params: { slug: string; unitSlug: string };
}) {
  // Fetch data on the server
  const { slug, unitSlug } = await params;
  const unitResponse = await getUnitBySlug(slug, unitSlug);
  const projectsResponse = await getPublicProjects();

  // Pass the data to the client component
  return (
    <UnitDetailClient
      unitResponse={unitResponse}
      projectsResponse={projectsResponse}
      params={{ slug, unitSlug }}
    />
  );
}
