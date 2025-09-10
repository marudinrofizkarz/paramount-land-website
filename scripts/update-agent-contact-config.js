// Manual database update using direct SQL
const { createClient } = require("@libsql/client");
const path = require("path");

const db = createClient({
  url: "file:" + path.join(__dirname, "../local.db"),
});

// Updated agent-contact component configuration for single agent
const updatedAgentContactConfig = {
  name: "Kontak Sales Agent",
  type: "agent-contact",
  config: {
    title: "Hubungi Sales Terpercaya Kami",
    subtitle: "Dapatkan konsultasi expert dari sales in-house terbaik kami",
    agent: {
      name: "Marudin Rofizka",
      title: "Senior Property Consultant",
      phone: "+62 812-9876-5432",
      email: "marudin@paramountland.co.id",
      whatsapp: "+62 812-9876-5432",
      photo: "/sales-avatar.jpg",
      description:
        "Property consultant berpengalaman dengan komitmen tinggi untuk membantu Anda menemukan hunian yang tepat sesuai kebutuhan dan budget.",
      experience: "7+ tahun",
      specialization: "Residensial & Komersial",
      office: "Paramount Land Office BSD",
      schedule: "Sen-Jum 08:30-17:00, Sab 09:00-15:00",
      rating: 5,
    },
    layout: "card",
    showPhoto: true,
    showDescription: true,
    showExperience: true,
    showSpecialization: true,
    showOffice: true,
    showSchedule: true,
    showRating: true,
    backgroundColor: "#ffffff",
    primaryColor: "#3b82f6",
    ctaText: "Hubungi Sekarang",
    ctaWhatsappText: "WhatsApp",
    ctaEmailText: "Email",
  },
  preview_image: null,
  is_system: true,
};

async function updateAgentContactComponent() {
  console.log("🚀 Updating agent-contact component configuration...");

  try {
    // Check if agent-contact component exists
    const existingComponents = await db.execute(
      "SELECT * FROM LandingPageComponents WHERE type = 'agent-contact' AND is_system = 1"
    );

    if (existingComponents.rows.length > 0) {
      // Update existing component
      const result = await db.execute(
        `UPDATE LandingPageComponents 
         SET name = ?, config = ?, updated_at = datetime('now')
         WHERE type = 'agent-contact' AND is_system = 1`,
        [
          updatedAgentContactConfig.name,
          JSON.stringify(updatedAgentContactConfig.config),
        ]
      );

      console.log("✅ Successfully updated existing agent-contact component");
    } else {
      // Create new component
      const id = `agent-contact-${Date.now()}`;
      await db.execute(
        `INSERT INTO LandingPageComponents (
          id, name, type, config, preview_image, is_system, created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [
          id,
          updatedAgentContactConfig.name,
          updatedAgentContactConfig.type,
          JSON.stringify(updatedAgentContactConfig.config),
          updatedAgentContactConfig.preview_image,
          updatedAgentContactConfig.is_system ? 1 : 0,
          "system",
        ]
      );

      console.log("✅ Successfully created new agent-contact component");
    }

    console.log("🎉 Agent-contact component update completed!");
  } catch (error) {
    console.error("❌ Error updating agent-contact component:", error);
  }
}

// Run the update
updateAgentContactComponent()
  .then(() => {
    console.log("✨ Update script completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Update script failed:", error);
    process.exit(1);
  });
