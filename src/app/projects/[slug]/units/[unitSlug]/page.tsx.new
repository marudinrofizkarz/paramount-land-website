import { getUnitBySlug } from "@/lib/unit-actions";
import { getPublicProjects } from "@/lib/project-actions";
import UnitDetailClient from "./client";

export default async function UnitDetailPage({
  params,
}: {
  params: { slug: string; unitSlug: string };
}) {
  // Fetch data on the server
  const unitResponse = await getUnitBySlug(params.slug, params.unitSlug);
  const projectsResponse = await getPublicProjects();
  
  // Pass the data to the client component
  return (
    <UnitDetailClient 
      unitResponse={unitResponse} 
      projectsResponse={projectsResponse}
      params={params}
    />
  );
}
