import axios from 'axios';

// Use environment variable or empty string (relative URLs for production)
const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Admin session token, issued by the server after the admin password is checked.
const TOKEN_KEY = 'adminToken';

export const adminSession = {
  get: (): string | null => sessionStorage.getItem(TOKEN_KEY),
  set: (token: string) => sessionStorage.setItem(TOKEN_KEY, token),
  clear: () => sessionStorage.removeItem(TOKEN_KEY),
};

api.interceptors.request.use((config) => {
  const token = adminSession.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the session has expired, sign out so the login screen is shown again.
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && adminSession.get()) {
      adminSession.clear();
      window.location.assign('/admin');
    }
    return Promise.reject(error);
  },
);

export interface ContentSection {
  id: string;
  section_key: string;
  title_en: string;
  title_da: string;
  content_en: string;
  content_da: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role_en: string;
  role_da: string;
  bio_en: string | null;
  bio_da: string | null;
  image_url: string | null;
  phone: string | null;
  email: string | null;
  linkedin_url: string | null;
  display_order: number;
  created_at: string;
}

export interface SDGGoal {
  id: string;
  title_en: string;
  title_da: string;
  description_en: string | null;
  description_da: string | null;
  progress_percentage: number;
  icon_name: string | null;
  display_order: number;
  created_at: string;
}

export interface PerformanceIndicator {
  id: string;
  key_indicator_en: string;
  key_indicator_da: string;
  activity_en: string;
  activity_da: string;
  data_outcome_en: string;
  data_outcome_da: string;
  display_order: number;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  phone: string;
  email: string;
  address: string;
  cvr_number: string | null;
  country_office_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title_en: string;
  title_da: string;
  description_en: string;
  description_da: string;
  features_en: string[];
  features_da: string[];
  metrics: Record<string, string>;
  icon_name: string | null;
  image_url: string | null;
  category: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkProcessStep {
  id: string;
  step_number: number;
  title_en: string;
  title_da: string;
  icon_emoji: string;
  icon_color: string;
  items_en: string[];
  items_da: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SoftwareProduct {
  id: string;
  slug: string;
  name_en: string;
  name_da: string;
  description_en: string;
  description_da: string;
  category: number;
  features_en: string[];
  features_da: string[];
  tech_stack: string[];
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const apiService = {
  adminLogin: (password: string) =>
    api.post<{ token: string }>('/api/admin/login', { password }).then(res => res.data.token),

  getContent: () => api.get<ContentSection[]>('/api/content').then(res => res.data),
  getTeam: () => api.get<TeamMember[]>('/api/team').then(res => res.data),
  getSDG: () => api.get<SDGGoal[]>('/api/sdg').then(res => res.data),
  getPerformance: () => api.get<PerformanceIndicator[]>('/api/performance').then(res => res.data),
  getContact: () => api.get<ContactInfo>('/api/contact').then(res => res.data),
  getMessages: () => api.get<ContactMessage[]>('/api/contact/messages').then(res => res.data),
  getServices: () => api.get<Service[]>('/api/services').then(res => res.data),
  getServicesAdmin: () => api.get<Service[]>('/api/services/admin').then(res => res.data),
  getWorkProcess: () => api.get<WorkProcessStep[]>('/api/work-process').then(res => res.data),
  getWorkProcessAdmin: () => api.get<WorkProcessStep[]>('/api/work-process/admin').then(res => res.data),
  
  // Update methods
  updateContent: (id: string, data: Partial<ContentSection>) => 
    api.put<ContentSection>(`/api/content/${id}`, data).then(res => res.data),
  updateTeam: (id: string, data: Partial<TeamMember>) => 
    api.put<TeamMember>(`/api/team/${id}`, data).then(res => res.data),
  updateSDG: (id: string, data: Partial<SDGGoal>) => 
    api.put<SDGGoal>(`/api/sdg/${id}`, data).then(res => res.data),
  updateContact: (id: string, data: Partial<ContactInfo>) => 
    api.put<ContactInfo>(`/api/contact/${id}`, data).then(res => res.data),
  updateMessage: (id: string, data: Partial<ContactMessage>) => 
    api.put<ContactMessage>(`/api/contact/messages/${id}`, data).then(res => res.data),
  updateService: (id: string, data: Partial<Service>) => 
    api.put<Service>(`/api/services/${id}`, data).then(res => res.data),
  updateWorkProcess: (id: string, data: Partial<WorkProcessStep>) => 
    api.put<WorkProcessStep>(`/api/work-process/${id}`, data).then(res => res.data),
  
  // Create methods
  createContent: (data: Omit<ContentSection, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<ContentSection>('/api/content', data).then(res => res.data),
  createTeam: (data: Omit<TeamMember, 'id' | 'created_at'>) => 
    api.post<TeamMember>('/api/team', data).then(res => res.data),
  createMessage: (data: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>) => 
    api.post<ContactMessage>('/api/contact/messages', data).then(res => res.data),
  createService: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Service>('/api/services', data).then(res => res.data),
  createWorkProcess: (data: Omit<WorkProcessStep, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<WorkProcessStep>('/api/work-process', data).then(res => res.data),
  deleteService: (id: string) => 
    api.delete(`/api/services/${id}`).then(res => res.data),
  deleteWorkProcess: (id: string) => 
    api.delete(`/api/work-process/${id}`).then(res => res.data),
  
  // Software products
  getSoftware: () => api.get<SoftwareProduct[]>('/api/software').then(res => res.data),
  getSoftwareAdmin: () => api.get<SoftwareProduct[]>('/api/software/admin').then(res => res.data),
  createSoftware: (data: Omit<SoftwareProduct, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<SoftwareProduct>('/api/software', data).then(res => res.data),
  updateSoftware: (id: string, data: Partial<SoftwareProduct>) => 
    api.put<SoftwareProduct>(`/api/software/${id}`, data).then(res => res.data),
  deleteSoftware: (id: string) => 
    api.delete(`/api/software/${id}`).then(res => res.data),
  
  // Image upload
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ url: string }>('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data);
  },
};
