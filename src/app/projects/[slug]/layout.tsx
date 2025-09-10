import { Metadata, ResolvingMetadata } from "next";
import { getProjectBySlug } from "@/lib/project-actions";

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch project data
  const { slug } = await params;
  const projectResponse = await getProjectBySlug(slug);
  const project = projectResponse.success ? projectResponse.data : null;

  // Use project info in the metadata if available
  if (project) {
    return {
      title: `${project.name} | Paramount Land - Building Homes and People with Heart`,
      description:
        project.description ||
        `Details about ${project.name} - a Paramount Land development project including units, amenities, location, and pricing.`,
      openGraph: project.featured_image
        ? {
            images: [project.featured_image],
          }
        : undefined,
    };
  }

  // Fallback metadata
  return {
    title:
      "Project Details | Paramount Land - Building Homes and People with Heart",
    description:
      "Detailed information about a Paramount Land project including units, amenities, location, and pricing.",
  };
}

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
