import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, SoftwareProduct } from '../../services/api';

interface SoftwareManagerProps {
  onNotify: (message: string) => void;
}

const Icons = {
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" /></svg>,
  Add: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Delete: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Cancel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  EyeOff: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>,
};

const emptySoftware: Omit<SoftwareProduct, 'id' | 'created_at' | 'updated_at'> = {
  slug: '',
  name_en: '',
  name_da: '',
  description_en: '',
  description_da: '',
  category: 1,
  features_en: [],
  features_da: [],
  tech_stack: [],
  image_url: null,
  display_order: 0,
  is_active: true,
};

const categoryOptions = [
  { value: 1, label: 'Energy Management Systems', icon: '⚡' },
  { value: 2, label: 'Smart Grid Software', icon: '🔌' },
  { value: 3, label: 'Energy System Modeling', icon: '📊' },
  { value: 4, label: 'Simulation Software', icon: '🏗️' },
  { value: 5, label: 'Demand Response', icon: '📉' },
  { value: 6, label: 'Blockchain & P2P', icon: '🔗' },
  { value: 7, label: 'Carbon Tracking', icon: '🌍' },
  { value: 8, label: 'Virtual Energy', icon: '💻' },
  { value: 9, label: 'Quantum Computing', icon: '⚛️' },
];

export const SoftwareManager = ({ onNotify }: SoftwareManagerProps) => {
  const [products, setProducts] = useState<SoftwareProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<SoftwareProduct, 'id' | 'created_at' | 'updated_at'>>(emptySoftware);
  const [newFeatureEn, setNewFeatureEn] = useState('');
  const [newFeatureDa, setNewFeatureDa] = useState('');

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await apiService.getSoftwareAdmin();
      setProducts(data.sort((a, b) => a.display_order - b.display_order));
    } catch (error) {
      onNotify('❌ Error loading software: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onNotify('❌ Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onNotify('❌ Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const { url } = await apiService.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      onNotify('✅ Image uploaded successfully');
    } catch (error) {
      onNotify('❌ Error uploading image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.slug) formData.slug = generateSlug(formData.name_en);
    
    try {
      if (editingId) {
        await apiService.updateSoftware(editingId, formData);
        onNotify('✅ Software updated successfully');
      } else {
        await apiService.createSoftware(formData);
        onNotify('✅ Software created successfully');
      }
      setIsCreating(false);
      setEditingId(null);
      setFormData(emptySoftware);
      loadProducts();
    } catch (error) {
      onNotify('❌ Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEdit = (product: SoftwareProduct) => {
    setFormData({
      slug: product.slug,
      name_en: product.name_en,
      name_da: product.name_da,
      description_en: product.description_en,
      description_da: product.description_da,
      category: product.category,
      features_en: product.features_en,
      features_da: product.features_da,
      tech_stack: product.tech_stack,
      image_url: product.image_url,
      display_order: product.display_order,
      is_active: product.is_active,
    });
    setEditingId(product.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this software?')) return;
    
    try {
      await apiService.deleteSoftware(id);
      onNotify('✅ Software deleted successfully');
      loadProducts();
    } catch (error) {
      onNotify('❌ Error deleting software: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const toggleActive = async (product: SoftwareProduct) => {
    try {
      await apiService.updateSoftware(product.id, { is_active: !product.is_active });
      onNotify(`✅ Software ${!product.is_active ? 'activated' : 'deactivated'}`);
      loadProducts();
    } catch (error) {
      onNotify('❌ Error updating status');
    }
  };

  const addFeature = () => {
    if (newFeatureEn.trim() && newFeatureDa.trim()) {
      setFormData(prev => ({
        ...prev,
        features_en: [...prev.features_en, newFeatureEn.trim()],
        features_da: [...prev.features_da, newFeatureDa.trim()],
      }));
      setNewFeatureEn('');
      setNewFeatureDa('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features_en: prev.features_en.filter((_, i) => i !== index),
      features_da: prev.features_da.filter((_, i) => i !== index),
    }));
  };



  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Software Products Manager</h2>
        <button
          onClick={() => { setIsCreating(true); setEditingId(null); setFormData(emptySoftware); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Icons.Add /> Add Software
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
              <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Create'} Software Product</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.name_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name (Danish)</label>
                  <input
                    type="text"
                    required
                    value={formData.name_da}
                    onChange={(e) => setFormData(prev => ({ ...prev, name_da: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {categoryOptions.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description (English)</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description_en}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description (Danish)</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description_da}
                    onChange={(e) => setFormData(prev => ({ ...prev, description_da: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="space-y-2">
                  {formData.features_en.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                      <span className="flex-1 text-sm">🇬🇧 {feature}</span>
                      <span className="flex-1 text-sm">🇩🇰 {formData.features_da[idx]}</span>
                      <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 hover:text-red-700">
                        <Icons.Delete />
                      </button>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="New feature (EN)"
                      value={newFeatureEn}
                      onChange={(e) => setNewFeatureEn(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="New feature (DA)"
                      value={newFeatureDa}
                      onChange={(e) => setNewFeatureDa(e.target.value)}
                      className="px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <button type="button" onClick={addFeature} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                    Add Feature
                  </button>
                </div>
              </div>



              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 h-20 object-cover rounded" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <Icons.Save /> Save
                </button>
                <button
                  type="button"
                  onClick={() => { setIsCreating(false); setEditingId(null); setFormData(emptySoftware); }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  <Icons.Cancel /> Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{product.name_en}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">
                    {categoryOptions.find(c => c.value === product.category)?.icon} {categoryOptions.find(c => c.value === product.category)?.label}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(product)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                      product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {product.is_active ? <Icons.Eye /> : <Icons.EyeOff />}
                    {product.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800">
                      <Icons.Edit />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">
                      <Icons.Delete />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
