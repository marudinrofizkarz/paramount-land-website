import { z } from "zod";

// Website Settings Schema
export const websiteSettingsSchema = z.object({
  // Site Identity
  siteTitle: z.string().min(1, { message: "Site title is required" }),
  siteDescription: z.string().optional(),
  siteFavicon: z.string().optional(),
  
  // Logo Settings
  logoLight: z.string().optional(),
  logoDark: z.string().optional(),
  logoFooter: z.string().optional(),
  
  // Contact Information
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  whatsappNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  
  // Social Media Links
  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  tiktokUrl: z.string().url().optional().or(z.literal("")),
  
  // SEO Settings
  metaKeywords: z.string().optional(),
  metaAuthor: z.string().optional(),
  ogImage: z.string().optional(),
  
  // Footer Settings
  copyrightText: z.string().optional(),
  footerDescription: z.string().optional(),
  
  // Additional Settings
  googleAnalyticsId: z.string().optional(),
  googleTagManagerId: z.string().optional(),
  facebookPixelId: z.string().optional(),
  
  // Business Hours (JSON string)
  businessHours: z.string().optional(),
  
  // Maintenance Mode
  maintenanceMode: z.boolean().default(false),
  maintenanceMessage: z.string().optional(),
});

export type WebsiteSettingsFormValues = z.infer<typeof websiteSettingsSchema>;

// Type for the Website Settings with timestamps
export type WebsiteSettings = WebsiteSettingsFormValues & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

// Business Hours Type
export type BusinessHours = {
  [key: string]: {
    open: string;
    close: string;
    closed: boolean;
  };
};