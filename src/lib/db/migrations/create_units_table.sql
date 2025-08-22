-- Units Table Schema

CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  project_id INTEGER NOT NULL,
  description TEXT NOT NULL,
  dimensions TEXT NOT NULL,
  land_area TEXT NOT NULL,
  building_area TEXT NOT NULL,
  sale_price TEXT NOT NULL,
  bedrooms TEXT,
  bathrooms TEXT,
  carports TEXT,
  floors TEXT,
  certification TEXT NOT NULL,
  facilities TEXT,
  main_image TEXT NOT NULL,
  gallery_images TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_units_project_id ON units (project_id);
CREATE INDEX IF NOT EXISTS idx_units_slug ON units (slug);
