-- Create work_process_steps table for "How We Work" section
CREATE TABLE IF NOT EXISTS work_process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  step_number INT NOT NULL,
  title_en VARCHAR(200) NOT NULL,
  title_da VARCHAR(200) NOT NULL,
  icon_emoji VARCHAR(10) NOT NULL,
  icon_color VARCHAR(50) NOT NULL,
  items_en TEXT[] NOT NULL DEFAULT '{}',
  items_da TEXT[] NOT NULL DEFAULT '{}',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_work_process_steps_display_order ON work_process_steps(display_order);
CREATE INDEX IF NOT EXISTS idx_work_process_steps_active ON work_process_steps(is_active);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_work_process_steps_updated_at
  BEFORE UPDATE ON work_process_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO work_process_steps (step_number, title_en, title_da, icon_emoji, icon_color, items_en, items_da, display_order) VALUES
(
  1,
  'Discovery & Assessment',
  'Opdagelse og vurdering',
  '🔍',
  'blue',
  ARRAY[
    'Comprehensive analysis of your current energy infrastructure and sustainability goals',
    'Evaluate existing systems, identify inefficiencies, and assess upgrade opportunities',
    'Define project scope, timeline, and success metrics aligned with your business objectives'
  ],
  ARRAY[
    'Omfattende analyse af din nuværende energiinfrastruktur og bæredygtighedsmål',
    'Evaluer eksisterende systemer, identificer ineffektivitet og vurder opgraderingsmuligheder',
    'Definer projektomfang, tidsplan og succesmålinger i overensstemmelse med dine forretningsmål'
  ],
  1
),
(
  2,
  'Strategic Planning',
  'Strategisk planlægning',
  '💡',
  'purple',
  ARRAY[
    'Develop customized solutions tailored to your specific energy and technology needs',
    'Design implementation roadmap with clear milestones and deliverables',
    'Ensure compliance with international standards and local regulations'
  ],
  ARRAY[
    'Udvikle skræddersyede løsninger tilpasset dine specifikke energi- og teknologibehov',
    'Design implementeringskøreplanen med klare milepæle og leverancer',
    'Sikre overholdelse af internationale standarder og lokale regler'
  ],
  2
),
(
  3,
  'Implementation & Integration',
  'Implementering og integration',
  '⚙️',
  'green',
  ARRAY[
    'Deploy cutting-edge energy solutions with minimal disruption to your operations',
    'Integrate new systems seamlessly with your existing infrastructure',
    'Provide comprehensive technical documentation and hands-on training for your team'
  ],
  ARRAY[
    'Implementer avancerede energiløsninger med minimal forstyrrelse af dine operationer',
    'Integrer nye systemer problemfrit med din eksisterende infrastruktur',
    'Lever omfattende teknisk dokumentation og praktisk træning til dit team'
  ],
  3
),
(
  4,
  'Monitoring & Optimization',
  'Overvågning og optimering',
  '📊',
  'orange',
  ARRAY[
    'Continuous performance monitoring through advanced analytics and real-time data',
    'Regular maintenance and system optimization to ensure peak efficiency',
    'Ongoing support and knowledge transfer to empower your team for long-term success'
  ],
  ARRAY[
    'Kontinuerlig præstationsovervågning gennem avanceret analyse og realtidsdata',
    'Regelmæssig vedligeholdelse og systemoptimering for at sikre maksimal effektivitet',
    'Løbende support og vidensoverførsel for at styrke dit team til langsigtet succes'
  ],
  4
);
