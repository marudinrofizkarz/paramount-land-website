/**
 * Script to update the website contact information in the database
 * This script will update the phone number, WhatsApp number and email in the WebsiteSettings table
 */

const { createClient } = require("@libsql/client");
require("dotenv").config();

async function updateContactInfo() {
  try {
    // Create DB connection
    const db = createClient({
      url: process.env.DATABASE_URL,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });

    console.log("Connected to database");

    // Update the website settings
    const result = await db.execute({
      sql: `UPDATE WebsiteSettings 
            SET phoneNumber = ?, whatsappNumber = ?, email = ?, updatedAt = ?
            WHERE id = ?`,
      args: [
        "081387118533", // Phone number
        "6281387118533", // WhatsApp number (with country code)
        "rijal.sutanto@paramount-land.com", // Email
        new Date().toISOString(),
        "main",
      ],
    });

    if (result.rowsAffected === 1) {
      console.log("✅ Contact information updated successfully!");
      // Verify the changes
      const check = await db.execute({
        sql: `SELECT phoneNumber, whatsappNumber, email FROM WebsiteSettings WHERE id = ?`,
        args: ["main"],
      });

      console.log("Updated contact information:");
      console.log(check.rows[0]);
    } else {
      console.log(
        "⚠️ No records were updated. The settings record may not exist."
      );
    }
  } catch (error) {
    console.error("❌ Error updating contact information:", error);
  }
}

updateContactInfo().catch(console.error);
