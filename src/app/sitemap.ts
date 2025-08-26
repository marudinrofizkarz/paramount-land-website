import { getPublicProjects } from "@/lib/project-actions";
import { getPublishedNews } from "@/lib/news-actions";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL - use absolute URL for better SEO
  const baseUrl = "https://www.rizalparamountland.com";

  // Dapatkan semua proyek publik
  const projectsResponse = await getPublicProjects();
  const projects = projectsResponse.success ? projectsResponse.data : [];

  // Dapatkan semua berita yang dipublikasikan
  const newsResponse = await getPublishedNews();
  const news = newsResponse.success ? newsResponse.data : [];

  // URL statis
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // URL proyek dinamis
  const projectUrls =
    projects?.map((project: any) => {
      const updatedDate = project.updated_at
        ? new Date(project.updated_at)
        : null;
      const createdDate = project.created_at
        ? new Date(project.created_at)
        : null;
      let lastModified = new Date();

      // Check if dates are valid
      if (updatedDate && !isNaN(updatedDate.getTime())) {
        lastModified = updatedDate;
      } else if (createdDate && !isNaN(createdDate.getTime())) {
        lastModified = createdDate;
      }

      return {
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    }) || [];

  // URL berita dinamis
  const newsUrls =
    news?.map((item: any) => {
      const updatedDate = item.updated_at ? new Date(item.updated_at) : null;
      const publishedDate = item.published_at
        ? new Date(item.published_at)
        : null;
      let lastModified = new Date();

      // Check if dates are valid
      if (updatedDate && !isNaN(updatedDate.getTime())) {
        lastModified = updatedDate;
      } else if (publishedDate && !isNaN(publishedDate.getTime())) {
        lastModified = publishedDate;
      }

      return {
        url: `${baseUrl}/news/${item.slug}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      };
    }) || [];

  // Gabungkan semua URL
  return [...staticUrls, ...projectUrls, ...newsUrls];
}
