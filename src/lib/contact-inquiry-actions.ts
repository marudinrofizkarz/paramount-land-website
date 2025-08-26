"use server";

import db from "@/lib/database";
import { revalidatePath } from "next/cache";

interface ContactInquiryData {
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiryType: string;
  projectId: string;
  projectName: string;
  unitSlug?: string | null;
}

interface ContactInquiry {
  id: string;
  project_id: string;
  project_name: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  unit_slug: string | null;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
}

// Submit new contact inquiry
// Pastikan export function ada
export async function submitContactInquiry(data: ContactInquiryData) {
  try {
    const id = `inquiry_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Special handling for non-project inquiries
    let projectId = data.projectId;

    // For special cases like sales-consultation, we need a fallback
    if (data.projectId === "sales-consultation") {
      // First try to use "general_inquiries" special project
      try {
        const generalProject = await db.execute({
          sql: "SELECT id FROM Project WHERE id = ?",
          args: ["general_inquiries"],
        });

        if (generalProject.rows.length > 0) {
          projectId = "general_inquiries";
          console.log(`Using general_inquiries project as fallback`);
        } else {
          // If general_inquiries doesn't exist, try to find any project
          const existingProjects = await db.execute({
            sql: "SELECT id FROM Project LIMIT 1",
          });

          if (existingProjects.rows.length > 0) {
            // Use the first project found as a fallback
            projectId = String(existingProjects.rows[0].id);
            console.log(`Using existing project ID ${projectId} as fallback`);
          } else {
            // Create a general_inquiries project on-the-fly if no projects exist
            try {
              const now = new Date().toISOString();
              
              await db.execute({
                sql: `
                  INSERT INTO Project (
                    id, name, slug, location, description, status, 
                    units, startingPrice, maxPrice, completion, 
                    mainImage, createdAt, updatedAt
                  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                args: [
                  "general_inquiries",
                  "General Inquiries",
                  "general-inquiries",
                  "All Locations",
                  "Special project for general inquiries",
                  "residential",
                  0,
                  "0",
                  "0",
                  0,
                  "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
                  now,
                  now
                ],
              });
              
              projectId = "general_inquiries";
              console.log("Created general_inquiries project on-the-fly");
            } catch (createErr) {
              console.error("Error creating general_inquiries project:", createErr);
              return {
                success: false,
                error: "Failed to process your request. Please try again later."
              };
            }
          }
        }
      } catch (checkErr) {
        console.error("Error finding fallback project:", checkErr);
        return {
          success: false,
          error:
            "Database error: Unable to process your request. Please try again later.",
        };
      }
    }

    // For safety, let's ensure the project actually exists before inserting
    let validProject = false;

    try {
      // Check if the project exists
      const projectExists = await db.execute({
        sql: "SELECT id FROM Project WHERE id = ?",
        args: [projectId],
      });

      validProject = projectExists.rows.length > 0;

      // If project doesn't exist but we're still trying to use it, try a different approach
      if (!validProject) {
        console.log(
          `Project ID ${projectId} doesn't exist, trying to find any valid project`
        );

        // Look for any valid project
        const anyProject = await db.execute({
          sql: "SELECT id FROM Project LIMIT 1",
        });

        if (anyProject.rows.length > 0) {
          projectId = String(anyProject.rows[0].id);
          console.log(`Found fallback project ID: ${projectId}`);
          validProject = true;
        } else {
          console.log("No projects found in the database");
        }
      }
    } catch (error) {
      console.error("Error validating project:", error);
    }

    if (!validProject) {
      return {
        success: false,
        error:
          "Unable to save inquiry: No valid project found. Please contact support.",
      };
    }

    // Now proceed with the insert
    const sql = `INSERT INTO ContactInquiry (
      id, project_id, project_name, name, email, phone, message, 
      inquiry_type, unit_slug, status, source, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`;

    const args = [
      id,
      projectId, // Use our potentially modified projectId
      data.projectName,
      data.name,
      data.email,
      data.phone,
      data.message || null,
      data.inquiryType,
      data.unitSlug || null,
      "new",
      "website",
    ];

    const result = await db.execute({
      sql,
      args,
    });

    // Revalidate dashboard pages
    revalidatePath("/dashboard/contact-inquiries");

    return { success: true, id };
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return {
      success: false,
      error: "Failed to submit inquiry. Please try again.",
    };
  }
}

// Get all contact inquiries for dashboard
export async function getContactInquiries(
  page = 1,
  limit = 10,
  status?: string
) {
  try {
    let sql = `
      SELECT * FROM ContactInquiry 
      WHERE 1=1
    `;
    const args: any[] = [];

    if (status && status !== "all") {
      sql += ` AND status = ?`;
      args.push(status);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    args.push(limit, (page - 1) * limit);

    const result = await db.execute({ sql, args });

    // Get total count
    let countSql = `SELECT COUNT(*) as total FROM ContactInquiry WHERE 1=1`;
    const countArgs: any[] = [];

    if (status && status !== "all") {
      countSql += ` AND status = ?`;
      countArgs.push(status);
    }

    const countResult = await db.execute({ sql: countSql, args: countArgs });
    const totalRaw = countResult.rows[0]?.total ?? 0;
    const total = Number(totalRaw) || 0;

    // Serialize data untuk client component
    const serializedData = result.rows.map((row: any) => ({
      ...row,
      created_at:
        row.created_at instanceof Date
          ? row.created_at.toISOString()
          : String(row.created_at),
      updated_at:
        row.updated_at instanceof Date
          ? row.updated_at.toISOString()
          : String(row.updated_at),
    }));

    return {
      success: true,
      data: serializedData as ContactInquiry[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching contact inquiries:", error);
    return {
      success: false,
      error: "Failed to fetch contact inquiries",
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

// Get inquiry by ID
export async function getInquiryById(id: string) {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM ContactInquiry WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return {
        success: false,
        error: "Inquiry not found",
      };
    }

    const inquiry = result.rows[0] as any;

    // Serialize data untuk client component
    const serializedInquiry = {
      ...inquiry,
      created_at:
        inquiry.created_at instanceof Date
          ? inquiry.created_at.toISOString()
          : String(inquiry.created_at),
      updated_at:
        inquiry.updated_at instanceof Date
          ? inquiry.updated_at.toISOString()
          : String(inquiry.updated_at),
    };

    return {
      success: true,
      data: serializedInquiry as ContactInquiry,
    };
  } catch (error) {
    console.error("Error fetching inquiry:", error);
    return {
      success: false,
      error: "Failed to fetch inquiry",
    };
  }
}

// Update inquiry status
export async function updateInquiryStatus(id: string, status: string) {
  try {
    await db.execute({
      sql: `UPDATE ContactInquiry SET status = ?, updated_at = datetime('now') WHERE id = ?`,
      args: [status, id],
    });

    revalidatePath("/dashboard/contact-inquiries");

    return { success: true };
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return {
      success: false,
      error: "Failed to update status",
    };
  }
}

// Delete inquiry
export async function deleteInquiry(id: string) {
  try {
    await db.execute({
      sql: `DELETE FROM ContactInquiry WHERE id = ?`,
      args: [id],
    });

    revalidatePath("/dashboard/contact-inquiries");

    return { success: true };
  } catch (error) {
    console.error("Error deleting inquiry:", error);
    return {
      success: false,
      error: "Failed to delete inquiry",
    };
  }
}
