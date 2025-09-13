#!/usr/bin/env node

/**
 * Test Upload Functionality
 * Script untuk testing upload API setelah fix
 */

import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";
import path from "path";

const API_BASE_URL = process.env.TEST_URL || "http://localhost:3000";

async function testUploadAPI() {
  console.log("🧪 Testing Upload API...");
  console.log(`📍 Base URL: ${API_BASE_URL}`);

  try {
    // Test 1: GET endpoint
    console.log("\n1️⃣ Testing GET /api/upload...");
    const getResponse = await fetch(`${API_BASE_URL}/api/upload`);
    const getResult = await getResponse.json();

    if (getResponse.ok) {
      console.log("✅ GET endpoint working");
      console.log(`   Max Size: ${getResult.maxSize}`);
      console.log(
        `   Supported Types: ${getResult.supportedTypes?.join(", ")}`
      );
    } else {
      console.log("❌ GET endpoint failed");
      console.log(getResult);
    }

    // Test 2: POST without file
    console.log("\n2️⃣ Testing POST /api/upload (no file)...");
    const formData1 = new FormData();
    const noFileResponse = await fetch(`${API_BASE_URL}/api/upload`, {
      method: "POST",
      body: formData1,
    });

    const noFileResult = await noFileResponse.json();
    if (
      noFileResponse.status === 400 &&
      noFileResult.error === "No file provided"
    ) {
      console.log("✅ No file validation working");
    } else {
      console.log("❌ No file validation failed");
      console.log(noFileResult);
    }

    // Test 3: POST with test image (if exists)
    const testImagePath = path.join(process.cwd(), "public", "placeholder.svg");
    if (fs.existsSync(testImagePath)) {
      console.log("\n3️⃣ Testing POST /api/upload (with file)...");

      const formData2 = new FormData();
      formData2.append("file", fs.createReadStream(testImagePath));

      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData2,
      });

      const uploadResult = await uploadResponse.json();
      if (uploadResponse.ok && uploadResult.success) {
        console.log("✅ File upload working");
        console.log(`   URL: ${uploadResult.url}`);
      } else {
        console.log("❌ File upload failed");
        console.log(uploadResult);
      }
    } else {
      console.log("\n3️⃣ Skipping file upload test (no test image found)");
    }

    // Test 4: Environment check
    console.log("\n4️⃣ Environment Check...");
    if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.log("✅ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is set");
    } else {
      console.log("❌ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is missing");
    }

    if (process.env.CLOUDINARY_API_KEY) {
      console.log("✅ CLOUDINARY_API_KEY is set");
    } else {
      console.log("❌ CLOUDINARY_API_KEY is missing");
    }

    if (process.env.CLOUDINARY_API_SECRET) {
      console.log("✅ CLOUDINARY_API_SECRET is set");
    } else {
      console.log("❌ CLOUDINARY_API_SECRET is missing");
    }
  } catch (error) {
    console.error("🚨 Test failed:", error.message);
  }
}

// File size checker
function checkFileSize(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

  return {
    bytes: fileSizeInBytes,
    mb: fileSizeInMB.toFixed(2),
    isValid: fileSizeInBytes <= 4 * 1024 * 1024, // 4MB limit
  };
}

async function main() {
  console.log("🔧 Upload API Test Suite");
  console.log("========================\n");

  await testUploadAPI();

  console.log("\n📋 Summary:");
  console.log("- Check environment variables in your deployment platform");
  console.log("- Test with files < 4MB");
  console.log("- Monitor Vercel Function logs for detailed errors");
  console.log("- Use browser Network tab to see actual error responses");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { testUploadAPI, checkFileSize };
