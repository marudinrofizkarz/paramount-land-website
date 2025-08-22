const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });

// Use the correct environment variables
const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function migrateNews() {
  try {
    console.log('Creating news table...');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        content TEXT,
        category TEXT NOT NULL,
        featured_image TEXT,
        bg_color TEXT DEFAULT 'bg-gradient-to-br from-primary/20 to-primary/5',
        is_published BOOLEAN DEFAULT false,
        published_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Creating indexes...');
    
    await client.execute('CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug)');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_news_published ON news(is_published)');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_news_category ON news(category)');
    await client.execute('CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at)');
    
    console.log('News table and indexes created successfully!');
    
    // Insert sample data
    console.log('Inserting sample news data...');
    
    const sampleNews = [
      {
        id: crypto.randomUUID(),
        title: 'Paramount Land Launches New Sustainable Development Initiative',
        slug: 'paramount-land-launches-new-sustainable-development-initiative',
        description: 'We are proud to announce our commitment to sustainable development with new eco-friendly building standards across all our projects.',
        content: 'Detailed content about the sustainable development initiative...',
        category: 'Company News',
        bg_color: 'bg-gradient-to-br from-primary/20 to-primary/5',
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        title: 'New Residential Complex Opens in Jakarta',
        slug: 'new-residential-complex-opens-in-jakarta',
        description: 'Our latest residential development featuring modern amenities and sustainable design is now open for residents.',
        content: 'Detailed content about the new residential complex...',
        category: 'Development',
        bg_color: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5',
        is_published: true,
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    
    for (const news of sampleNews) {
      await client.execute({
        sql: `INSERT INTO news (id, title, slug, description, content, category, bg_color, is_published, published_at, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          news.id,
          news.title,
          news.slug,
          news.description,
          news.content,
          news.category,
          news.bg_color,
          news.is_published,
          news.published_at,
          news.created_at,
          news.updated_at,
        ],
      });
    }
    
    console.log('Sample news data inserted successfully!');
    
  } catch (error) {
    console.error('Error migrating news:', error);
  } finally {
    await client.close();
  }
}

migrateNews();