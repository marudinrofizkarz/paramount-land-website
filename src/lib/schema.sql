-- Landing Pages Table Schema
CREATE TABLE IF NOT EXISTS LandingPages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  content JSON NOT NULL, -- Store the drag & drop components as JSON
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  template_type TEXT DEFAULT 'custom', -- custom, real-estate, property, general
  target_audience TEXT, -- for ad targeting
  campaign_source TEXT, -- google-ads, facebook-ads, tiktok-ads, etc
  tracking_code TEXT, -- for analytics and conversion tracking
  settings JSON, -- Additional settings like theme, colors, etc
  published_at TEXT,
  expires_at TEXT, -- Optional expiry date for campaigns
  created_by TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Landing Page Components Table (for reusable components)
CREATE TABLE IF NOT EXISTS LandingPageComponents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- hero, form, testimonial, features, cta, etc
  config JSON NOT NULL, -- Component configuration
  preview_image TEXT,
  is_system INTEGER DEFAULT 0, -- System components vs user created
  created_by TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Landing Page Analytics Table (for tracking performance)
CREATE TABLE IF NOT EXISTS LandingPageAnalytics (
  id TEXT PRIMARY KEY,
  landing_page_id TEXT NOT NULL,
  visit_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  source TEXT, -- google, facebook, direct, etc
  device_type TEXT, -- mobile, desktop, tablet
  date TEXT NOT NULL, -- YYYY-MM-DD format
  created_at TEXT DEFAULT (datetime('now')),
  
  FOREIGN KEY (landing_page_id) REFERENCES LandingPages(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_landing_pages_slug ON LandingPages(slug);
CREATE INDEX IF NOT EXISTS idx_landing_pages_status ON LandingPages(status);
CREATE INDEX IF NOT EXISTS idx_landing_pages_created_by ON LandingPages(created_by);
CREATE INDEX IF NOT EXISTS idx_landing_pages_campaign_source ON LandingPages(campaign_source);
CREATE INDEX IF NOT EXISTS idx_landing_page_analytics_page_date ON LandingPageAnalytics(landing_page_id, date);
CREATE INDEX IF NOT EXISTS idx_landing_page_components_type ON LandingPageComponents(type);

-- Insert default components
INSERT OR IGNORE INTO LandingPageComponents (id, name, type, config, is_system) VALUES 
('hero-1', 'Hero Section - Property Focus', 'hero', '{
  "title": "Find Your Dream Property",
  "subtitle": "Discover premium properties with exclusive offers",
  "backgroundImage": "/images/hero-bg.svg",
  "ctaText": "Explore Now",
  "ctaAction": "scroll-to-form",
  "overlay": true,
  "textAlign": "center"
}', 1),

('form-1', 'Contact Form - Property Inquiry', 'form', '{
  "title": "Get More Information",
  "fields": [
    {"name": "name", "type": "text", "label": "Full Name", "required": true},
    {"name": "email", "type": "email", "label": "Email Address", "required": true},
    {"name": "phone", "type": "tel", "label": "Phone Number", "required": true},
    {"name": "property_type", "type": "select", "label": "Property Interest", "options": ["Apartment", "House", "Commercial"], "required": false},
    {"name": "budget", "type": "select", "label": "Budget Range", "options": ["< 1M", "1M - 3M", "3M - 5M", "> 5M"], "required": false},
    {"name": "message", "type": "textarea", "label": "Additional Message", "required": false}
  ],
  "submitText": "Submit Inquiry",
  "successMessage": "Thank you! We will contact you soon.",
  "style": "modern"
}', 1),

('features-1', 'Features Grid - Property Benefits', 'features', '{
  "title": "Why Choose Our Properties",
  "features": [
    {"icon": "map-pin", "title": "Prime Location", "description": "Strategic locations near business districts and transportation"},
    {"icon": "shield-check", "title": "Legal Guarantee", "description": "Complete legal documentation and certificates"},
    {"icon": "home", "title": "Ready to Live", "description": "Move-in ready properties with modern facilities"},
    {"icon": "trending-up", "title": "Investment Value", "description": "High potential for property value appreciation"}
  ],
  "layout": "grid",
  "columns": 2
}', 1),

('testimonial-1', 'Customer Testimonials', 'testimonial', '{
  "title": "What Our Customers Say",
  "testimonials": [
    {"name": "Sarah Johnson", "position": "Property Owner", "content": "Excellent service and beautiful property. Highly recommended!", "avatar": "/images/testimonial-1.svg", "rating": 5},
    {"name": "Michael Chen", "position": "Investor", "content": "Great investment opportunity with professional support.", "avatar": "/images/testimonial-2.svg", "rating": 5},
    {"name": "Amanda Smith", "position": "First-time Buyer", "content": "Smooth process from viewing to closing. Very satisfied!", "avatar": "/images/testimonial-3.svg", "rating": 5}
  ],
  "layout": "carousel",
  "autoPlay": true
}', 1),

('cta-1', 'Call to Action - Contact Us', 'cta', '{
  "title": "Ready to Find Your Dream Property?",
  "subtitle": "Contact us today for exclusive offers and personalized service",
  "primaryButton": {"text": "Contact Now", "action": "scroll-to-form"},
  "secondaryButton": {"text": "View Properties", "action": "external", "url": "/projects"},
  "backgroundColor": "primary",
  "textColor": "white"
}', 1);
