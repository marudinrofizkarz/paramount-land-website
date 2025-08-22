-- Contact Inquiry Table Schema
CREATE TABLE IF NOT EXISTS ContactInquiry (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  project_name TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  inquiry_type TEXT NOT NULL DEFAULT 'general', -- general, unit_specific, pricing, visit
  unit_slug TEXT, -- optional, for unit-specific inquiries
  status TEXT NOT NULL DEFAULT 'new', -- new, contacted, closed
  source TEXT NOT NULL DEFAULT 'website', -- website, mobile, etc
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (project_id) REFERENCES Project(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_project ON ContactInquiry(project_id);
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_status ON ContactInquiry(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_created ON ContactInquiry(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_inquiry_email ON ContactInquiry(email);