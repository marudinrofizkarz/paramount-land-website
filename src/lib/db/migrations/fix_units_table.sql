-- Fix units table schema with correct foreign key reference

-- Drop the existing units table if it exists
DROP TABLE IF EXISTS units;

-- Create the correct units table with proper foreign key
CREATE TABLE IF NOT EXISTS units (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  project_id TEXT NOT NULL,  -- Changed from INTEGER to TEXT to match Project.id
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
  FOREIGN KEY (project_id) REFERENCES Project (id) ON DELETE CASCADE  -- Correct table name and data type
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_units_project_id ON units (project_id);
CREATE INDEX IF NOT EXISTS idx_units_slug ON units (slug);
