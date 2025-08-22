"use server";

import { getOne, update } from "@/lib/database";
import {
  WebsiteSettingsFormValues,
  WebsiteSettings,
} from "@/types/website-settings";
import { revalidatePath } from "next/cache";

// Get website settings
export async function getWebsiteSettings(): Promise<{
  success: boolean;
  data?: WebsiteSettings;
  message?: string;
}> {
  try {
    const settings = await getOne(
      "SELECT * FROM WebsiteSettings WHERE id = ?",
      ["main"]
    );

    if (!settings) {
      // Return default settings if none exist
      const defaultSettings: WebsiteSettings = {
        id: "main",
        siteTitle: "Paramount Land",
        siteDescription: "Premium Property Developer",
        siteFavicon:
          "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
        copyrightText: "© 2024 Paramount Land. All rights reserved.",
        metaAuthor: "Paramount Land",
        maintenanceMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { success: true, data: defaultSettings };
    }

    // Convert boolean fields
    const formattedSettings: WebsiteSettings = {
      ...settings,
      maintenanceMode: settings.maintenanceMode === 1,
    };

    return { success: true, data: formattedSettings };
  } catch (error) {
    console.error("Error fetching website settings:", error);
    return {
      success: false,
      message: "Database Error: Failed to fetch website settings.",
    };
  }
}

// Update website settings
export async function updateWebsiteSettings(formData: FormData): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // Extract form data
    const data: Partial<WebsiteSettingsFormValues> = {
      siteTitle: formData.get("siteTitle") as string,
      siteDescription: (formData.get("siteDescription") as string) || undefined,
      siteFavicon: (formData.get("siteFavicon") as string) || undefined,
      logoLight: (formData.get("logoLight") as string) || undefined,
      logoDark: (formData.get("logoDark") as string) || undefined,
      logoFooter: (formData.get("logoFooter") as string) || undefined,
      address: (formData.get("address") as string) || undefined,
      phoneNumber: (formData.get("phoneNumber") as string) || undefined,
      whatsappNumber: (formData.get("whatsappNumber") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      facebookUrl: (formData.get("facebookUrl") as string) || undefined,
      instagramUrl: (formData.get("instagramUrl") as string) || undefined,
      twitterUrl: (formData.get("twitterUrl") as string) || undefined,
      linkedinUrl: (formData.get("linkedinUrl") as string) || undefined,
      youtubeUrl: (formData.get("youtubeUrl") as string) || undefined,
      tiktokUrl: (formData.get("tiktokUrl") as string) || undefined,
      metaKeywords: (formData.get("metaKeywords") as string) || undefined,
      metaAuthor: (formData.get("metaAuthor") as string) || undefined,
      ogImage: (formData.get("ogImage") as string) || undefined,
      copyrightText: (formData.get("copyrightText") as string) || undefined,
      footerDescription:
        (formData.get("footerDescription") as string) || undefined,
      googleAnalyticsId:
        (formData.get("googleAnalyticsId") as string) || undefined,
      googleTagManagerId:
        (formData.get("googleTagManagerId") as string) || undefined,
      facebookPixelId: (formData.get("facebookPixelId") as string) || undefined,
      businessHours: (formData.get("businessHours") as string) || undefined,
      maintenanceMode: formData.get("maintenanceMode") === "true",
      maintenanceMessage:
        (formData.get("maintenanceMessage") as string) || undefined,
    };

    // Check if settings exist
    const existingSettings = await getOne(
      "SELECT id FROM WebsiteSettings WHERE id = ?",
      ["main"]
    );

    if (existingSettings) {
      // Update existing settings
      const updateFields = Object.keys(data)
        .filter((key) => data[key as keyof typeof data] !== undefined)
        .map((key) => `${key} = ?`)
        .join(", ");

      const updateValues = Object.values(data)
        .filter((value) => value !== undefined)
        .concat([new Date().toISOString(), "main"]);

      await update(
        `UPDATE WebsiteSettings SET ${updateFields}, updatedAt = ? WHERE id = ?`,
        updateValues
      );
    } else {
      // Insert new settings
      const fields = ["id", ...Object.keys(data), "createdAt", "updatedAt"];
      const placeholders = fields.map(() => "?").join(", ");
      const values = [
        "main",
        ...Object.values(data),
        new Date().toISOString(),
        new Date().toISOString(),
      ];

      await update(
        `INSERT INTO WebsiteSettings (${fields.join(
          ", "
        )}) VALUES (${placeholders})`,
        values
      );
    }

    revalidatePath("/dashboard/website-settings");
    revalidatePath("/");

    return {
      success: true,
      message: "Website settings updated successfully!",
    };
  } catch (error) {
    console.error("Error updating website settings:", error);
    return {
      success: false,
      message: "Failed to update website settings. Please try again.",
    };
  }
}
