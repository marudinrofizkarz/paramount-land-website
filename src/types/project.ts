import { z } from "zod";

// Project Schema
export const projectSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  description: z.string().optional(),
  status: z.enum(["residential", "commercial"]).default("residential"),
  units: z.number().int().min(1, { message: "Number of units is required" }),
  startingPrice: z.string().min(1, { message: "Starting price is required" }),
  maxPrice: z.string().optional(),
  completion: z.number().min(0).max(100).default(0),
  mainImage: z.string().min(1, { message: "Main image is required" }),
  galleryImages: z.array(z.string()).default([]),
  brochureUrl: z.string().optional(),
  youtubeLink: z.string().optional(),
  advantages: z.array(z.string()).default([]),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

// Type for the Project with ID and timestamps
export type Project = ProjectFormValues & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

// Type for Project list items (less data for list views)
export type ProjectListItem = {
  id: string;
  name: string;
  slug: string;
  location: string;
  status: string;
  units: number;
  startingPrice: string;
  maxPrice?: string;
  completion: number;
  mainImage: string;
  createdAt: string;
  updatedAt: string;
};

// Type for pagination
export type PaginatedProjects = {
  projects: ProjectListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
