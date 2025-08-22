import { z } from "zod";

// Hero Slider Schema
export const heroSliderSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  subtitle: z.string().optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
  desktopImage: z.string().min(1, { message: "Desktop image is required" }),
  mobileImage: z.string().min(1, { message: "Mobile image is required" }),
  linkUrl: z.string().url().optional().or(z.literal("")),
  linkText: z.string().optional(),
});

export type HeroSliderFormValues = z.infer<typeof heroSliderSchema>;

// Type for the Hero Slider with ID and timestamps
export type HeroSlider = HeroSliderFormValues & {
  id: string;
  createdAt: string; // Stored as ISO string in SQLite
  updatedAt: string; // Stored as ISO string in SQLite
};
