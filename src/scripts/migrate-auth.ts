"use server";

import fs from "fs";
import path from "path";
import { query } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// Function to run SQL file
async function executeSQLFile(filePath: string) {
  try {
    console.log(`Executing SQL file: ${filePath}`);
    const sql = fs.readFileSync(path.join(process.cwd(), filePath), "utf8");

    // Split SQL file into separate statements
    const statements = sql
      .split(";")
      .filter((statement) => statement.trim() !== "");

    // Execute each statement
    for (const statement of statements) {
      await query(statement);
    }

    console.log(`Successfully executed SQL file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error executing SQL file ${filePath}:`, error);
    throw error;
  }
}

// Function to create initial admin user
async function createAdminUser(
  username: string,
  email: string,
  password: string,
  name: string = "Administrator"
) {
  try {
    // Check if user already exists
    const existingUser = await query(
      "SELECT * FROM Users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUser.rows.length > 0) {
      console.log("Admin user already exists");
      return true;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const now = new Date().toISOString();

    // Insert admin user
    await query(
      "INSERT INTO Users (id, username, email, password, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, username, email, hashedPassword, name, "admin", now, now]
    );

    console.log("Admin user created successfully");
    return true;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

// Function to run auth migration
export async function runAuthMigration(
  adminUsername: string = "admin",
  adminEmail: string = "admin@example.com",
  adminPassword: string = "admin123",
  adminName: string = "Administrator"
) {
  try {
    // Execute schema file
    await executeSQLFile("sql/auth_schema.sql");

    // Create admin user
    await createAdminUser(adminUsername, adminEmail, adminPassword, adminName);

    return {
      success: true,
      message: "Authentication system migration completed successfully",
    };
  } catch (error) {
    console.error("Auth migration error:", error);
    return { success: false, message: `Migration failed: ${error}` };
  }
}
