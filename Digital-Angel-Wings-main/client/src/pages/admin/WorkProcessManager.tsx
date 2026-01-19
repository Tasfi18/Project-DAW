import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, WorkProcessStep } from '../../services/api';

const Icons = {
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" /></svg>,
  Add: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Delete: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Cancel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Up: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>,
  Down: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  Eye: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
  Info: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

const emptyStep: Omit<WorkProcessStep, 'id' | 'created_at' | 'updated_at'> = {
  step_number: 1,
  title_en: '',
  title_da: '',
  icon_emoji: '✨',
  icon_color: '#3b82f6',
  items_en: [],
  items_da: [],
  display_order: 0,
  is_active: true,
};

const colorOptions = [
  { value: '#3b82f6', label: 'Blue', preview: 'bg-blue-500' },
  { value: '#10b981', label: 'Green', preview: 'bg-green-500' },
  { value: '#f59e0b', label: 'Orange', preview: 'bg-orange-500' },
  { value: '#8b5cf6', label: 'Purple', preview: 'bg-purple-500' },
  { value: '#ef4444', label: 'Red', preview: 'bg-red-500' },
  { value: '#ec4899', label: 'Pink', preview: 'bg-pink-500' },
  { value: '#14b8a6', label: 'Teal', preview: 'bg-teal-500' },
];

export const WorkProcessManager = () => {
  const [steps, setSteps] = useState<WorkProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<WorkProcessStep, 'id' | 'created_at' | 'updated_at'>>(emptyStep);
  const [newItemEn, setNewItemEn] = useState('');
  const [newItemDa, setNewItemDa] = useState('');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    loadSteps();
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const loadSteps = async () => {
    try {
      const data = await apiService.getWorkProcessAdmin();
      setSteps(data.sort((a, b) => a.display_order - b.display_order));
    } catch (error) {
      showNotification('❌ Error loading work process steps: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      ...emptyStep,
      step_number: steps.length + 1,
      display_order: steps.length,
    });
  };

  const handleEdit = (step: WorkProcessStep) => {
    setEditingId(step.id);
    setFormData({
      step_number: step.step_number,
      title_en: step.title_en,
      title_da: step.title_da,
      icon_emoji: step.icon_emoji,
      icon_color: step.icon_color,
      items_en: step.items_en,
      items_da: step.items_da,
      display_order: step.display_order,
      is_active: step.is_active,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData(emptyStep);
    setNewItemEn('');
    setNewItemDa('');
  };

  const handleSave = async () => {
    if (!formData.title_en.trim() || !formData.title_da.trim()) {
      showNotification('❌ Please enter step titles in both languages');
      return;
    }
    if (!formData.icon_emoji.trim()) {
      showNotification('❌ Please select an icon emoji');
      return;
    }

    try {
      if (isCreating) {
        await apiService.createWorkProcess(formData);
        showNotification('✅ Work process step created successfully!');
      } else if (editingId) {
        await apiService.updateWorkProcess(editingId, formData);
        showNotification('✅ Work process step updated successfully!');
      }
      handleCancel();
      await loadSteps();
    } catch (error) {
      showNotification('❌ Error saving step: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this step? This action cannot be undone.')) return;
    
    try {
      await apiService.deleteWorkProcess(id);
      showNotification('✅ Work process step deleted successfully');
      await loadSteps();
    } catch (error) {
      showNotification('❌ Error deleting step: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleToggleActive = async (step: WorkProcessStep) => {
    try {
      await apiService.updateWorkProcess(step.id, { is_active: !step.is_active });
      showNotification(`✅ Step ${!step.is_active ? 'published' : 'hidden'} successfully`);
      await loadSteps();
    } catch (error) {
      showNotification('❌ Error updating step: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === steps.length - 1)) return;

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];

    try {
      await Promise.all([
        apiService.updateWorkProcess(newSteps[index].id, { display_order: index }),
        apiService.updateWorkProcess(newSteps[targetIndex].id, { display_order: targetIndex }),
      ]);
      await loadSteps();
      showNotification('✅ Step order updated');
    } catch (error) {
      showNotification('❌ Error reordering: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const addItem = (lang: 'en' | 'da') => {
    const newItem = lang === 'en' ? newItemEn : newItemDa;
    if (!newItem.trim()) return;

    setFormData({
      ...formData,
      [`items_${lang}`]: [...formData[`items_${lang}`], newItem.trim()],
    });
    
    if (lang === 'en') setNewItemEn('');
    else setNewItemDa('');
  };

  const removeItem = (lang: 'en' | 'da', index: number) => {
    setFormData({
      ...formData,
      [`items_${lang}`]: formData[`items_${lang}`].filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading work process...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 bg-white shadow-lg rounded-lg px-6 py-3 border-l-4 border-green-500 z-50"
          >
            <p className="font-medium">{notification}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Work Process</h2>
          <p className="text-gray-600">Define the steps in your work process workflow</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
          >
            <Icons.Add />
            Add New Step
          </button>
        )}
      </div>

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
                {isCreating ? '✨ Create New Step' : '✏️ Edit Step'}
              </h3>
              <span className="text-sm text-gray-500">All fields marked with * are required</span>
            </div>
            
            <div className="space-y-8">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  ⚙️ Basic Settings
                </h4>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📌 Step Number *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.step_number}
                      onChange={e => setFormData({ ...formData, step_number: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <p className="text-xs text-gray-500 mt-1">The numeric order of this step</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      😀 Icon Emoji *
                    </label>
                    <input
                      type="text"
                      value={formData.icon_emoji}
                      onChange={e => setFormData({ ...formData, icon_emoji: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-2xl"
                      placeholder="✨"
                      maxLength={2}
                    />
                    <p className="text-xs text-gray-500 mt-1">Choose an emoji to represent this step</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🎨 Icon Background Color *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          onClick={() => setFormData({ ...formData, icon_color: color.value })}
                          className={`w-full h-12 rounded-lg ${color.preview} ${
                            formData.icon_color === color.value 
                              ? 'ring-4 ring-gray-800 ring-offset-2' 
                              : 'hover:ring-2 ring-gray-400'
                          } transition-all`}
                          title={color.label}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Background color for the step icon</p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    👁️ Visibility Status
                  </label>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-200">
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
                      <p className="text-xs text-gray-500">Toggle to show or hide this step from visitors</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📝 Step Titles (Both Languages Required)
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🇬🇧 English Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title_en}
                      onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g., Initial Consultation"
                    />
                    <p className="text-xs text-gray-500 mt-1">The main headline for this step</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      🇩🇰 Danish Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title_da}
                      onChange={e => setFormData({ ...formData, title_da: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="f.eks. Initial konsultation"
                    />
                    <p className="text-xs text-gray-500 mt-1">Samme overskrift på dansk</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  📋 Step Details (What Happens in This Step)
                </h4>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🇬🇧 English Details
                    </label>
                    <div className="space-y-2 mb-3">
                      {formData.items_en.length === 0 ? (
                        <p className="text-sm text-gray-500 italic p-3 bg-white rounded border border-dashed">
                          No details added yet. Add your first item below.
                        </p>
                      ) : (
                        formData.items_en.map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-200 group hover:border-primary transition-colors">
                            <span className="text-primary mt-0.5">•</span>
                            <span className="flex-1 text-sm">{item}</span>
                            <button
                              onClick={() => removeItem('en', index)}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove this item"
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
                        value={newItemEn}
                        onChange={e => setNewItemEn(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addItem('en'))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                        placeholder="e.g., Discuss project requirements"
                      />
                      <button
                        onClick={() => addItem('en')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-1"
                        title="Add item"
                      >
                        <Icons.Add /> Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">💡 Tip: List 3-5 key activities in this step</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      🇩🇰 Danish Details
                    </label>
                    <div className="space-y-2 mb-3">
                      {formData.items_da.length === 0 ? (
                        <p className="text-sm text-gray-500 italic p-3 bg-white rounded border border-dashed">
                          Ingen detaljer tilføjet endnu. Tilføj dit første element nedenfor.
                        </p>
                      ) : (
                        formData.items_da.map((item, index) => (
                          <div key={index} className="flex items-start gap-2 p-3 bg-white rounded-lg border border-gray-200 group hover:border-primary transition-colors">
                            <span className="text-primary mt-0.5">•</span>
                            <span className="flex-1 text-sm">{item}</span>
                            <button
                              onClick={() => removeItem('da', index)}
                              className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Fjern dette element"
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
                        value={newItemDa}
                        onChange={e => setNewItemDa(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addItem('da'))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                        placeholder="f.eks. Diskuter projektkrav"
                      />
                      <button
                        onClick={() => addItem('da')}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-1"
                        title="Tilføj element"
                      >
                        <Icons.Add /> Tilføj
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">💡 Tip: List 3-5 vigtigste aktiviteter i dette trin</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-lg text-lg font-semibold"
                >
                  <Icons.Save />
                  {isCreating ? '✨ Create Step' : '💾 Save Changes'}
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

      {!isCreating && !editingId && (
        <div className="space-y-4">
          {steps.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 text-lg mb-6">No work process steps created yet</p>
              <button
                onClick={handleCreate}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 shadow-md"
              >
                <Icons.Add />
                Create Your First Step
              </button>
            </div>
          ) : (
            steps.map((step, index) => (
              <motion.div
                key={step.id}
                layout
                className={`bg-white rounded-xl shadow-md border p-6 transition-all hover:shadow-lg ${
                  !step.is_active ? 'opacity-60 border-dashed' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: step.icon_color }}
                    >
                      {step.icon_emoji}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded">
                          Step {step.step_number}
                        </span>
                        <h3 className="text-xl font-bold text-gray-800">{step.title_en}</h3>
                        {!step.is_active && (
                          <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-semibold">
                            🔒 Hidden
                          </span>
                        )}
                      </div>
                      <ul className="space-y-1 text-sm text-gray-600 mb-2">
                        {step.items_en.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-3">
                        <span>📋 {step.items_en.length} details</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1 mr-2">
                      <button
                        onClick={() => handleReorder(step.id, 'up')}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <Icons.Up />
                      </button>
                      <button
                        onClick={() => handleReorder(step.id, 'down')}
                        disabled={index === steps.length - 1}
                        className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <Icons.Down />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleToggleActive(step)}
                      className={`p-2 rounded transition-colors ${
                        step.is_active 
                          ? 'hover:bg-gray-100 text-gray-600' 
                          : 'hover:bg-green-50 text-green-600'
                      }`}
                      title={step.is_active ? 'Hide step' : 'Publish step'}
                    >
                      <Icons.Eye />
                    </button>
                    <button
                      onClick={() => handleEdit(step)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                      title="Edit step"
                    >
                      <Icons.Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(step.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded transition-colors"
                      title="Delete step"
                    >
                      <Icons.Delete />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
