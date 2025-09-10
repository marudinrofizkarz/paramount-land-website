const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

async function setupKanbanDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  if (!dbUrl || !authToken) {
    console.error("❌ Database credentials not found in environment variables");
    process.exit(1);
  }

  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  try {
    console.log("🚀 Setting up Kanban database...");

    // Read and execute kanban schema
    const schemaPath = path.join(__dirname, "../sql/kanban_schema.sql");
    const schema = fs.readFileSync(schemaPath, "utf8");

    // Split by semicolon and execute each statement
    const statements = schema
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      await client.execute(statement);
    }

    console.log("✅ Kanban database setup completed successfully!");

    // Verify setup by checking tables
    const boards = await client.execute(
      "SELECT COUNT(*) as count FROM KanbanBoards"
    );
    const columns = await client.execute(
      "SELECT COUNT(*) as count FROM KanbanColumns"
    );
    const tasks = await client.execute(
      "SELECT COUNT(*) as count FROM KanbanTasks"
    );

    console.log(`📊 Database status:`);
    console.log(`   - Boards: ${boards.rows[0].count}`);
    console.log(`   - Columns: ${columns.rows[0].count}`);
    console.log(`   - Tasks: ${tasks.rows[0].count}`);
  } catch (error) {
    console.error("❌ Error setting up Kanban database:", error);
    process.exit(1);
  }
}

// Run the setup
setupKanbanDatabase();
