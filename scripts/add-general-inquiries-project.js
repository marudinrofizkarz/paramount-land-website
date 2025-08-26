/*
  This script adds a general_inquiries project to the database
  to handle special cases like sales consultations that don't have an associated project
*/

import db from "../src/lib/database";

async function addGeneralInquiriesProject() {
  try {
    console.log("Checking for general_inquiries project...");

    // Check if the project already exists
    const projectCheck = await db.execute({
      sql: "SELECT id FROM Project WHERE id = ?",
      args: ["general_inquiries"],
    });

    if (projectCheck.rows.length === 0) {
      console.log("Creating general_inquiries project...");

      // Create the general_inquiries project
      await db.execute({
        sql: `INSERT INTO Project (
          id, name, slug, status, location, description,
          featured_image, main_image, is_featured, project_type,
          updated_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        args: [
          "general_inquiries",
          "General Inquiries",
          "general-inquiries",
          "active",
          "Global",
          "Special project for general inquiries and consultations",
          null, // featured_image
          null, // main_image
          0, // is_featured
          "special", // project_type
        ],
      });

      console.log("General inquiries project created successfully!");
    } else {
      console.log("General inquiries project already exists.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error adding general inquiries project:", error);
    process.exit(1);
  }
}

// Execute the script
addGeneralInquiriesProject();
