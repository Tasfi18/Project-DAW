-- Add metrics and category columns to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '{}'::jsonb;
ALTER TABLE services ADD COLUMN IF NOT EXISTS category INT DEFAULT 1;

-- Add index on metrics for faster queries
CREATE INDEX IF NOT EXISTS idx_services_metrics ON services USING GIN (metrics);

-- Add index on category for filtering
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- Update existing services with sample metrics and categories
UPDATE services SET 
  metrics = '{"efficiency": "95%", "projects": "50+", "satisfaction": "98%"}'::jsonb,
  category = 1
WHERE slug = 'site-management-project-coordination';

UPDATE services SET 
  metrics = '{"quality": "A+", "suppliers": "100+", "savings": "30%"}'::jsonb,
  category = 2
WHERE slug = 'material-expertise-procurement-solutions';

UPDATE services SET 
  metrics = '{"experience": "15+ years", "success": "95%", "clients": "200+"}'::jsonb,
  category = 3
WHERE slug = 'technical-advisory-system-support';
