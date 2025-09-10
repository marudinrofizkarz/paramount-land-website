/**
 * This script is used to test the project fetching functionality
 * and diagnose any serialization issues.
 */

import {
  getProjectBySlug,
  getPublicProjects,
} from "../src/lib/project-actions";

async function testProjectFetching() {
  try {
    console.log("=== TESTING PROJECT FETCHING FUNCTIONALITY ===");

    // 1. First get all public projects to find a slug to test with
    console.log("\n1. Fetching all public projects...");
    const projectsResponse = await getPublicProjects();

    if (!projectsResponse.success) {
      console.error("Failed to fetch projects:", projectsResponse.message);
      return;
    }

    if (!projectsResponse.data || projectsResponse.data.length === 0) {
      console.error("No projects found in database");
      return;
    }

    console.log(`Found ${projectsResponse.data.length} projects`);

    // 2. Get the first project's slug and test getProjectBySlug
    const testProject = projectsResponse.data[0];
    const testSlug = testProject.slug;

    console.log(`\n2. Testing getProjectBySlug with slug: ${testSlug}`);
    const projectResponse = await getProjectBySlug(testSlug);

    if (!projectResponse.success) {
      console.error(
        "Failed to fetch project by slug:",
        projectResponse.message
      );
      return;
    }

    // 3. Test serialization by accessing properties
    console.log("\n3. Testing property access on project data");
    const project = projectResponse.data;

    console.log("\nProject basic properties:");
    console.log("- ID:", project.id);
    console.log("- Name:", project.name);
    console.log("- Slug:", project.slug);
    console.log("- Location:", project.location);
    console.log("- Status:", project.status);

    console.log("\nProject JSON properties:");
    console.log("- Gallery Images type:", typeof project.galleryImages);
    if (Array.isArray(project.galleryImages)) {
      console.log("- Gallery Images count:", project.galleryImages.length);
    } else {
      console.log("- Gallery Images is not an array!");
      console.log("- Gallery Images raw value:", project.galleryImages);
    }

    console.log("- Advantages type:", typeof project.advantages);
    if (Array.isArray(project.advantages)) {
      console.log("- Advantages count:", project.advantages.length);
    } else {
      console.log("- Advantages is not an array!");
      console.log("- Advantages raw value:", project.advantages);
    }

    // 4. Test object methods to verify object is properly serialized
    console.log("\n4. Testing object methods");
    try {
      const keys = Object.keys(project);
      console.log("- Object.keys works:", keys.length > 0 ? "Yes" : "No");

      const entries = Object.entries(project);
      console.log("- Object.entries works:", entries.length > 0 ? "Yes" : "No");

      const values = Object.values(project);
      console.log("- Object.values works:", values.length > 0 ? "Yes" : "No");
    } catch (error) {
      console.error("Error testing object methods:", error);
    }

    console.log("\n=== TEST COMPLETED SUCCESSFULLY ===");
  } catch (error) {
    console.error("Error in test script:", error);
  }
}

// Run the test
testProjectFetching().catch((error) => {
  console.error("Unhandled error in test script:", error);
  process.exit(1);
});
