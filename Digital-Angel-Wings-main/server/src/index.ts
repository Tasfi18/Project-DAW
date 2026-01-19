import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { supabase } from './supabase.js';

dotenv.config();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Type definitions for request bodies
interface ContentSectionInput {
  section_key: string;
  title: string;
  content: string;
  language?: string;
}

interface TeamMemberInput {
  name: string;
  role: string;
  bio?: string;
  email?: string;
  phone?: string;
  image_url?: string | null;
  linkedin_url?: string | null;
  display_order: number;
}

interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

interface ContactInfoInput {
  phone?: string;
  email?: string;
  address?: string;
  cvr_number?: string;
}

interface SDGGoalInput {
  title?: string;
  description?: string;
  icon_name?: string;
  progress_percentage?: number;
}

interface MessageUpdateInput {
  is_read?: boolean;
}

interface ServiceInput {
  slug: string;
  title_en: string;
  title_da: string;
  description_en: string;
  description_da: string;
  features_en: string[];
  features_da: string[];
  metrics?: Record<string, string>;
  icon_name?: string;
  image_url?: string | null;
  category?: number;
  display_order?: number;
  is_active?: boolean;
}

interface WorkProcessStepInput {
  step_number: number;
  title_en: string;
  title_da: string;
  icon_emoji: string;
  icon_color: string;
  items_en: string[];
  items_da: string[];
  display_order?: number;
  is_active?: boolean;
}

interface SoftwareProductInput {
  slug: string;
  name_en: string;
  name_da: string;
  description_en: string;
  description_da: string;
  category: number;
  features_en: string[];
  features_da: string[];
  tech_stack?: string[];
  image_url?: string | null;
  display_order?: number;
  is_active?: boolean;
}

interface CountryOfficeInput {
  country_name_en: string;
  country_name_da: string;
  country_code: string;
  city_en: string;
  city_da: string;
  address: string;
  phone?: string;
  email?: string;
  is_headquarters?: boolean;
  display_order?: number;
  is_active?: boolean;
}

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// API endpoints
app.get('/api/content', async (req, res) => {
  try {
    const { data, error } = await supabase.from('content_sections').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/team', async (req, res) => {
  try {
    const { data, error } = await supabase.from('team_members').select('*').order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/sdg', async (req, res) => {
  try {
    const { data, error } = await supabase.from('sdg_goals').select('*').order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/performance', async (req, res) => {
  try {
    const { data, error } = await supabase.from('performance_indicators').select('*').order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Public services endpoint - only returns active services
app.get('/api/services', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Admin services endpoint - returns ALL services regardless of is_active status
app.get('/api/services/admin', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Public work process steps endpoint - only returns active steps
app.get('/api/work-process', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('work_process_steps')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Admin work process steps endpoint - returns ALL steps regardless of is_active status
app.get('/api/work-process/admin', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('work_process_steps')
      .select('*')
      .order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Software products endpoints
app.get('/api/software', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('software_products')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/software/admin', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('software_products')
      .select('*')
      .order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Country offices endpoints
app.get('/api/country-offices', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('country_offices')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/country-offices/admin', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('country_offices')
      .select('*')
      .order('display_order');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/contact', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .limit(1);
    
    if (error) throw error;
    
    // Return the first record if exists, otherwise null
    res.json(data && data.length > 0 ? data[0] : null);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

app.get('/api/contact/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Image upload endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `service-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    res.json({ url: publicUrl });
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Create endpoints
app.post('/api/content', async (req: Request<object, object, ContentSectionInput>, res) => {
  try {
    const body = req.body as ContentSectionInput;
    const { data, error } = await supabase
      .from('content_sections')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/team', async (req: Request<object, object, TeamMemberInput>, res) => {
  try {
    const body = req.body as TeamMemberInput;
    const { data, error } = await supabase
      .from('team_members')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/services', async (req: Request<object, object, ServiceInput>, res) => {
  try {
    const body = req.body as ServiceInput;
    const { data, error } = await supabase
      .from('services')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/work-process', async (req: Request<object, object, WorkProcessStepInput>, res) => {
  try {
    const body = req.body as WorkProcessStepInput;
    const { data, error } = await supabase
      .from('work_process_steps')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/software', async (req: Request<object, object, SoftwareProductInput>, res) => {
  try {
    const body = req.body as SoftwareProductInput;
    const { data, error } = await supabase
      .from('software_products')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/country-offices', async (req: Request<object, object, CountryOfficeInput>, res) => {
  try {
    const body = req.body as CountryOfficeInput;
    const { data, error } = await supabase
      .from('country_offices')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/contact/messages', async (req: Request<object, object, ContactMessageInput>, res) => {
  try {
    const body = req.body as ContactMessageInput;
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Update endpoints
app.put('/api/content/:id', async (req: Request<{ id: string }, object, Partial<ContentSectionInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<ContentSectionInput>;
    const { data, error } = await supabase
      .from('content_sections')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/team/:id', async (req: Request<{ id: string }, object, Partial<TeamMemberInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<TeamMemberInput>;
    const { data, error } = await supabase
      .from('team_members')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/sdg/:id', async (req: Request<{ id: string }, object, Partial<SDGGoalInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<SDGGoalInput>;
    const { data, error } = await supabase
      .from('sdg_goals')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/services/:id', async (req: Request<{ id: string }, object, Partial<ServiceInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<ServiceInput>;
    const { data, error } = await supabase
      .from('services')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/work-process/:id', async (req: Request<{ id: string }, object, Partial<WorkProcessStepInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<WorkProcessStepInput>;
    const { data, error } = await supabase
      .from('work_process_steps')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/software/:id', async (req: Request<{ id: string }, object, Partial<SoftwareProductInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<SoftwareProductInput>;
    const { data, error } = await supabase
      .from('software_products')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/country-offices/:id', async (req: Request<{ id: string }, object, Partial<CountryOfficeInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<CountryOfficeInput>;
    const { data, error } = await supabase
      .from('country_offices')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/contact/:id', async (req: Request<{ id: string }, object, Partial<ContactInfoInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<ContactInfoInput>;
    const { data, error } = await supabase
      .from('contact_info')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/services/:id', async (req: Request<{ id: string }>, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/work-process/:id', async (req: Request<{ id: string }>, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('work_process_steps')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/software/:id', async (req: Request<{ id: string }>, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('software_products')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.delete('/api/country-offices/:id', async (req: Request<{ id: string }>, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('country_offices')
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.put('/api/contact/messages/:id', async (req: Request<{ id: string }, object, Partial<MessageUpdateInput>>, res) => {
  try {
    const { id } = req.params;
    const body = req.body as Partial<MessageUpdateInput>;
    const { data, error } = await supabase
      .from('contact_messages')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
