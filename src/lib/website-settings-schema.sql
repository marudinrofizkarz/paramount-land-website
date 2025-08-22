-- Website Settings Table Schema
CREATE TABLE IF NOT EXISTS WebsiteSettings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  -- Site Identity
  siteTitle TEXT NOT NULL DEFAULT 'Paramount Land',
  siteDescription TEXT DEFAULT 'Premium Property Developer',
  siteFavicon TEXT, -- URL to favicon
  
  -- Logo Settings
  logoLight TEXT, -- URL to light mode logo
  logoDark TEXT, -- URL to dark mode logo
  logoFooter TEXT, -- URL to footer logo (optional)
  
  -- Contact Information
  address TEXT,
  phoneNumber TEXT,
  whatsappNumber TEXT,
  email TEXT,
  
  -- Social Media Links
  facebookUrl TEXT,
  instagramUrl TEXT,
  twitterUrl TEXT,
  linkedinUrl TEXT,
  youtubeUrl TEXT,
  tiktokUrl TEXT,
  
  -- SEO Settings
  metaKeywords TEXT,
  metaAuthor TEXT DEFAULT 'Paramount Land',
  ogImage TEXT, -- Open Graph image
  
  -- Footer Settings
  copyrightText TEXT DEFAULT '© 2024 Paramount Land. All rights reserved.',
  footerDescription TEXT,
  
  -- Additional Settings
  googleAnalyticsId TEXT,
  googleTagManagerId TEXT,
  facebookPixelId TEXT,
  
  -- Business Hours
  businessHours TEXT, -- JSON format for flexible hours
  
  -- Maintenance Mode
  maintenanceMode INTEGER DEFAULT 0,
  maintenanceMessage TEXT,
  
  -- Timestamps
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Insert default settings
INSERT OR IGNORE INTO WebsiteSettings (id, siteTitle, siteDescription) 
VALUES ('main', 'Paramount Land', 'Premium Property Developer');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_website_settings_id ON WebsiteSettings(id);