import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  phone: string | null;
  email: string | null;
  linkedin_url: string | null;
  display_order: number;
  created_at: string;
}

export interface SDGGoal {
  id: string;
  title: string;
  description: string | null;
  progress_percentage: number;
  icon_name: string | null;
  display_order: number;
  created_at: string;
}

export interface PerformanceIndicator {
  id: string;
  key_indicator: string;
  activity: string;
  data_outcome: string;
  display_order: number;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  cvr_number: string | null;
  created_at: string;
  updated_at: string;
}
