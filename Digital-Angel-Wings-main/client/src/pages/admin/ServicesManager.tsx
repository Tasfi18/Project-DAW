import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, Service } from '../../services/api';

interface ServicesManagerProps {
  onNotify: (message: string) => void;
}

const Icons = {
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" /></svg>,
  Add: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Delete: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Cancel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Up: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  Down: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
  Info: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const emptyService: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
  slug: '',
  title_en: '',
  title_da: '',
  description_en: '',
  description_da: '',
  features_en: [],
  features_da: [],
  metrics: {},
  icon_name: 'technology',
  image_url: null,
  category: 1,
  display_order: 0,
  is_active: true,
};

// User-friendly icon labels
const iconOptions = [
  { value: 'sustainable', label: '🌱 Energy & Sustainability', icon: '🌱' },
  { value: 'technology', label: '💻 Technology & Innovation', icon: '💻' },
  { value: 'knowledge', label: '📚 Training & Knowledge', icon: '📚' },
  { value: 'partnership', label: '🤝 Partnership & Collaboration', icon: '🤝' },
];

// User-friendly category labels
const categoryOptions = [
  { value: 1, label: 'Energy Solutions', color: 'bg-green-100 text-green-700', icon: '⚡' },
  { value: 2, label: 'Technology Services', color: 'bg-blue-100 text-blue-700', icon: '🔧' },
  { value: 3, label: 'Partnership Programs', color: 'bg-purple-100 text-purple-700', icon: '🤝' },
];

export const ServicesManager = ({ onNotify }: ServicesManagerProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id' | 'created_at' | 'updated_at'>>(emptyService);
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [newFeatureDa, setNewFeatureDa] = useState('');
  const [newMetricKey, setNewMetricKey] = useState('');
  const [newMetricValue, setNewMetricValue] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      // Use admin endpoint to get ALL services (including hidden ones)
      const data = await apiService.getServicesAdmin();
      setServices(data.sort((a, b) => a.display_order - b.display_order));
    } catch (error) {
      onNotify('❌ Error loading services: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const result = await apiService.uploadImage(file);
      setFormData({ ...formData, image_url: result.url });
      onNotify('✅ Image uploaded successfully!');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
      onNotify('❌ Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      ...emptyService,
      display_order: services.length,
    });
  };

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      slug: service.slug,
      title_en: service.title_en,
      title_da: service.title_da,
      description_en: service.description_en,
      description_da: service.description_da,
      features_en: service.features_en,
      features_da: service.features_da,
      metrics: service.metrics || {},
      icon_name: service.icon_name,
      image_url: service.image_url,
      category: service.category,
      display_order: service.display_order,
      is_active: service.is_active,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData(emptyService);
    setNewFeatureEn('');
    setNewFeatureDa('');
    setNewMetricKey('');
    setNewMetricValue('');
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title_en.trim() || !formData.title_da.trim()) {
      onNotify('❌ Please enter service titles in both languages');
      return;
    }
    if (!formData.description_en.trim() || !formData.description_da.trim()) {
      onNotify('❌ Please enter descriptions in both languages');
      return;
    }
    if (!formData.slug.trim()) {
      onNotify('❌ Please enter a page address');
      return;
    }

    try {
      if (isCreating) {
        await apiService.createService(formData);
        onNotify('✅ Service created successfully!');
      } else if (editingId) {
        await apiService.updateService(editingId, formData);
        onNotify('✅ Service updated successfully!');
      }
      handleCancel();
      await loadServices();
    } catch (error) {
      onNotify('❌ Error saving service: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;
    
    try {
      await apiService.deleteService(id);
      onNotify('✅ Service deleted successfully');
      await loadServices();
    } catch (error) {
      onNotify('❌ Error deleting service: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await apiService.updateService(service.id, { is_active: !service.is_active });
      onNotify(`✅ Service ${!service.is_active ? 'published' : 'hidden'} successfully`);
      await loadServices();
    } catch (error) {
      onNotify('❌ Error updating service: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = services.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === services.length - 1)) return;

    const newServices = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];

    try {
      await Promise.all([
        apiService.updateService(newServices[index].id, { display_order: index }),
        apiService.updateService(newServices[targetIndex].id, { display_order: targetIndex }),
      ]);
      await loadServices();
      onNotify('✅ Service order updated');
    } catch (error) {
      onNotify('❌ Error reordering: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const addFeature = (lang: 'en' | 'da') => {
    const newFeature = lang === 'en' ? newFeatureEn : newFeatureDa;
    if (!newFeature.trim()) return;

    setFormData({
      ...formData,
      [`features_${lang}`]: [...formData[`features_${lang}`], newFeature.trim()],
    });
    
    if (lang === 'en') setNewFeatureEn('');
    else setNewFeatureDa('');
  };

  const removeFeature = (lang: 'en' | 'da', index: number) => {
    setFormData({
      ...formData,
      [`features_${lang}`]: formData[`features_${lang}`].filter((_, i) => i !== index),
    });
  };

  const addMetric = () => {
    if (!newMetricKey.trim() || !newMetricValue.trim()) return;

    setFormData({
      ...formData,
      metrics: { ...formData.metrics, [newMetricKey.trim()]: newMetricValue.trim() },
    });
    setNewMetricKey('');
    setNewMetricValue('');
  };

  const removeMetric = (key: string) => {
    const newMetrics = { ...formData.metrics };
    delete newMetrics[key];
    setFormData({ ...formData, metrics: newMetrics });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Services</h2>
          <p className="text-gray-600">Create and edit the services displayed on your website</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            <Icons.Add />
            Add New Service
          </button>
        )}
      </div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(isCreating || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-xl shadow-lg border-2 border-primary p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {isCreating ? '✨ Create New Service' : '✏️ Edit Service'}
              </h3>
              <span className="text-sm text-gray-500">All fields marked with * are required</span>
            </div>
            
            <div className="space-y-8">
              {/* Section 1: Basic Settings */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  ⚙️ Basic Settings
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Page Address */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📌 Page Address (URL) *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., energy-consulting"
                    />
                    <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                      <Icons.Info />
                      <span>This creates the web address: yoursite.com/services/<strong>{formData.slug || 'your-service-name'}</strong></span>
                    </p>
                    {formData.title_en && (
                      <button
                        onClick={() => setFormData({ ...formData, slug: generateSlug(formData.title_en) })}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        💡 Auto-generate from English title
                      </button>
                    )}
                  </div>
                  
                  {/* Icon Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🎨 Service Icon *
                    </label>
                    <select
                      value={formData.icon_name || 'technology'}
                      onChange={e => setFormData({ ...formData, icon_name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Choose an icon that represents this service</p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📁 Service Type *
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      {categoryOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.icon} {opt.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Categorize this service for easier filtering</p>
                  </div>

                  {/* Visibility Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      👁️ Visibility Status
                    </label>
                    <div className="flex items-center gap-3 mt-3 bg-white rounded-lg p-4 border border-gray-200">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                        className="w-6 h-6 text-primary focus:ring-primary rounded"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-800">
                          {formData.is_active ? '✅ Published (visible on website)' : '🔒 Hidden (draft mode)'}
                        </span>
                        <p className="text-xs text-gray-500">Toggle to show or hide this service from visitors</p>
                      </div>
                    </div>
                  </div>

                  {/* Service Image Upload (Optional) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🖼️ Service Image (Optional)
                    </label>
                    <div className="flex items-center gap-4">
                      {formData.image_url && (
                        <div className="relative group">
                          <img 
                            src={formData.image_url} 
                            alt="Service preview" 
                            className="w-32 h-32 rounded-lg object-cover border-2 border-primary/20"
                          />
                          <button
                            onClick={() => setFormData({ ...formData, image_url: null })}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100"
                            title="Delete image"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                        />
                        {uploading && <p className="text-sm text-primary mt-1">Uploading...</p>}
                        {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
                        <p className="text-xs text-gray-500 mt-1">Max 5MB • JPG, PNG, GIF • Leave empty for icon-only display</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Service Names */}
              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📝 Service Names (Both Languages Required)
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🇬🇧 English Service Name *
                    </label>
                    <input
                      type="text"
                      value={formData.title_en}
                      onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., Energy Consulting Services"
                    />
                    <p className="text-xs text-gray-500 mt-1">The main headline visitors will see</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🇩🇰 Danish Service Name *
                    </label>
                    <input
                      type="text"
                      value={formData.title_da}
                      onChange={e => setFormData({ ...formData, title_da: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="f.eks. Energirådgivningstjenester"
                    />
                    <p className="text-xs text-gray-500 mt-1">Samme overskrift på dansk</p>
                  </div>
                </div>
              </div>

              {/* Section 3: Descriptions */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📄 Service Descriptions
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🇬🇧 English Description *
                    </label>
                    <textarea
                      value={formData.description_en}
                      onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Describe what this service offers, who it's for, and how it helps customers..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Write 2-3 sentences explaining this service</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🇩🇰 Danish Description *
                    </label>
                    <textarea
                      value={formData.description_da}
                      onChange={e => setFormData({ ...formData, description_da: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Beskriv hvad denne service tilbyder, hvem den er til, og hvordan den hjælper kunder..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Skriv 2-3 sætninger der forklarer denne service</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Key Features */}
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  ✨ Key Features (What Makes This Service Special)
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* English Features */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🇬🇧 English Features
                    </label>
                    <div className="space-y-2 mb-3">
                      {formData.features_en.length === 0 ? (
                        <p className="text-sm text-gray-500 italic p-3 bg-white rounded border border-dashed">
                          No features added yet. Add your first feature below.
                        </p>
                      ) : (
                        formData.features_en.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-200 group hover:border-primary transition-colors">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span className="flex-1 text-sm">{feature}</span>
                            <button
                              onClick={() => removeFeature('en', index)}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove this feature"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeatureEn}
                        onChange={e => setNewFeatureEn(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature('en'))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                        placeholder="e.g., 24/7 customer support"
                      />
                      <button
                        onClick={() => addFeature('en')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-1"
                        title="Add feature"
                      >
                        <Icons.Add /> Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">💡 Tip: List 4-6 key benefits or features</p>
                  </div>

                  {/* Danish Features */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🇩🇰 Danish Features
                    </label>
                    <div className="space-y-2 mb-3">
                      {formData.features_da.length === 0 ? (
                        <p className="text-sm text-gray-500 italic p-3 bg-white rounded border border-dashed">
                          Ingen funktioner tilføjet endnu. Tilføj din første funktion nedenfor.
                        </p>
                      ) : (
                        formData.features_da.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-200 group hover:border-primary transition-colors">
                            <span className="text-green-600 mt-0.5">✓</span>
                            <span className="flex-1 text-sm">{feature}</span>
                            <button
                              onClick={() => removeFeature('da', index)}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Fjern denne funktion"
                            >
                              ✕
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFeatureDa}
                        onChange={e => setNewFeatureDa(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature('da'))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                        placeholder="f.eks. 24/7 kundesupport"
                      />
                      <button
                        onClick={() => addFeature('da')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-1"
                        title="Tilføj funktion"
                      >
                        <Icons.Add /> Tilføj
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">💡 Tip: List 4-6 vigtigste fordele eller funktioner</p>
                  </div>
                </div>
              </div>

              {/* Section 5: Performance Stats */}
              <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📊 Performance Statistics (Optional)
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Add impressive numbers that showcase your service's success (e.g., "95% Efficiency", "500+ Projects")
                </p>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {Object.entries(formData.metrics).length === 0 ? (
                    <div className="col-span-full p-4 bg-white rounded-lg border border-dashed text-center text-gray-500 text-sm">
                      No statistics added yet. Add your first stat below to showcase your success!
                    </div>
                  ) : (
                    Object.entries(formData.metrics).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between gap-3 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20 group hover:shadow-md transition-shadow">
                        <div className="flex-1">
                          <div className="text-xs text-gray-600 font-medium uppercase tracking-wide">
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="font-bold text-2xl text-primary mt-1">{value}</div>
                        </div>
                        <button
                          onClick={() => removeMetric(key)}
                          className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                          title="Remove this stat"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newMetricKey}
                    onChange={e => setNewMetricKey(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    placeholder="Stat name (e.g., Success Rate)"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMetricValue}
                      onChange={e => setNewMetricValue(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addMetric())}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                      placeholder="Value (e.g., 95%)"
                    />
                    <button
                      onClick={addMetric}
                      className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-1"
                      title="Add statistic"
                    >
                      <Icons.Add /> Add
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">💡 Examples: "Efficiency: 95%", "Projects: 500+", "Clients: 1000+"</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg text-lg font-semibold"
                >
                  <Icons.Save />
                  {isCreating ? '✨ Create Service' : '💾 Save Changes'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services List */}
      {!isCreating && !editingId && (
        <div className="space-y-4">
          {services.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-gray-600 text-lg mb-6">No services created yet</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-md"
              >
                <Icons.Add />
                Create Your First Service
              </button>
            </div>
          ) : (
            services.map((service, index) => {
              const category = categoryOptions.find(c => c.value === service.category);
              return (
                <motion.div
                  key={service.id}
                  layout
                  className={`bg-white rounded-xl shadow-md border p-6 transition-all hover:shadow-lg ${
                    !service.is_active ? 'opacity-60 border-dashed' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-800">{service.title_en}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${category?.color}`}>
                          {category?.icon} {category?.label}
                        </span>
                        {!service.is_active && (
                          <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-semibold">
                            🔒 Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{service.description_en}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          📌 <strong>/{service.slug}</strong>
                        </span>
                        <span>•</span>
                        <span>✨ {service.features_en.length} features</span>
                        <span>•</span>
                        <span>📊 {Object.keys(service.metrics).length} stats</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Reorder buttons */}
                      <div className="flex flex-col gap-1 mr-2">
                        <button
                          onClick={() => handleReorder(service.id, 'up')}
                          disabled={index === 0}
                          className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move up"
                        >
                          <Icons.Up />
                        </button>
                        <button
                          onClick={() => handleReorder(service.id, 'down')}
                          disabled={index === services.length - 1}
                          className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          title="Move down"
                        >
                          <Icons.Down />
                        </button>
                      </div>
                      
                      {/* Action buttons */}
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                        title="Edit service"
                      >
                        <Icons.Edit />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                        title="Delete service"
                      >
                        <Icons.Delete />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
