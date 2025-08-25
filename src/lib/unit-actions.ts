"use server";

import { z } from "zod";
import db, { query } from "@/lib/database";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

// Type definitions for FormData and File handling
type FormDataValue = string | File | null;

// Define the structure of a query result from Turso DB
interface QueryResult {
  lastID?: number;
  changes?: number;
  rows?: any[];
}

// Define the structure of Cloudinary upload result
interface CloudinaryResult {
  success: boolean;
  url: string | null;
  publicId?: string;
  error?: unknown;
}

// Create Unit Schema for validation - must be wrapped in a function for "use server" compatibility
export async function getUnitSchema() {
  return z.object({
    name: z
      .string()
      .min(3, { message: "Unit name must be at least 3 characters long." }),
    slug: z
      .string()
      .min(3, { message: "Unit slug must be at least 3 characters long." }),
    projectId: z.string().min(1, { message: "Project ID is required." }),
    description: z
      .string()
      .min(10, { message: "Description must be at least 10 characters long." }),
    dimensions: z.string().min(3, { message: "Dimensions are required." }),
    landArea: z.string().min(1, { message: "Land area is required." }),
    buildingArea: z.string().min(1, { message: "Building area is required." }),
    salePrice: z.string().min(1, { message: "Sale price is required." }),
    bedrooms: z.string().optional(),
    bathrooms: z.string().optional(),
    carports: z.string().optional(),
    floors: z.string().optional(),
    certification: z.string().min(1, { message: "Certification is required." }),
    facilities: z.string().optional(),
    mainImage: z.string().url({ message: "Main image must be a valid URL." }),
    galleryImages: z.array(z.string().url()).optional(),
    status: z.enum(["active", "draft", "sold"]).default("active"),
    promo: z.string().optional(),
  });
}

// Helper function to convert file to base64 for Cloudinary upload
async function fileToBase64(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

// Create a new unit
export async function createUnit(
  formData: FormData
): Promise<{ success: boolean; id?: number; error?: string }> {
  try {
    // Extract data from form
    const name = formData.get("name") as string;
    const projectId = formData.get("projectId") as string;
    const slug = slugify(name);
    const description = formData.get("description") as string;
    const dimensions = formData.get("dimensions") as string;
    const landArea = formData.get("landArea") as string;
    const buildingArea = formData.get("buildingArea") as string;
    const salePrice = formData.get("salePrice") as string;
    const bedrooms = (formData.get("bedrooms") as string) || null;
    const bathrooms = (formData.get("bathrooms") as string) || null;
    const carports = (formData.get("carports") as string) || null;
    const floors = (formData.get("floors") as string) || null;
    const certification = formData.get("certification") as string;
    const facilities = (formData.get("facilities") as string) || null;
    const status = (formData.get("status") as string) || "active";
    const promo = (formData.get("promo") as string) || null;

    // Handle main image upload
    const mainImageFile = formData.get("mainImage");
    let mainImageUrl = "";

    if (mainImageFile && mainImageFile instanceof File) {
      const base64Image = await fileToBase64(mainImageFile);
      const uploadResult = (await uploadToCloudinary(
        base64Image,
        "units"
      )) as CloudinaryResult;

      if (uploadResult.success && uploadResult.url) {
        mainImageUrl = uploadResult.url;
      } else {
        throw new Error("Failed to upload main image");
      }
    } else if (
      typeof mainImageFile === "string" &&
      mainImageFile.startsWith("data:")
    ) {
      // Handle base64 string
      const uploadResult = (await uploadToCloudinary(
        mainImageFile,
        "units"
      )) as CloudinaryResult;

      if (uploadResult.success && uploadResult.url) {
        mainImageUrl = uploadResult.url;
      } else {
        throw new Error("Failed to upload main image");
      }
    }

    // Handle gallery images
    const galleryImages: string[] = [];
    for (let i = 0; i < 10; i++) {
      const galleryImage = formData.get(`galleryImage${i}`);

      if (galleryImage) {
        if (galleryImage instanceof File) {
          const base64Image = await fileToBase64(galleryImage);
          const uploadResult = (await uploadToCloudinary(
            base64Image,
            "units"
          )) as CloudinaryResult;

          if (uploadResult.success && uploadResult.url) {
            galleryImages.push(uploadResult.url);
          }
        } else if (
          typeof galleryImage === "string" &&
          galleryImage.startsWith("data:")
        ) {
          const uploadResult = (await uploadToCloudinary(
            galleryImage,
            "units"
          )) as CloudinaryResult;

          if (uploadResult.success && uploadResult.url) {
            galleryImages.push(uploadResult.url);
          }
        } else if (
          typeof galleryImage === "string" &&
          galleryImage.startsWith("http")
        ) {
          galleryImages.push(galleryImage);
        }
      }
    }

    // Create unit in database
    let result: QueryResult;

    // Check if promo column exists in units table before attempting insertion
    try {
      const columnCheck = await query(
        `SELECT COUNT(*) as count FROM pragma_table_info('units') WHERE name = 'promo'`
      );

      const columnRows = columnCheck.rows || [];
      const hasPromoColumn =
        columnRows.length > 0 &&
        columnRows[0].count !== undefined &&
        Number(columnRows[0].count) > 0;

      if (hasPromoColumn) {
        // If promo column exists, include it in the query
        result = (await query(
          `
          INSERT INTO units (
            name, slug, project_id, description, dimensions, 
            land_area, building_area, sale_price, bedrooms, 
            bathrooms, carports, floors, certification, 
            facilities, main_image, gallery_images, status, 
            promo, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            datetime('now'), datetime('now')
          )
        `,
          [
            name,
            slug,
            projectId,
            description,
            dimensions,
            landArea,
            buildingArea,
            salePrice,
            bedrooms,
            bathrooms,
            carports,
            floors,
            certification,
            facilities,
            mainImageUrl,
            JSON.stringify(galleryImages),
            status,
            promo,
          ]
        )) as QueryResult;
      } else {
        console.log(
          "Promo column does not exist in units table. Creating unit without promo."
        );
        // If promo column doesn't exist, exclude it from the query
        result = (await query(
          `
          INSERT INTO units (
            name, slug, project_id, description, dimensions, 
            land_area, building_area, sale_price, bedrooms, 
            bathrooms, carports, floors, certification, 
            facilities, main_image, gallery_images, status, 
            created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
            datetime('now'), datetime('now')
          )
        `,
          [
            name,
            slug,
            projectId,
            description,
            dimensions,
            landArea,
            buildingArea,
            salePrice,
            bedrooms,
            bathrooms,
            carports,
            floors,
            certification,
            facilities,
            mainImageUrl,
            JSON.stringify(galleryImages),
            status,
          ]
        )) as QueryResult;
      }
    } catch (columnError) {
      console.error("Error checking promo column:", columnError);
      // Fallback to original insert without promo
      result = (await query(
        `
        INSERT INTO units (
          name, slug, project_id, description, dimensions, 
          land_area, building_area, sale_price, bedrooms, 
          bathrooms, carports, floors, certification, 
          facilities, main_image, gallery_images, status, 
          created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
          datetime('now'), datetime('now')
        )
      `,
        [
          name,
          slug,
          projectId,
          description,
          dimensions,
          landArea,
          buildingArea,
          salePrice,
          bedrooms,
          bathrooms,
          carports,
          floors,
          certification,
          facilities,
          mainImageUrl,
          JSON.stringify(galleryImages),
          status,
        ]
      )) as QueryResult;
    }

    if (result.lastID) {
      return { success: true, id: result.lastID };
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating unit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create unit",
    };
  }
}

// Get units by project ID
export async function getUnitsByProjectId(
  projectId: string
): Promise<{ success: boolean; units?: any[]; error?: string }> {
  try {
    const units = (await query(
      `
      SELECT * FROM units
      WHERE project_id = ?
      ORDER BY created_at DESC
    `,
      [projectId]
    )) as QueryResult;

    // Import the serializeData function
    const { serializeData } = await import("@/lib/database");

    // Serialize the data to ensure we're only passing plain objects
    const serializedUnits = units.rows ? serializeData(units.rows) : [];

    return { success: true, units: serializedUnits };
  } catch (error) {
    console.error("Error fetching units:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch units",
    };
  }
}

// Get units with pagination
export async function getUnitsByProjectIdPaginated(
  projectId: string,
  page: number = 1,
  limit: number = 10,
  statusFilter: string = ""
): Promise<{
  success: boolean;
  units?: any[];
  totalUnits?: number;
  totalPages?: number;
  currentPage?: number;
  error?: string;
}> {
  try {
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the SQL query based on whether a status filter is provided
    let countQuery = "SELECT COUNT(*) as count FROM units WHERE project_id = ?";
    let unitsQuery = `
      SELECT * FROM units
      WHERE project_id = ?
    `;

    let params = [projectId];

    if (statusFilter && statusFilter !== "all") {
      countQuery += " AND status = ?";
      unitsQuery += " AND status = ?";
      params.push(statusFilter);
    }

    unitsQuery += " ORDER BY created_at DESC LIMIT ? OFFSET ?";

    // Get total count for pagination
    const countResult = (await query(countQuery, params)) as QueryResult;
    const totalUnits =
      countResult.rows && countResult.rows[0].count
        ? Number(countResult.rows[0].count)
        : 0;

    // Add pagination parameters
    const paginationParams = [...params, limit, offset];

    // Fetch units with pagination
    const units = (await query(unitsQuery, paginationParams)) as QueryResult;

    // Import the serializeData function
    const { serializeData } = await import("@/lib/database");

    // Serialize the data to ensure we're only passing plain objects
    const serializedUnits = units.rows ? serializeData(units.rows) : [];

    // Calculate total pages
    const totalPages = Math.ceil(totalUnits / limit);

    return {
      success: true,
      units: serializedUnits,
      totalUnits,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching units with pagination:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch units",
    };
  }
}

// Get unit by slug
export async function getUnitBySlug(
  projectSlug: string,
  unitSlug: string
): Promise<{ success: boolean; unit?: any; error?: string }> {
  try {
    console.log(
      `Fetching unit with slug: ${unitSlug} in project: ${projectSlug}`
    );

    // First check if the project exists
    const project = (await query(
      `SELECT id FROM Project WHERE slug = ? LIMIT 1`,
      [projectSlug]
    )) as QueryResult;

    if (!project.rows || project.rows.length === 0) {
      console.log(`Project with slug ${projectSlug} not found`);
      return { success: false, error: "Project not found" };
    }

    const projectId = project.rows[0].id;
    console.log(`Found project with ID: ${projectId}`);

    // Now get the unit by slug and project ID
    console.log(
      `Querying unit with slug: ${unitSlug} and project ID: ${projectId}`
    );
    const unit = (await query(
      `
      SELECT u.*, p.name as project_name, p.slug as project_slug, p.location, p.status as project_status
      FROM units u
      JOIN Project p ON u.project_id = p.id
      WHERE u.slug = ? AND p.id = ?
      LIMIT 1
      `,
      [unitSlug, projectId]
    )) as QueryResult;

    console.log(
      `Query for unit returned ${unit.rows ? unit.rows.length : 0} results`
    );

    if (!unit.rows || unit.rows.length === 0) {
      // Try to get any unit with this slug to check if project mismatch
      const anyUnitWithSlug = (await query(
        `SELECT id, project_id, slug FROM units WHERE slug = ? LIMIT 1`,
        [unitSlug]
      )) as QueryResult;

      if (anyUnitWithSlug.rows && anyUnitWithSlug.rows.length > 0) {
        console.log(
          `Found unit with slug ${unitSlug} but in different project: ${anyUnitWithSlug.rows[0].project_id}`
        );
        return {
          success: false,
          error: `Unit found but in different project (${anyUnitWithSlug.rows[0].project_id} vs ${projectId})`,
        };
      }

      // Try to get any unit for this project to check if slug mismatch
      const anyUnitInProject = (await query(
        `SELECT id, slug FROM units WHERE project_id = ? LIMIT 5`,
        [projectId]
      )) as QueryResult;

      if (anyUnitInProject.rows && anyUnitInProject.rows.length > 0) {
        console.log(
          `Found units in project ${projectId} with slugs:`,
          anyUnitInProject.rows.map((u) => u.slug).join(", ")
        );
      }

      console.log(`No unit found with slug: ${unitSlug}`);
      return { success: false, error: "Unit not found" };
    }

    // Parse JSON fields
    const unitData = unit.rows[0];
    if (unitData.gallery_images) {
      try {
        unitData.gallery_images = JSON.parse(unitData.gallery_images);
      } catch (e) {
        unitData.gallery_images = [];
      }
    }

    if (unitData.facilities) {
      try {
        unitData.facilities = JSON.parse(unitData.facilities);
      } catch (e) {
        unitData.facilities = [];
      }
    }

    // Import the serializeData function
    const { serializeData } = await import("@/lib/database");

    // Serialize the data to ensure we're only passing plain objects
    const serializedUnit = serializeData(unitData);

    return { success: true, unit: serializedUnit };
  } catch (error) {
    console.error("Error fetching unit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch unit",
    };
  }
}

// Update unit
export async function updateUnit(
  unitId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Updating unit with ID: ${unitId}`);

    // Extract data from form
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const dimensions = formData.get("dimensions") as string;
    const landArea = formData.get("landArea") as string;
    const buildingArea = formData.get("buildingArea") as string;
    const salePrice = formData.get("salePrice") as string;
    const bedrooms = (formData.get("bedrooms") as string) || null;
    const bathrooms = (formData.get("bathrooms") as string) || null;
    const carports = (formData.get("carports") as string) || null;
    const floors = (formData.get("floors") as string) || null;
    const certification = formData.get("certification") as string;
    const facilities = (formData.get("facilities") as string) || null;
    const status = (formData.get("status") as string) || "active";
    const promo = (formData.get("promo") as string) || null;

    // Generate a slug from the name (in case the name was changed)
    const slug = slugify(name);

    // Handle main image upload if a new one is provided
    const mainImageFile = formData.get("mainImage");
    let mainImageUrl = formData.get("currentMainImage") as string;

    console.log("Main image handling:", {
      hasNewImage: !!mainImageFile,
      hasExistingImage: !!mainImageUrl,
      imageType: mainImageFile ? typeof mainImageFile : "none",
    });

    if (mainImageFile && mainImageFile instanceof File) {
      const base64Image = await fileToBase64(mainImageFile);
      const uploadResult = (await uploadToCloudinary(
        base64Image,
        "units"
      )) as CloudinaryResult;

      if (uploadResult.success && uploadResult.url) {
        mainImageUrl = uploadResult.url;
      }
    } else if (
      typeof mainImageFile === "string" &&
      mainImageFile.startsWith("data:")
    ) {
      const uploadResult = (await uploadToCloudinary(
        mainImageFile,
        "units"
      )) as CloudinaryResult;

      if (uploadResult.success && uploadResult.url) {
        mainImageUrl = uploadResult.url;
      }
    }

    // Handle gallery images
    const galleryImages: string[] = [];
    const currentGalleryImages = formData.get("currentGalleryImages") as
      | string
      | null;

    console.log("Gallery images handling:", {
      hasCurrentImages: !!currentGalleryImages,
    });

    if (currentGalleryImages) {
      try {
        const parsedImages = JSON.parse(currentGalleryImages);
        if (Array.isArray(parsedImages)) {
          console.log(`Adding ${parsedImages.length} existing gallery images`);
          galleryImages.push(...parsedImages);
        }
      } catch (e) {
        console.error("Error parsing current gallery images:", e);
      }
    }

    // Look for new gallery images (data URLs)
    for (let i = 0; i < 20; i++) {
      const galleryImage = formData.get(`galleryImage${i}`);

      if (galleryImage) {
        console.log(
          `Processing galleryImage${i}, type: ${typeof galleryImage}`
        );

        if (galleryImage instanceof File) {
          const base64Image = await fileToBase64(galleryImage);
          const uploadResult = (await uploadToCloudinary(
            base64Image,
            "units"
          )) as CloudinaryResult;

          if (uploadResult.success && uploadResult.url) {
            console.log(`Added new gallery image from File: ${i}`);
            galleryImages.push(uploadResult.url);
          }
        } else if (
          typeof galleryImage === "string" &&
          galleryImage.startsWith("data:")
        ) {
          const uploadResult = (await uploadToCloudinary(
            galleryImage,
            "units"
          )) as CloudinaryResult;

          if (uploadResult.success && uploadResult.url) {
            console.log(`Added new gallery image from data URL: ${i}`);
            galleryImages.push(uploadResult.url);
          }
        } else if (typeof galleryImage === "string") {
          // This is an existing URL that should be preserved
          console.log(`Preserving existing gallery image URL: ${i}`);
          galleryImages.push(galleryImage);
        }
      }
    }

    console.log(`Total gallery images to save: ${galleryImages.length}`);

    // Update unit in database
    await query(
      `
      UPDATE units SET
        name = ?, slug = ?, description = ?, dimensions = ?, 
        land_area = ?, building_area = ?, sale_price = ?, 
        bedrooms = ?, bathrooms = ?, carports = ?, 
        floors = ?, certification = ?, facilities = ?, 
        main_image = ?, gallery_images = ?, status = ?, 
        promo = ?, updated_at = datetime('now')
      WHERE id = ?
    `,
      [
        name,
        slug,
        description,
        dimensions,
        landArea,
        buildingArea,
        salePrice,
        bedrooms,
        bathrooms,
        carports,
        floors,
        certification,
        facilities,
        mainImageUrl,
        JSON.stringify(galleryImages),
        status,
        promo,
        unitId,
      ]
    );

    // Revalidate relevant pages to update the website
    const projectId = formData.get("projectId") as string;
    const projectSlug = formData.get("projectSlug") as string;

    if (projectId && projectSlug) {
      // Revalidate dashboard pages
      revalidatePath(`/dashboard/projects/${projectSlug}/units`);
      revalidatePath(`/dashboard/projects/${projectSlug}/units/${slug}`);

      // Revalidate public website pages
      revalidatePath(`/projects/${projectSlug}`);
      revalidatePath(`/projects/${projectSlug}/units/${slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating unit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update unit",
    };
  }
}

// Delete unit
export async function deleteUnit(
  unitId: string,
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await query(
      `
      DELETE FROM units
      WHERE id = ?
    `,
      [unitId]
    );

    // Revalidate the project units page
    revalidatePath(`/dashboard/projects/${projectId}/units`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting unit:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete unit",
    };
  }
}
