-- Schema for Project table
CREATE TABLE IF NOT EXISTS Project (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning',
  units INTEGER NOT NULL,
  startingPrice TEXT NOT NULL,
  maxPrice TEXT,
  completion INTEGER NOT NULL DEFAULT 0,
  mainImage TEXT NOT NULL,
  galleryImages TEXT,  -- JSON array of image URLs
  brochureUrl TEXT,
  youtubeLink TEXT,
  advantages TEXT,  -- JSON array of strings
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);
