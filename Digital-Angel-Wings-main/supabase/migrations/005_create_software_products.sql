-- Create software_products table
CREATE TABLE IF NOT EXISTS software_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  
  -- Bilingual content
  name_en VARCHAR(200) NOT NULL,
  name_da VARCHAR(200) NOT NULL,
  description_en TEXT NOT NULL,
  description_da TEXT NOT NULL,
  
  -- Category (1-9 for the 9 software types)
  category INT NOT NULL CHECK (category BETWEEN 1 AND 9),
  
  -- Features
  features_en TEXT[] NOT NULL DEFAULT '{}',
  features_da TEXT[] NOT NULL DEFAULT '{}',
  
  -- Technical details
  tech_stack TEXT[] DEFAULT '{}',
  
  -- Media
  image_url TEXT,
  
  -- Metadata
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_software_products_slug ON software_products(slug);
CREATE INDEX idx_software_products_category ON software_products(category);
CREATE INDEX idx_software_products_is_active ON software_products(is_active);

-- Update trigger
CREATE TRIGGER update_software_products_updated_at
  BEFORE UPDATE ON software_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
