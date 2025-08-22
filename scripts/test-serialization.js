#!/usr/bin/env node

// Script untuk menguji serialisasi data Turso untuk memastikan
// tidak ada masalah "Only plain objects can be passed to Client Components"

const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

// Baca file .env.local
function readEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const envContent = fs.readFileSync(envPath, "utf8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
      if (line && !line.startsWith("#")) {
        const [key, value] = line.split("=");
        if (key && value) {
          envVars[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
        }
      }
    });

    return envVars;
  } catch (error) {
    console.error("Error reading .env file:", error.message);
    process.exit(1);
  }
}

// Fungsi untuk menguji sifat-sifat objek
function inspectObject(obj, label = "Object") {
  console.log(`\n=== Inspecting ${label} ===`);

  if (obj === null || obj === undefined) {
    console.log(`${label} is ${obj}`);
    return;
  }

  if (typeof obj !== "object") {
    console.log(`${label} is not an object, it's a ${typeof obj}`);
    return;
  }

  // Cek prototype
  const proto = Object.getPrototypeOf(obj);
  console.log(
    `Prototype: ${
      proto === Object.prototype
        ? "Object.prototype (Plain Object)"
        : "Custom prototype (Not a plain object)"
    }`
  );

  // Cek jika ini array
  if (Array.isArray(obj)) {
    console.log(`Type: Array with ${obj.length} items`);
    if (obj.length > 0) {
      console.log("First item:", typeof obj[0]);
      if (typeof obj[0] === "object" && obj[0] !== null) {
        inspectObject(obj[0], `${label}[0]`);
      }
    }
    return;
  }

  // Cek metode
  const methods = Object.entries(Object.getOwnPropertyDescriptors(obj))
    .filter(([_, descriptor]) => typeof descriptor.value === "function")
    .map(([name]) => name);

  if (methods.length > 0) {
    console.log(`Methods found: ${methods.join(", ")}`);
    console.log(
      "⚠️ WARNING: Objects with methods cannot be passed to Client Components"
    );
  } else {
    console.log("✅ No methods found - safe for Client Components");
  }

  // Cek properti
  const properties = Object.keys(obj);
  console.log(
    `Properties: ${properties.length ? properties.join(", ") : "None"}`
  );

  // Cek circular references
  try {
    JSON.stringify(obj);
    console.log("✅ No circular references - can be JSON serialized");
  } catch (error) {
    console.log("❌ Circular reference detected - cannot be JSON serialized");
  }
}

// Fungsi untuk menguji serialisasi data project
async function testProjectSerialization() {
  const env = readEnvFile();
  const dbUrl = env.DATABASE_URL;
  const authToken = env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error(
      "DATABASE_URL atau DATABASE_AUTH_TOKEN tidak dikonfigurasi dengan benar"
    );
    return false;
  }

  try {
    console.log("\n===== PROJECT SERIALIZATION TEST =====");

    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    // Ambil project dari database
    console.log("Fetching project from database...");
    const rawProjects = await db.execute("SELECT * FROM Project LIMIT 1");

    if (rawProjects.rows.length === 0) {
      console.log(
        "No projects found in database. Please create a project first."
      );
      return;
    }

    const project = rawProjects.rows[0];

    // Test raw object from database
    inspectObject(project, "Raw Database Object");

    // Test serialized object
    const serializedProject = JSON.parse(JSON.stringify(project));
    inspectObject(serializedProject, "Serialized Project");

    // Test parsed JSON fields
    const galleryImages = project.galleryImages
      ? JSON.parse(project.galleryImages)
      : [];
    inspectObject(galleryImages, "Parsed Gallery Images");

    // Test full formatted object
    const formattedProject = {
      ...serializedProject,
      galleryImages: JSON.parse(serializedProject.galleryImages || "[]"),
      advantages: JSON.parse(serializedProject.advantages || "[]"),
    };
    inspectObject(formattedProject, "Formatted Project");

    console.log("\n===== SERIALIZATION VERIFICATION =====");
    console.log(
      "Raw Object Prototype:",
      Object.getPrototypeOf(project) === Object.prototype
        ? "✅ Plain Object"
        : "❌ Not Plain Object"
    );
    console.log(
      "Serialized Object Prototype:",
      Object.getPrototypeOf(serializedProject) === Object.prototype
        ? "✅ Plain Object"
        : "❌ Not Plain Object"
    );

    // Verifikasi akhir
    try {
      const jsonString = JSON.stringify(formattedProject);
      const deserializedObject = JSON.parse(jsonString);
      console.log(
        "\n✅ SUCCESS: Object can be properly serialized and deserialized!"
      );
      return true;
    } catch (error) {
      console.error("\n❌ ERROR: Object cannot be properly serialized:", error);
      return false;
    }
  } catch (error) {
    console.error("Error testing project serialization:", error);
    return false;
  }
}

// Main function
async function main() {
  await testProjectSerialization();
}

main().catch(console.error);
