const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

// Fungsi untuk membaca file .env
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

async function checkCircularReferences() {
  try {
    console.log("Checking for circular references in website menu...");

    const env = readEnvFile();
    const dbUrl = env.DATABASE_URL;
    const authToken = env.DATABASE_AUTH_TOKEN;

    if (!dbUrl || !authToken) {
      console.error(
        "DATABASE_URL dan DATABASE_AUTH_TOKEN harus diisi di file .env.local"
      );
      process.exit(1);
    }

    const db = createClient({
      url: dbUrl,
      authToken: authToken,
    });

    // Get all menus
    const result = await db.execute(
      "SELECT id, title, parentId FROM WebsiteMenu ORDER BY title"
    );

    if (!result.rows || result.rows.length === 0) {
      console.log("No website menus found.");
      return;
    }

    const menus = result.rows.map((row) => ({
      id: row.id || row[0],
      title: row.title || row[1],
      parentId: row.parentId || row[2],
    }));

    console.log(`Found ${menus.length} menu items`);

    // Check for circular references
    const circularMenus = [];

    for (const menu of menus) {
      if (hasCircularReference(menu.id, menu.parentId, menus)) {
        circularMenus.push(menu);
      }
    }

    if (circularMenus.length > 0) {
      console.log("🚨 CIRCULAR REFERENCES FOUND:");
      circularMenus.forEach((menu) => {
        console.log(
          `- ${menu.title} (ID: ${menu.id}, Parent: ${menu.parentId})`
        );
      });
    } else {
      console.log("✅ No circular references found");
    }

    // Also check for self-referencing menus
    const selfReferencingMenus = menus.filter(
      (menu) => menu.id === menu.parentId
    );
    if (selfReferencingMenus.length > 0) {
      console.log("🚨 SELF-REFERENCING MENUS FOUND:");
      selfReferencingMenus.forEach((menu) => {
        console.log(`- ${menu.title} (ID: ${menu.id})`);
      });
    }

    console.log("\nMenu hierarchy:");
    printMenuTree(menus);
  } catch (error) {
    console.error("Error checking circular references:", error);
  }
}

function hasCircularReference(menuId, parentId, menus) {
  if (!parentId) return false;

  const visited = new Set([menuId]);
  let currentParentId = parentId;

  while (currentParentId) {
    if (visited.has(currentParentId)) {
      return true; // Circular reference found
    }

    visited.add(currentParentId);

    const parent = menus.find((m) => m.id === currentParentId);
    currentParentId = parent?.parentId || null;
  }

  return false;
}

function printMenuTree(menus, parentId = null, indent = 0) {
  const children = menus.filter((menu) => menu.parentId === parentId);

  children.forEach((menu) => {
    console.log(" ".repeat(indent * 2) + `- ${menu.title} (ID: ${menu.id})`);
    printMenuTree(menus, menu.id, indent + 1);
  });
}

checkCircularReferences()
  .then(() => {
    console.log("Check completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
