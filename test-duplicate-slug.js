// Test script untuk duplicate slug
const API_BASE = "http://localhost:9003";

const landingPageData = {
  title: "Test Duplicate Slug",
  slug: "maggiore-signature", // Slug yang sudah ada
  description: "Test description untuk duplicate slug",
  content: [
    {
      id: "hero-test",
      type: "hero",
      config: {
        title: "Test Hero",
        subtitle: "Test subtitle",
      },
      order: 0,
    },
  ],
  status: "draft",
  template_type: "custom",
  campaign_source: "test",
  settings: {
    theme: "default",
    colors: {
      primary: "#007bff",
      secondary: "#6c757d",
      accent: "#28a745",
    },
  },
};

async function testDuplicateSlug() {
  try {
    console.log("Testing duplicate slug creation...");

    const response = await fetch(`${API_BASE}/api/landing-pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(landingPageData),
    });

    console.log("Response status:", response.status);

    const data = await response.json();
    console.log("Response data:", data);

    if (response.status === 409) {
      console.log("✅ Duplicate slug correctly detected!");
      console.log("Error message:", data.error);
    } else if (response.ok) {
      console.log("⚠️ Landing page created successfully (unexpected)");
    } else {
      console.log("❌ Unexpected error:", data.error);
    }
  } catch (error) {
    console.error("❌ Network error:", error);
  }
}

testDuplicateSlug();
