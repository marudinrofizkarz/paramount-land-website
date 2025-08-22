// Check Units Table
// This script queries the units table and displays the structure and data

import db from "../src/lib/database.js";

async function checkUnitsTable() {
  try {
    console.log("=== CHECKING UNITS TABLE STRUCTURE ===");

    // Get table structure
    const tableInfo = await db.execute("PRAGMA table_info(units)");
    console.log("Table structure:");
    tableInfo.rows.forEach((column) => {
      console.log(`- ${column.name} (${column.type})`);
    });

    console.log("\n=== SAMPLE UNITS DATA ===");

    // Get sample data
    const units = await db.execute("SELECT * FROM units LIMIT 5");

    if (units.rows && units.rows.length > 0) {
      units.rows.forEach((unit, index) => {
        console.log(`\nUnit ${index + 1}:`);
        Object.entries(unit).forEach(([key, value]) => {
          // Truncate long values for readability
          const displayValue =
            typeof value === "string" && value.length > 100
              ? value.substring(0, 100) + "..."
              : value;
          console.log(`${key}: ${displayValue}`);
        });
      });
    } else {
      console.log("No units found in the database.");
    }
  } catch (error) {
    console.error("Error checking units table:", error);
  }
}

checkUnitsTable();
