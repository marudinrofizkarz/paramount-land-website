const { createClient } = require("@libsql/client");

// Database configuration
const db = createClient({
  url: process.env.DATABASE_URL || "file:local.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function addNewComponents() {
  try {
    console.log("Adding new components to database...");

    const newComponents = [
      {
        id: "gallery-1",
        name: "Image Gallery - Property Showcase",
        type: "gallery",
        config: JSON.stringify({
          title: "Property Gallery",
          subtitle: "Explore our premium properties",
          images: [
            {
              id: "img-1",
              src: "/images/property-1.jpg",
              alt: "Modern Apartment",
              title: "Luxury Apartment",
              description: "2BR apartment with city view",
            },
            {
              id: "img-2",
              src: "/images/property-2.jpg",
              alt: "Contemporary House",
              title: "Family House",
              description: "3BR house with garden",
            },
            {
              id: "img-3",
              src: "/images/property-3.jpg",
              alt: "Office Space",
              title: "Commercial Office",
              description: "Prime location office space",
            },
          ],
          layout: "masonry",
          columns: 3,
          enableLightbox: true,
          enableCaptions: true,
          aspectRatio: "16/9",
        }),
        is_system: 1,
      },
      {
        id: "pricing-1",
        name: "Pricing Table - Property Plans",
        type: "pricing",
        config: JSON.stringify({
          title: "Property Investment Plans",
          subtitle: "Choose the perfect investment option for you",
          plans: [
            {
              id: "plan-1",
              name: "Starter",
              price: "500M",
              period: "Starting Price",
              description: "Perfect for first-time buyers",
              features: [
                "1-2 Bedroom Units",
                "Basic Facilities",
                "Parking Space",
                "24/7 Security",
              ],
              highlighted: false,
              ctaText: "Learn More",
              ctaLink: "#contact",
            },
            {
              id: "plan-2",
              name: "Premium",
              price: "1.2B",
              period: "Starting Price",
              description: "Ideal for growing families",
              features: [
                "2-3 Bedroom Units",
                "Premium Facilities",
                "Balcony & Garden",
                "Swimming Pool",
                "Gym & Recreation",
              ],
              highlighted: true,
              ctaText: "Get Details",
              ctaLink: "#contact",
            },
            {
              id: "plan-3",
              name: "Luxury",
              price: "2.5B",
              period: "Starting Price",
              description: "Ultimate luxury living",
              features: [
                "3-4 Bedroom Units",
                "Luxury Amenities",
                "Private Elevator",
                "Rooftop Access",
                "Concierge Service",
                "Smart Home Features",
              ],
              highlighted: false,
              ctaText: "Schedule Tour",
              ctaLink: "#contact",
            },
          ],
          layout: "cards",
          showComparison: true,
        }),
        is_system: 1,
      },
      {
        id: "faq-1",
        name: "FAQ Section - Property Questions",
        type: "faq",
        config: JSON.stringify({
          title: "Frequently Asked Questions",
          subtitle: "Get answers to common questions about our properties",
          faqs: [
            {
              id: "faq-1",
              question: "What documents are required for property purchase?",
              answer:
                "You'll need valid ID, proof of income, bank statements, and down payment confirmation. Our team will guide you through the complete documentation process.",
              category: "Purchase Process",
            },
            {
              id: "faq-2",
              question: "Are there financing options available?",
              answer:
                "Yes, we work with multiple banks and financial institutions to provide competitive mortgage rates. Our financing team can help you find the best payment plan.",
              category: "Financing",
            },
            {
              id: "faq-3",
              question: "What facilities are included in the property?",
              answer:
                "All properties include basic amenities like parking, security, and maintenance. Premium units include additional facilities like swimming pool, gym, and 24/7 concierge service.",
              category: "Facilities",
            },
            {
              id: "faq-4",
              question: "Can I schedule a property tour?",
              answer:
                "Absolutely! You can schedule a personalized property tour by contacting our sales team. Virtual tours are also available for your convenience.",
              category: "Viewing",
            },
          ],
          enableSearch: true,
          enableCategories: true,
          layout: "accordion",
        }),
        is_system: 1,
      },
      {
        id: "statistics-1",
        name: "Statistics Counter - Company Achievements",
        type: "statistics",
        config: JSON.stringify({
          title: "Our Track Record",
          subtitle: "Numbers that speak for our success",
          stats: [
            {
              id: "stat-1",
              label: "Properties Sold",
              value: 1500,
              suffix: "+",
              icon: "home",
              description: "Successfully delivered projects",
            },
            {
              id: "stat-2",
              label: "Happy Customers",
              value: 2800,
              suffix: "+",
              icon: "users",
              description: "Satisfied property owners",
            },
            {
              id: "stat-3",
              label: "Years Experience",
              value: 15,
              suffix: "+",
              icon: "calendar",
              description: "In real estate industry",
            },
            {
              id: "stat-4",
              label: "Investment Value",
              value: 500,
              suffix: "B+",
              prefix: "Rp",
              icon: "trending-up",
              description: "Total property value",
            },
          ],
          layout: "horizontal",
          animateOnScroll: true,
          showProgressBars: false,
        }),
        is_system: 1,
      },
      {
        id: "video-1",
        name: "Video Section - Property Overview",
        type: "video",
        config: JSON.stringify({
          title: "Experience Our Properties",
          subtitle: "Take a virtual tour of our premium developments",
          videoType: "youtube",
          videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          thumbnailUrl: "/images/video-thumbnail.jpg",
          autoplay: false,
          showControls: true,
          aspectRatio: "16/9",
          overlayIcon: true,
          description:
            "Explore our luxury properties and premium amenities through this comprehensive video tour.",
        }),
        is_system: 1,
      },
      {
        id: "timeline-1",
        name: "Timeline - Development Progress",
        type: "timeline",
        config: JSON.stringify({
          title: "Development Timeline",
          subtitle: "Track the progress of our property development",
          items: [
            {
              id: "timeline-1",
              title: "Project Planning",
              date: "Q1 2024",
              description: "Initial planning and design phase completed",
              status: "completed",
              image: "/images/timeline-1.jpg",
            },
            {
              id: "timeline-2",
              title: "Foundation Work",
              date: "Q2 2024",
              description: "Foundation and structural work in progress",
              status: "completed",
              image: "/images/timeline-2.jpg",
            },
            {
              id: "timeline-3",
              title: "Construction Phase",
              date: "Q3 2024",
              description: "Main construction and interior development",
              status: "in-progress",
              image: "/images/timeline-3.jpg",
            },
            {
              id: "timeline-4",
              title: "Final Touches",
              date: "Q4 2024",
              description: "Finishing touches and quality inspections",
              status: "upcoming",
              image: "/images/timeline-4.jpg",
            },
            {
              id: "timeline-5",
              title: "Ready for Handover",
              date: "Q1 2025",
              description: "Property ready for handover to buyers",
              status: "upcoming",
              image: "/images/timeline-5.jpg",
            },
          ],
          layout: "vertical",
          showProgress: true,
          showImages: true,
        }),
        is_system: 1,
      },
      {
        id: "location-1",
        name: "Location Map - Property Locations",
        type: "location",
        config: JSON.stringify({
          title: "Our Locations",
          subtitle: "Find our properties across prime locations",
          showMap: true,
          mapType: "openstreetmap",
          mapHeight: 400,
          showContactInfo: true,
          locations: [
            {
              id: "loc-1",
              name: "Jakarta Central Office",
              address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10220",
              phone: "+62 21 1234 5678",
              email: "jakarta@paramount.com",
              hours: "Mon-Fri 9AM-6PM, Sat 9AM-3PM",
              coordinates: {
                lat: -6.2088,
                lng: 106.8456,
              },
            },
            {
              id: "loc-2",
              name: "Surabaya Branch",
              address: "Jl. Pemuda No. 456, Surabaya, Jawa Timur 60271",
              phone: "+62 31 9876 5432",
              email: "surabaya@paramount.com",
              hours: "Mon-Fri 9AM-6PM, Sat 9AM-3PM",
              coordinates: {
                lat: -7.2575,
                lng: 112.7521,
              },
            },
          ],
        }),
        is_system: 1,
      },
    ];

    // Insert new components
    for (const component of newComponents) {
      try {
        await db.execute(
          `INSERT OR REPLACE INTO LandingPageComponents (id, name, type, config, is_system, created_at, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
          [
            component.id,
            component.name,
            component.type,
            component.config,
            component.is_system,
          ]
        );
        console.log(`✓ Added component: ${component.name}`);
      } catch (error) {
        console.error(
          `✗ Error adding component ${component.name}:`,
          error.message
        );
      }
    }

    console.log("✓ All new components added successfully!");

    // Verify components were added
    try {
      const result = await db.execute(
        "SELECT type, COUNT(*) as count FROM LandingPageComponents GROUP BY type ORDER BY type"
      );
      console.log("\nComponent types in database:");
      result.rows.forEach((row) => {
        console.log(`  ${row.type}: ${row.count} templates`);
      });
    } catch (error) {
      console.error("Error checking components:", error.message);
    }
  } catch (error) {
    console.error("Error adding new components:", error);
    process.exit(1);
  }
}

async function main() {
  await addNewComponents();
  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { addNewComponents };
