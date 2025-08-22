const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const db = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function migrateKanban() {
  try {
    console.log('🚀 Starting Kanban migration...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '../src/lib/kanban-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        await db.execute(statement.trim());
      }
    }
    
    console.log('✅ Kanban migration completed successfully!');
    
    // Verify tables were created
    const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'Kanban%'");
    console.log('📋 Created tables:', tables.rows.map(row => row.name));
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

migrateKanban();