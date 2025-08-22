-- Create HeroSlider table
CREATE TABLE IF NOT EXISTS HeroSlider (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  "order" INTEGER DEFAULT 0,
  isActive INTEGER DEFAULT 1,
  desktopImage TEXT NOT NULL,
  mobileImage TEXT NOT NULL,
  linkUrl TEXT,
  linkText TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now'))
);

-- Create WebsiteMenu table
CREATE TABLE IF NOT EXISTS WebsiteMenu (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT,
  "order" INTEGER DEFAULT 0,
  isActive INTEGER DEFAULT 1,
  parentId TEXT,
  isMegaMenu INTEGER DEFAULT 0,
  iconClass TEXT,
  description TEXT,
  createdAt TEXT DEFAULT (datetime('now')),
  updatedAt TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (parentId) REFERENCES WebsiteMenu(id) ON DELETE CASCADE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_website_menu_parent ON WebsiteMenu(parentId);
CREATE INDEX IF NOT EXISTS idx_website_menu_order ON WebsiteMenu("order");
CREATE INDEX IF NOT EXISTS idx_website_menu_active ON WebsiteMenu(isActive);

-- Contact Inquiry Table Schema
CREATE TABLE IF NOT EXISTS ContactInquiry (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  project_name TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  inquiry_type TEXT NOT NULL DEFAULT 'general',
  unit_slug TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_project ON ContactInquiry(project_id);
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_status ON ContactInquiry(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_created ON ContactInquiry(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_email ON ContactInquiry(email);
