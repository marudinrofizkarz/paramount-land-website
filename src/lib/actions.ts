"use server";

import { z } from "zod";
import {
  addProject as dbAddProject,
  addUnitToProject as dbAddUnitToProject,
} from "@/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters long." }),
  slug: z
    .string()
    .min(3, { message: "Project slug must be at least 3 characters long." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." }),
  location: z
    .string()
    .min(10, { message: "Location must be at least 10 characters long." }),
  startingPrice: z.string().min(1, { message: "Starting price is required." }),
  mainImage: z.string().url({ message: "Main image must be a valid URL." }),
  youtubeUrl: z
    .string()
    .url({ message: "YouTube URL must be valid." })
    .optional()
    .or(z.literal("")),
  brochureUrl: z
    .string()
    .url({ message: "Brochure URL must be valid." })
    .optional()
    .or(z.literal("")),
  locationAdvantages: z.string().optional(),
});

const UnitSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Unit name must be at least 3 characters long." }),
  slug: z
    .string()
    .min(3, { message: "Unit slug must be at least 3 characters long." }),
  type: z
    .string()
    .min(3, { message: "Unit type must be at least 3 characters long." }),
  salePrice: z.string().min(1, { message: "Sale price is required." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long." }),
  address: z
    .string()
    .min(10, { message: "Address must be at least 10 characters long." }),
  dimensions: z.string().regex(/^\d+m\s?x\s?\d+m$/i, {
    message: 'Dimensions must be in the format "10m x 20m".',
  }),
  landArea: z.string().min(1, { message: "Land area is required." }),
  buildingArea: z.string().min(1, { message: "Building area is required." }),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  carports: z.string().optional(),
  floors: z.string().optional(),
  customFloors: z.string().optional(),
  facilities: z.string().optional(),
  certification: z.string().min(1, { message: "Certification is required." }),
  mainImage: z.string().url({ message: "Main image must be a valid URL." }),
  youtubeUrl: z
    .string()
    .url({ message: "YouTube URL must be valid." })
    .optional()
    .or(z.literal("")),
  brochureUrl: z
    .string()
    .url({ message: "Brochure URL must be valid." })
    .optional()
    .or(z.literal("")),
});

export async function createProject(prevState: any, formData: FormData) {
  // Collect gallery images
  const galleryImages: string[] = [];
  for (let i = 0; i < 10; i++) {
    // Support up to 10 gallery images
    const galleryImage = formData.get(`galleryImage${i}`);
    if (
      galleryImage &&
      typeof galleryImage === "string" &&
      galleryImage.trim()
    ) {
      galleryImages.push(galleryImage.trim());
    }
  }

  const validatedFields = ProjectSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    location: formData.get("location"),
    startingPrice: formData.get("startingPrice"),
    mainImage: formData.get("mainImage"),
    youtubeUrl: formData.get("youtubeUrl") || "",
    brochureUrl: formData.get("brochureUrl") || "",
    locationAdvantages: formData.get("locationAdvantages") || "",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Prepare project data with additional fields
    const projectData = {
      ...validatedFields.data,
      imageUrl: validatedFields.data.mainImage, // Use mainImage as imageUrl for compatibility
      galleryImages,
    };
    await dbAddProject(projectData);
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Project.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function createUnit(
  projectSlug: string,
  prevState: any,
  formData: FormData
) {
  // Collect gallery images
  const galleryImages: string[] = [];
  for (let i = 0; i < 10; i++) {
    const galleryImage = formData.get(`galleryImage${i}`);
    if (
      galleryImage &&
      typeof galleryImage === "string" &&
      galleryImage.trim()
    ) {
      galleryImages.push(galleryImage.trim());
    }
  }

  // Handle custom floors
  const floors = formData.get("floors");
  const customFloors = formData.get("customFloors");
  const finalFloors = floors === "custom" ? customFloors : floors;

  const validatedFields = UnitSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    type: formData.get("type"),
    salePrice: formData.get("salePrice"),
    description: formData.get("description"),
    address: formData.get("address"),
    dimensions: formData.get("dimensions"),
    landArea: formData.get("landArea"),
    buildingArea: formData.get("buildingArea"),
    bedrooms: formData.get("bedrooms") || "",
    bathrooms: formData.get("bathrooms") || "",
    carports: formData.get("carports") || "",
    floors: finalFloors || "",
    facilities: formData.get("facilities") || "",
    certification: formData.get("certification"),
    mainImage: formData.get("mainImage"),
    youtubeUrl: formData.get("youtubeUrl") || "",
    brochureUrl: formData.get("brochureUrl") || "",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Prepare unit data with additional fields
    const unitData = {
      ...validatedFields.data,
      galleryImages,
    };
    await dbAddUnitToProject(projectSlug, unitData);
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Unit.",
    };
  }

  revalidatePath(`/dashboard/projects/${projectSlug}/units`);
  // Return a success state to clear the form
  return { success: true };
}
