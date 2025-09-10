"use server";

import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import db, { query, getMany, getOne } from "@/lib/database";
import { Project, ProjectListItem, PaginatedProjects } from "@/types/project";
import { uploadToCloudinary } from "@/lib/cloudinary";

// Helper function to convert File to base64 string for Cloudinary upload
async function fileToBase64(file: File): Promise<string> {
  try {
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();
    // Convert to Buffer
    const buffer = Buffer.from(arrayBuffer);
    // Create base64 string with content type prefix
    return `data:${file.type};base64,${buffer.toString("base64")}`;
  } catch (error) {
    console.error("Error converting file to base64:", error);
    throw new Error("Failed to process file upload");
  }
}

// Safe JSON parse with fallback
function safeJsonParse(
  jsonString: string | null | undefined,
  fallback: any = null
): any {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
}

// Create a new project
export async function createProject(formData: FormData) {
  try {
    console.log("Starting project creation...");

    const id = uuidv4();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const location = formData.get("location") as string;
    const description = (formData.get("description") as string) || null;
    const status = (formData.get("status") as string) || "residential";
    const units = parseInt(formData.get("units") as string);
    const startingPrice = formData.get("startingPrice") as string;
    const maxPrice = (formData.get("maxPrice") as string) || null;
    const completion = parseInt((formData.get("completion") as string) || "0");

    // Handle image uploads
    let mainImage = "";
    const mainImageFile = formData.get("mainImage") as File;

    console.log("Processing main image...");
    if (mainImageFile && mainImageFile.size > 0) {
      try {
        const base64Image = await fileToBase64(mainImageFile);
        console.log(
          "Main image converted to base64, uploading to Cloudinary..."
        );
        const uploadResult = await uploadToCloudinary(base64Image, "projects");
        if (uploadResult.success) {
          mainImage = uploadResult.url as string;
          console.log("Main image uploaded successfully:", mainImage);
        } else {
          console.error("Failed to upload main image:", uploadResult.error);
          throw new Error("Failed to upload main image");
        }
      } catch (error) {
        console.error("Error processing main image:", error);
        throw new Error("Error processing main image");
      }
    } else {
      console.log("No main image provided or invalid file");
      throw new Error("Main image is required");
    }

    // Handle gallery images
    const galleryImages: string[] = [];
    const galleryImagesData = formData.getAll("galleryImages");

    console.log(`Processing ${galleryImagesData.length} gallery images...`);

    if (galleryImagesData.length > 0) {
      for (const image of galleryImagesData) {
        if (image instanceof File && image.size > 0) {
          try {
            const base64Image = await fileToBase64(image);
            console.log(
              `Gallery image ${image.name} converted to base64, uploading...`
            );
            const uploadResult = await uploadToCloudinary(
              base64Image,
              "projects/gallery"
            );
            if (uploadResult.success) {
              galleryImages.push(uploadResult.url as string);
              console.log(`Gallery image uploaded: ${uploadResult.url}`);
            } else {
              console.error(
                `Failed to upload gallery image ${image.name}:`,
                uploadResult.error
              );
            }
          } catch (error) {
            console.error(
              `Error processing gallery image ${image.name}:`,
              error
            );
            // Continue with other images even if one fails
          }
        }
      }
    }

    console.log(`Completed gallery images: ${galleryImages.length} uploaded`);

    // Get brochure URL directly from form
    const brochureUrl = (formData.get("brochureUrl") as string) || null;
    console.log("Brochure URL:", brochureUrl);

    const youtubeLink = (formData.get("youtubeLink") as string) || null;

    // Handle advantages
    const advantagesData = formData.getAll("advantages");
    const advantages = advantagesData
      .map((item) => item.toString())
      .filter((item) => item.trim() !== "");

    console.log(`Processing ${advantages.length} advantages`);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Create project in database
    console.log("Inserting project into database...");
    try {
      await query(
        `
        INSERT INTO Project (
          id, name, slug, location, description, status, units, 
          startingPrice, maxPrice, completion, mainImage, 
          galleryImages, brochureUrl, youtubeLink, advantages,
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          id,
          name,
          slug,
          location,
          description,
          status,
          units,
          startingPrice,
          maxPrice,
          completion,
          mainImage,
          JSON.stringify(galleryImages),
          brochureUrl,
          youtubeLink,
          JSON.stringify(advantages),
          createdAt,
          updatedAt,
        ]
      );
      console.log("Project inserted successfully with ID:", id);
    } catch (error) {
      console.error("Database insert error:", error);
      throw new Error("Failed to save project to database");
    }

    // Get the inserted record
    const project = await getOne("SELECT * FROM Project WHERE id = ?", [id]);

    if (!project) {
      console.error("Failed to retrieve newly created project");
      throw new Error("Project was created but could not be retrieved");
    }

    // Ensure proper serialization - Create a clean object and parse JSON fields
    const formattedProject = { ...project };
    formattedProject.galleryImages = safeJsonParse(project.galleryImages, []);
    formattedProject.advantages = safeJsonParse(project.advantages, []);

    console.log("Project creation completed successfully");
    revalidatePath("/dashboard/projects");

    return { success: true, data: formattedProject };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Database Error: Failed to Create Project.",
    };
  }
}

// Get all projects with pagination
export async function getProjects(page = 1, limit = 10) {
  try {
    // Count total projects
    const countResult = await getOne("SELECT COUNT(*) as count FROM Project");
    const total = countResult?.count ? Number(countResult.count) : 0;

    // Calculate pagination
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Get projects for the current page
    const projects = await getMany(
      `
      SELECT id, name, slug, location, status, units, startingPrice, 
      maxPrice, completion, mainImage, createdAt, updatedAt 
      FROM Project ORDER BY createdAt DESC LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );

    // Process projects manually to ensure proper data format
    const processedProjects = projects.map((project) => {
      // Create a fresh object with all properties
      const cleanProject = { ...project };

      // Return the processed project
      return cleanProject;
    });

    const response: PaginatedProjects = {
      projects: processedProjects as unknown as ProjectListItem[],
      total,
      page,
      limit,
      totalPages,
    };

    return { success: true, data: response };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      success: false,
      message: "Database Error: Failed to Fetch Projects.",
    };
  }
}

// Get a single project by ID
export async function getProjectById(id: string) {
  try {
    // Get raw data directly
    const result = await query("SELECT * FROM Project WHERE id = ?", [id]);

    if (!result.rows || result.rows.length === 0) {
      return {
        success: false,
        message: "Project not found.",
      };
    }

    // Get the first row as our project
    const rawProject = result.rows[0];

    if (!rawProject) {
      return {
        success: false,
        message: "Project not found.",
      };
    }

    // Create a clean object with proper typing
    const cleanProject: Record<string, any> = {};

    // Copy all properties manually to avoid serialization issues
    Object.keys(rawProject).forEach((key) => {
      cleanProject[key] = rawProject[key];
    });

    // Process JSON fields separately and safely
    cleanProject.galleryImages = safeJsonParse(rawProject.galleryImages, []);
    cleanProject.advantages = safeJsonParse(rawProject.advantages, []);

    return { success: true, data: cleanProject };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      success: false,
      message: "Database Error: Failed to Fetch Project.",
    };
  }
}

// Get a single project by slug
export async function getProjectBySlug(slug: string) {
  try {
    console.log("getProjectBySlug called with slug:", slug);

    if (!slug || typeof slug !== "string") {
      console.error("Invalid slug provided:", slug);
      return {
        success: false,
        message: "Invalid slug parameter.",
      };
    }

    // Get raw data directly without using serializeData initially
    const result = await query("SELECT * FROM Project WHERE slug = ?", [slug]);

    if (!result || !result.rows || result.rows.length === 0) {
      console.log("No project found with slug:", slug);
      return {
        success: false,
        message: "Project not found.",
      };
    }

    // Get the first row as our project
    const rawProject = result.rows[0];
    console.log("Raw project data found:", rawProject ? "yes" : "no");

    if (!rawProject) {
      console.log("Project is null or undefined");
      return {
        success: false,
        message: "Project not found.",
      };
    }

    // Create a clean object with proper typing
    const cleanProject: Record<string, any> = {};

    // Copy all properties manually to avoid serialization issues
    Object.keys(rawProject).forEach((key) => {
      cleanProject[key] = rawProject[key];
    });

    // Process JSON fields separately and safely
    cleanProject.galleryImages = safeJsonParse(rawProject.galleryImages, []);
    cleanProject.advantages = safeJsonParse(rawProject.advantages, []);

    console.log("Project data processed successfully");

    return {
      success: true,
      data: cleanProject,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return {
      success: false,
      message: "Database Error: Failed to Fetch Project.",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Update a project
export async function updateProject(id: string, formData: FormData) {
  try {
    // Get existing project
    const existingProjectResponse = await getProjectById(id);

    if (!existingProjectResponse.success || !existingProjectResponse.data) {
      return {
        success: false,
        message: "Project not found.",
      };
    }

    const existingProject = existingProjectResponse.data;

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const location = formData.get("location") as string;
    const description = (formData.get("description") as string) || null;
    const status = (formData.get("status") as string) || "residential";
    const units = parseInt(formData.get("units") as string);
    const startingPrice = formData.get("startingPrice") as string;
    const maxPrice = (formData.get("maxPrice") as string) || null;
    const completion = parseInt((formData.get("completion") as string) || "0");

    // Handle main image
    let mainImage = existingProject.mainImage;
    const mainImageFile = formData.get("mainImage") as File;
    if (mainImageFile && mainImageFile.size > 0) {
      const base64Image = await fileToBase64(mainImageFile);
      const uploadResult = await uploadToCloudinary(base64Image);
      if (uploadResult.success) {
        mainImage = uploadResult.url as string;
      }
    }

    // Handle gallery images (need to check which ones to keep)
    let galleryImages = Array.isArray(existingProject.galleryImages)
      ? existingProject.galleryImages
      : safeJsonParse(existingProject.galleryImages, []);

    const keepImages = formData
      .getAll("keepGalleryImages")
      .map((i) => i.toString());
    if (keepImages.length > 0) {
      galleryImages = galleryImages.filter((url: string) =>
        keepImages.includes(url)
      );
    }

    // Add new gallery images
    const newGalleryImages = formData.getAll("newGalleryImages");
    for (const image of newGalleryImages) {
      if (image instanceof File && image.size > 0) {
        const base64Image = await fileToBase64(image);
        const uploadResult = await uploadToCloudinary(base64Image);
        if (uploadResult.success) {
          galleryImages.push(uploadResult.url as string);
        }
      }
    }

    // Handle brochure
    let brochureUrl = (formData.get("brochureUrl") as string) || null;

    const youtubeLink = (formData.get("youtubeLink") as string) || null;

    // Handle advantages
    const advantagesData = formData.getAll("advantages");
    const advantages = advantagesData
      .map((item) => item.toString())
      .filter((item) => item.trim() !== "");

    const updatedAt = new Date().toISOString();

    // Update project in database
    await query(
      `
      UPDATE Project 
      SET name = ?, slug = ?, location = ?, description = ?, 
          status = ?, units = ?, startingPrice = ?, maxPrice = ?, 
          completion = ?, mainImage = ?, galleryImages = ?, 
          brochureUrl = ?, youtubeLink = ?, advantages = ?, 
          updatedAt = ?
      WHERE id = ?
    `,
      [
        name,
        slug,
        location,
        description,
        status,
        units,
        startingPrice,
        maxPrice,
        completion,
        mainImage,
        JSON.stringify(galleryImages),
        brochureUrl,
        youtubeLink,
        JSON.stringify(advantages),
        updatedAt,
        id,
      ]
    );

    // Get updated record
    const updatedProjectResponse = await getProjectById(id);

    if (!updatedProjectResponse.success || !updatedProjectResponse.data) {
      return {
        success: false,
        message: "Failed to retrieve updated project.",
      };
    }

    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${id}`);
    revalidatePath(`/projects/${slug}`);

    return { success: true, data: updatedProjectResponse.data };
  } catch (error) {
    console.error("Error updating project:", error);
    return {
      success: false,
      message: "Database Error: Failed to Update Project.",
    };
  }
}

// Delete a project
export async function deleteProject(id: string) {
  try {
    await query("DELETE FROM Project WHERE id = ?", [id]);

    revalidatePath("/dashboard/projects");

    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return {
      success: false,
      message: "Database Error: Failed to Delete Project.",
    };
  }
}

// Get public projects (for public facing pages)
export async function getPublicProjects(limit?: number, type?: string) {
  try {
    let sql = `
      SELECT id, name, slug, location, status, units, 
      startingPrice, maxPrice, completion, mainImage
      FROM Project
    `;

    const params: any[] = [];

    // Add WHERE clause if type is specified
    if (type) {
      sql += ` WHERE status = ?`;
      params.push(type);
    }

    sql += ` ORDER BY createdAt DESC`;

    if (limit) {
      sql += " LIMIT ?";
      params.push(limit);
    }

    // Get raw data directly
    const result = await query(sql, params);

    if (!result || !result.rows) {
      console.log("No projects found or invalid result");
      return { success: true, data: [] };
    }

    // Process each project manually to avoid JSON.stringify issues
    const processedProjects = result.rows.map((project) => {
      const cleanProject: Record<string, any> = {};

      // Copy all properties manually
      Object.keys(project).forEach((key) => {
        cleanProject[key] = project[key];
      });

      return cleanProject;
    });

    return { success: true, data: processedProjects };
  } catch (error) {
    console.error("Error fetching public projects:", error);
    return {
      success: false,
      message: "Database Error: Failed to Fetch Projects.",
    };
  }
}

export async function getPublicProjectsPaginated(
  page = 1,
  limit = 12,
  type?: string
) {
  try {
    // Count total projects
    let countSql = "SELECT COUNT(*) as count FROM Project";
    const countParams: any[] = [];

    if (type) {
      countSql += " WHERE status = ?";
      countParams.push(type);
    }

    const countResult = await getOne(countSql, countParams);
    const total = countResult?.count ? Number(countResult.count) : 0;

    // Calculate pagination
    const offset = (page - 1) * limit;
    const totalPages = Math.ceil(total / limit);

    // Get projects for the current page
    let sql = `
      SELECT id, name, slug, location, status, units, 
      startingPrice, maxPrice, completion, mainImage, createdAt
      FROM Project
    `;

    const params: any[] = [];

    if (type) {
      sql += " WHERE status = ?";
      params.push(type);
    }

    sql += " ORDER BY createdAt DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    // Get raw data directly
    const result = await query(sql, params);

    if (!result || !result.rows) {
      return {
        success: true,
        data: {
          projects: [],
          total,
          page,
          limit,
          totalPages,
        },
      };
    }

    // Process each project manually
    const processedProjects = result.rows.map((project) => {
      const cleanProject: Record<string, any> = {};

      // Copy all properties manually
      Object.keys(project).forEach((key) => {
        cleanProject[key] = project[key];
      });

      return cleanProject;
    });

    return {
      success: true,
      data: {
        projects: processedProjects,
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching paginated public projects:", error);
    return {
      success: false,
      message: "Database Error: Failed to Fetch Projects.",
    };
  }
}
