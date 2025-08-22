const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env.local" });

// Sample units data untuk project yang ada di database
const mockUnitsData = [
  {
    projectSlug: "matera-residence",
    units: [
      {
        name: "Type A - Studio Plus",
        slug: "type-a-studio-plus",
        salePrice: "750000000",
        dimensions: "8m x 10m",
        landArea: "80",
        buildingArea: "65",
        description:
          "<p>Unit tipe A dengan desain modern dan efisien. Cocok untuk profesional muda atau pasangan baru menikah. Dilengkapi dengan kitchen set built-in dan balcony pribadi dengan view taman.</p><p>Fitur unggulan termasuk smart home system, AC split, dan water heater. Unit ini juga memiliki akses mudah ke fasilitas umum seperti gym dan swimming pool.</p>",
        bedrooms: "1",
        bathrooms: "1",
        carports: "1",
        floors: "1",
        facilities:
          '["Swimming Pool", "Gym", "24/7 Security", "Smart Home", "Balcony"]',
        certification: "SHGB",
        mainImage:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        galleryImages:
          '["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg"]',
        status: "active",
      },
      {
        name: "Type B - Family Comfort",
        slug: "type-b-family-comfort",
        salePrice: "950000000",
        dimensions: "10m x 12m",
        landArea: "120",
        buildingArea: "95",
        description:
          "<p>Unit tipe B yang spacious dan nyaman untuk keluarga kecil. Memiliki ruang tamu yang luas, dapur terpisah, dan kamar tidur utama dengan walk-in closet.</p><p>Dilengkapi dengan taman kecil di belakang unit dan tempat parkir covered. Lokasi strategis dekat dengan area playground dan clubhouse.</p>",
        bedrooms: "2",
        bathrooms: "2",
        carports: "1",
        floors: "1",
        facilities:
          '["Swimming Pool", "Gym", "Playground", "Clubhouse", "24/7 Security", "Private Garden"]',
        certification: "SHGB",
        mainImage:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        galleryImages:
          '["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_600,h_400/sample.jpg"]',
        status: "active",
      },
      {
        name: "Type C - Premium Living",
        slug: "type-c-premium-living",
        salePrice: "1350000000",
        dimensions: "12m x 15m",
        landArea: "180",
        buildingArea: "140",
        description:
          "<p>Unit premium dengan 3 kamar tidur dan 2 lantai. Desain modern minimalis dengan ceiling tinggi dan ventilasi optimal. Master bedroom dilengkapi dengan bathroom en-suite dan balcony pribadi.</p><p>Kitchen island dan dining area yang luas menjadikan unit ini perfect untuk entertaining. Termasuk maid room dan gudang penyimpanan.</p>",
        bedrooms: "3",
        bathrooms: "3",
        carports: "2",
        floors: "2",
        facilities:
          '["Swimming Pool", "Gym", "Playground", "Clubhouse", "24/7 Security", "Private Garden", "High Ceiling", "Maid Room"]',
        certification: "SHGB",
        mainImage:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        galleryImages:
          '["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_600,h_400/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_1000,h_750/sample.jpg"]',
        status: "active",
      },
    ],
  },
  {
    projectSlug: "granada-alicante",
    units: [
      {
        name: "Compact Villa",
        slug: "compact-villa",
        salePrice: "850000000",
        dimensions: "9m x 12m",
        landArea: "108",
        buildingArea: "85",
        description:
          "<p>Villa kompak dengan gaya mediterania yang elegan. Design yang menginspirasi dari arsitektur Spanyol dengan sentuhan modern yang sophisticated.</p><p>Dilengkapi dengan courtyard kecil di tengah rumah yang memberikan sirkulasi udara natural dan pencahayaan optimal. Cocok untuk small family yang menginginkan privacy dan kenyamanan.</p>",
        bedrooms: "2",
        bathrooms: "2",
        carports: "1",
        floors: "1",
        facilities:
          '["Courtyard", "Spanish Architecture", "24/7 Security", "Garden", "Swimming Pool Access"]',
        certification: "SHM",
        mainImage:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        galleryImages:
          '["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg"]',
        status: "active",
      },
      {
        name: "Garden Villa Deluxe",
        slug: "garden-villa-deluxe",
        salePrice: "1250000000",
        dimensions: "12m x 16m",
        landArea: "192",
        buildingArea: "150",
        description:
          "<p>Villa mewah dengan taman luas dan kolam renang pribadi kecil. Kombinasi perfect antara indoor dan outdoor living dengan large sliding doors yang membuka ke garden area.</p><p>Master suite dengan bathroom seperti spa, plus guest bedroom yang comfortable. Family room yang luas dengan fireplace menjadi focal point yang warm dan inviting.</p>",
        bedrooms: "3",
        bathrooms: "3",
        carports: "2",
        floors: "2",
        facilities:
          '["Private Pool", "Large Garden", "Fireplace", "Spanish Architecture", "24/7 Security", "Spa Bathroom", "Guest Room"]',
        certification: "SHM",
        mainImage:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        galleryImages:
          '["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_600,h_400/sample.jpg"]',
        status: "active",
      },
    ],
  },
  {
    projectSlug: "matera-signature",
    units: [
      {
        name: "Signature One",
        slug: "signature-one",
        salePrice: "1500000000",
        dimensions: "14m x 18m",
        landArea: "252",
        buildingArea: "200",
        description:
          "<p>Unit signature yang menghadirkan luxury living di level tertinggi. Architectural masterpiece dengan attention to detail yang exceptional di setiap sudut rumah.</p><p>Open-plan concept dengan triple-height ceiling di living area. Kitchen dengan island besar dan premium appliances. Master suite dengan walk-in wardrobe dan luxury bathroom dengan bathtub standing.</p>",
        bedrooms: "4",
        bathrooms: "4",
        carports: "2",
        floors: "2",
        facilities:
          '["Triple Height Ceiling", "Luxury Kitchen", "Walk-in Wardrobe", "Premium Bathroom", "Private Garden", "24/7 Security", "Concierge Service", "Smart Home"]',
        certification: "SHM",
        mainImage:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        galleryImages:
          '["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_600,h_400/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_1000,h_750/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_1200,h_900/sample.jpg"]',
        status: "active",
      },
      {
        name: "Penthouse Elite",
        slug: "penthouse-elite",
        salePrice: "2500000000",
        dimensions: "16m x 20m",
        landArea: "320",
        buildingArea: "280",
        description:
          "<p>Penthouse eksklusif dengan panoramic view dan private rooftop terrace. The epitome of luxury living dengan finishes dan materials berkualitas world-class.</p><p>Terrace dengan infinity pool pribadi, outdoor kitchen, dan lounge area. Home theater, wine cellar, dan gym pribadi melengkapi lifestyle yang sophisticated. Butler's pantry dan service elevator untuk convenience maksimal.</p>",
        bedrooms: "5",
        bathrooms: "5",
        carports: "3",
        floors: "3",
        facilities:
          '["Private Rooftop", "Infinity Pool", "Home Theater", "Wine Cellar", "Private Gym", "Outdoor Kitchen", "Butler Pantry", "Service Elevator", "Panoramic View", "Concierge Service"]',
        certification: "SHM",
        mainImage:
          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        galleryImages:
          '["https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_800,h_600/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_600,h_400/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_1000,h_750/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_1200,h_900/sample.jpg", "https://res.cloudinary.com/demo/image/upload/w_1400,h_1050/sample.jpg"]',
        status: "active",
      },
    ],
  },
];

async function migrateUnitsData() {
  console.log("📋 Units Data Migration to Turso Database");
  console.log("==========================================");

  // Check environment variables
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("❌ Missing required environment variables:");
    console.error("   - DATABASE_URL");
    console.error("   - DATABASE_AUTH_TOKEN");
    console.error("   Make sure these are set in your .env.local file");
    process.exit(1);
  }

  // Create Turso client
  const client = createClient({
    url: url,
    authToken: authToken,
  });

  try {
    console.log("🚀 Starting units data migration...");

    // Check if units table exists
    const tablesResult = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='units'"
    );

    if (!tablesResult.rows || tablesResult.rows.length === 0) {
      console.error(
        "❌ Units table tidak ditemukan. Jalankan migrate-units-table.js terlebih dahulu."
      );
      process.exit(1);
    }

    // Check current units in database
    const currentUnitsResult = await client.execute(
      "SELECT COUNT(*) as count FROM units"
    );
    const currentCount = currentUnitsResult.rows[0].count;
    console.log(`📊 Current units in database: ${currentCount}`);

    if (currentCount > 0) {
      console.log(
        "⚠️  Database sudah memiliki data units. Akan melanjutkan migrasi dengan ID yang unik."
      );
    }

    // Get all projects from database to map project_id
    const projectsResult = await client.execute(
      "SELECT id, slug, name FROM Project"
    );
    const projectsMap = {};

    if (projectsResult.rows) {
      projectsResult.rows.forEach((row) => {
        projectsMap[row.slug] = { id: row.id, name: row.name };
      });
    }

    console.log(
      "📋 Found projects in database:",
      Object.keys(projectsMap).map(
        (slug) => `${projectsMap[slug].name} (${slug})`
      )
    );

    let insertedCount = 0;
    let skippedCount = 0;

    // Process each project's units
    for (const projectData of mockUnitsData) {
      console.log(`\n📁 Processing project: ${projectData.projectSlug}`);

      const projectInfo = projectsMap[projectData.projectSlug];
      if (!projectInfo) {
        console.log(
          `⚠️  Project '${projectData.projectSlug}' tidak ditemukan di database. Skipping...`
        );
        continue;
      }

      console.log(
        `✓ Found project: ${projectInfo.name} (ID: ${projectInfo.id})`
      );

      for (const unit of projectData.units) {
        console.log(`  📄 Processing unit: ${unit.name}`);

        // Check if unit already exists
        const existingUnitResult = await client.execute(
          "SELECT id FROM units WHERE slug = ? AND project_id = ?",
          [unit.slug, projectInfo.id]
        );

        if (existingUnitResult.rows && existingUnitResult.rows.length > 0) {
          console.log(`    ⏭️  Unit '${unit.slug}' sudah ada. Skipping...`);
          skippedCount++;
          continue;
        }

        // Insert unit into database
        try {
          const result = await client.execute(
            `
            INSERT INTO units (
              name, slug, project_id, description, dimensions, 
              land_area, building_area, sale_price, bedrooms, 
              bathrooms, carports, floors, certification, 
              facilities, main_image, gallery_images, status, 
              created_at, updated_at
            ) VALUES (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 
              datetime('now'), datetime('now')
            )
            `,
            [
              unit.name,
              unit.slug,
              projectInfo.id,
              unit.description,
              unit.dimensions,
              unit.landArea,
              unit.buildingArea,
              unit.salePrice,
              unit.bedrooms || null,
              unit.bathrooms || null,
              unit.carports || null,
              unit.floors || null,
              unit.certification,
              unit.facilities, // Already JSON string
              unit.mainImage,
              unit.galleryImages, // Already JSON string
              unit.status || "active",
            ]
          );

          insertedCount++;
          console.log(
            `    ✅ Successfully inserted unit: ${unit.name} (ID: ${result.lastInsertRowid})`
          );
        } catch (error) {
          console.error(
            `    ❌ Error inserting unit ${unit.name}:`,
            error.message
          );
        }
      }
    }

    console.log("\n📊 Migration Summary:");
    console.log(`✅ Units berhasil ditambahkan: ${insertedCount}`);
    console.log(`⏭️  Units yang dilewati (sudah ada): ${skippedCount}`);
    console.log(`📋 Total units diproses: ${insertedCount + skippedCount}`);

    // Verify final count
    const finalCountResult = await client.execute(
      "SELECT COUNT(*) as count FROM units"
    );
    const finalCount = finalCountResult.rows[0].count;
    console.log(`🎯 Total units in database: ${finalCount}`);

    console.log("\n🎉 Units data migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error);
    process.exit(1);
  }
}

// Main execution
migrateUnitsData();
