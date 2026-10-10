import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService, adminSession, ContentSection, TeamMember, SDGGoal, ContactInfo, ContactMessage } from '../../services/api';
import { ServicesManager } from './ServicesManager';
import { WorkProcessManager } from './WorkProcessManager';
import { SoftwareManager } from './SoftwareManager';

// Component prop types
interface EditorProps {
  item: ContentSection;
  onSave: (type: string, id: string, updates: Partial<ContentSection> | Partial<TeamMember> | Partial<SDGGoal> | Partial<ContactInfo>) => void;
  saving: boolean;
}

interface TabProps {
  content: ContentSection[];
  onSave: (type: string, id: string, updates: Partial<ContentSection> | Partial<TeamMember> | Partial<SDGGoal> | Partial<ContactInfo>) => void;
  saving: boolean;
}

// Icons as simple SVG components
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  About: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Leadership: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  Services: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Process: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  Team: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Impact: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  Contact: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  Messages: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Save: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V2" /></svg>,
  Add: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Cancel: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
};

export const AdminPanel = () => {
  const [isAuth, setIsAuth] = useState(() => adminSession.get() !== null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // The password is checked by the server, which returns a session token.
      adminSession.set(await apiService.adminLogin(password));
      setIsAuth(true);
      setError('');
    } catch {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuth(false);
    adminSession.clear();
    navigate('/admin');
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Admin Access</h1>
            <p className="text-muted">Please enter your credentials to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="••••••••"
                autoFocus
              />
              {error && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                  {error}
                </motion.p>
              )}
            </div>
            <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-all font-medium">
              Access Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
};

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [content, setContent] = useState<ContentSection[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [sdg, setSdg] = useState<SDGGoal[]>([]);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [contentData, teamData, sdgData, contactData, messagesData] = await Promise.all([
        apiService.getContent(),
        apiService.getTeam(),
        apiService.getSDG(),
        apiService.getContact(),
        apiService.getMessages(),
      ]);
      setContent(contentData);
      setTeam(teamData);
      setSdg(sdgData);
      setContact(contactData);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error loading data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showNotification(`Error loading data: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSave = async (type: string, id: string, updates: Partial<ContentSection> | Partial<TeamMember> | Partial<SDGGoal> | Partial<ContactInfo>) => {
    setSaving(true);
    try {
      if (type === 'content') await apiService.updateContent(id, updates as Partial<ContentSection>);
      else if (type === 'team') await apiService.updateTeam(id, updates as Partial<TeamMember>);
      else if (type === 'sdg') await apiService.updateSDG(id, updates as Partial<SDGGoal>);
      else if (type === 'contact') await apiService.updateContact(id, updates as Partial<ContactInfo>);
      
      showNotification('✓ Changes saved successfully');
      await loadData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showNotification(`✗ Error saving changes: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiService.updateMessage(id, { is_read: true });
      setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
      showNotification('✓ Message marked as read');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showNotification(`✗ Error updating message: ${errorMessage}`);
    }
  };

  const tabs = [
    { key: 'home', label: 'Home', icon: Icons.Home, sections: ['hero_tagline'] },
    { key: 'about', label: 'About', icon: Icons.About, sections: ['introduction', 'vision', 'why_choose_us'] },
    { key: 'leadership', label: 'Leadership', icon: Icons.Leadership, sections: ['leader_message', 'ceo'] },
    { key: 'servicesmanager', label: 'Services', icon: Icons.Services, sections: [] },
    { key: 'softwaremanager', label: 'Software', icon: Icons.Services, sections: [] },
    { key: 'workprocess', label: 'Work Process', icon: Icons.Process, sections: [] },
    { key: 'team', label: 'Team', icon: Icons.Team, sections: [] },
    { key: 'impact', label: 'Impact', icon: Icons.Impact, sections: ['conclusion'] },
    { key: 'contact', label: 'Contact', icon: Icons.Contact, sections: [] },
    { key: 'messages', label: 'Messages', icon: Icons.Messages, sections: [], badge: messages.filter(m => !m.is_read).length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👼</span>
              <h1 className="text-xl font-bold gradient-text">Admin Dashboard</h1>
            </div>
            <div className="flex gap-3 items-center">
              <Link to="/" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors">
                <Icons.Eye /> View Site
              </Link>
              <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                <Icons.Logout /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Content Management</h2>
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      activeTab === tab.key 
                        ? 'bg-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon />
                    <span className="font-medium">{tab.label}</span>
                    {tab.badge ? (
                      <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${
                        activeTab === tab.key ? 'bg-white text-primary' : 'bg-primary text-white'
                      }`}>
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Notification */}
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

          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {tabs.find(t => t.key === activeTab)?.label} Page Content
            </h2>
            <p className="text-gray-600">
              Edit and manage your {tabs.find(t => t.key === activeTab)?.label.toLowerCase()} page content
            </p>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'home' && <HomeTab content={content} onSave={handleSave} saving={saving} />}
            {activeTab === 'about' && <AboutTab content={content} onSave={handleSave} saving={saving} />}
            {activeTab === 'leadership' && <LeadershipTab content={content} onSave={handleSave} saving={saving} />}
            {activeTab === 'servicesmanager' && <ServicesManager onNotify={showNotification} />}
            {activeTab === 'softwaremanager' && <SoftwareManager onNotify={showNotification} />}
            {activeTab === 'workprocess' && <WorkProcessManager />}
            {activeTab === 'team' && <TeamTab team={team} onSave={handleSave} saving={saving} />}
            {activeTab === 'impact' && <ImpactTab content={content} sdg={sdg} onSave={handleSave} saving={saving} />}
            {activeTab === 'contact' && <ContactTab contact={contact} onSave={handleSave} saving={saving} />}
            {activeTab === 'messages' && <MessagesTab messages={messages} onMarkAsRead={handleMarkAsRead} />}
          </div>
        </main>
      </div>
    </div>
  );
};

// Simplified content editor component with bilingual support
const ContentEditor = ({ item, onSave, saving }: EditorProps) => {
  const [data, setData] = useState(item);
  const [isEditing, setIsEditing] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'da'>('en');

  const handleSave = () => {
    void onSave('content', item.id, data);
    setIsEditing(false);
  };

  return (
    <motion.div layout className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {activeLanguage === 'en' ? data.title_en : data.title_da}
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
        >
          {isEditing ? <Icons.Cancel /> : '✏️'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          {/* Language Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeLanguage === 'en'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setActiveLanguage('da')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeLanguage === 'da'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🇩🇰 Danish
            </button>
          </div>

          {/* English Fields */}
          {activeLanguage === 'en' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  value={data.title_en}
                  onChange={e => setData({ ...data, title_en: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content (English)</label>
                {data.section_key === 'why_choose_us' && (
                  <p className="text-xs text-blue-600 mb-2">
                    💡 Tip: Each item on a new line. Format: <strong>Title: Description</strong>
                  </p>
                )}
                <textarea
                  value={data.content_en}
                  onChange={e => setData({ ...data, content_en: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </>
          )}

          {/* Danish Fields */}
          {activeLanguage === 'da' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titel (Dansk)</label>
                <input
                  type="text"
                  value={data.title_da}
                  onChange={e => setData({ ...data, title_da: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Indhold (Dansk)</label>
                {data.section_key === 'why_choose_us' && (
                  <p className="text-xs text-blue-600 mb-2">
                    💡 Tip: Hvert punkt på en ny linje. Format: <strong>Titel: Beskrivelse</strong>
                  </p>
                )}
                <textarea
                  value={data.content_da}
                  onChange={e => setData({ ...data, content_da: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </>
          )}

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <Icons.Save /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Language Toggle for Preview */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeLanguage === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveLanguage('da')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeLanguage === 'da' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              DA
            </button>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">
            {activeLanguage === 'en' ? data.content_en : data.content_da}
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Tab components (simplified for brevity - expand as needed)
const HomeTab = ({ content, onSave, saving }: TabProps) => (
  <div className="space-y-6">
    {content.filter((item) => item.section_key === 'hero_tagline').map((item) => 
      <ContentEditor key={item.id} item={item} onSave={onSave} saving={saving} />
    )}
  </div>
);

const AboutTab = ({ content, onSave, saving }: TabProps) => (
  <div className="space-y-8">
    <div className="space-y-6">
      {content.filter((item) => 
        item.section_key === 'introduction' || item.section_key === 'vision' || item.section_key === 'why_choose_us'
      ).map((item) => 
        <ContentEditor key={item.id} item={item} onSave={onSave} saving={saving} />
      )}
    </div>

    {/* How We Work Section */}
    <div className="mt-12 pt-8 border-t-2 border-gray-200">
      <div className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          How We Work Section
        </h3>
        <p className="text-gray-600">
          Manage the work process steps that appear on your About page. Define each step in your workflow with titles, descriptions, and visual elements.
        </p>
      </div>
      <WorkProcessManager />
    </div>
  </div>
);

const LeadershipTab = ({ content, onSave, saving }: TabProps) => (
  <div className="space-y-6">
    {content.filter((item) => 
      item.section_key === 'leader_message' || item.section_key === 'ceo'
    ).map((item) => 
      <ContentEditor key={item.id} item={item} onSave={onSave} saving={saving} />
    )}
  </div>
);

const TeamTab = ({ team, onSave, saving }: { 
  team: TeamMember[];
  onSave: (type: string, id: string, updates: Partial<TeamMember>) => Promise<void>;
  saving: boolean;
}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'da'>('en');
  const [newMember, setNewMember] = useState({ 
    name: '', 
    role_en: '', 
    role_da: '', 
    bio_en: '', 
    bio_da: '', 
    email: '', 
    phone: '', 
    image_url: '' 
  });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleCreate = async () => {
    if (!newMember.name || !newMember.role_en || !newMember.role_da) return;
    try {
      await apiService.createTeam({ 
        name: newMember.name,
        role_en: newMember.role_en,
        role_da: newMember.role_da,
        bio_en: newMember.bio_en || null,
        bio_da: newMember.bio_da || null,
        email: newMember.email || null,
        phone: newMember.phone || null,
        image_url: newMember.image_url || null,
        linkedin_url: null,
        display_order: team.length + 1
      });
      window.location.reload();
    } catch (error) {
      console.error('Failed to create team member:', error);
    }
  };

  const handleNewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setNewMember({ ...newMember, image_url: result.url });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          {showAdd ? <Icons.Cancel /> : <Icons.Add />}
          {showAdd ? 'Cancel' : 'Add New Team Member'}
        </button>
        
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
              <div className="flex items-center gap-4">
                {newMember.image_url && (
                  <img 
                    src={newMember.image_url} 
                    alt="Preview" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleNewImageUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 file:cursor-pointer"
                  />
                  {uploading && <p className="text-sm text-primary mt-1">Uploading...</p>}
                  {uploadError && <p className="text-sm text-red-500 mt-1">{uploadError}</p>}
                  <p className="text-xs text-gray-500 mt-1">Max 5MB • JPG, PNG, GIF</p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={newMember.name}
                onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
              />
            </div>
            
            {/* Language Tabs */}
            <div className="flex gap-2 border-b">
              <button
                type="button"
                onClick={() => setActiveLanguage('en')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeLanguage === 'en'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setActiveLanguage('da')}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeLanguage === 'da'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🇩🇰 Danish
              </button>
            </div>

            {/* English Fields */}
            {activeLanguage === 'en' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role (English) *</label>
                  <input
                    type="text"
                    value={newMember.role_en}
                    onChange={e => setNewMember({ ...newMember, role_en: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Senior Consultant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio (English)</label>
                  <textarea
                    value={newMember.bio_en}
                    onChange={e => setNewMember({ ...newMember, bio_en: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Brief description..."
                  />
                </div>
              </>
            )}

            {/* Danish Fields */}
            {activeLanguage === 'da' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rolle (Dansk) *</label>
                  <input
                    type="text"
                    value={newMember.role_da}
                    onChange={e => setNewMember({ ...newMember, role_da: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Senior konsulent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Dansk)</label>
                  <textarea
                    value={newMember.bio_da}
                    onChange={e => setNewMember({ ...newMember, bio_da: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Kort beskrivelse..."
                  />
                </div>
              </>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newMember.email}
                  onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={newMember.phone}
                  onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="+45 12 34 56 78"
                />
              </div>
            </div>
            <button onClick={() => void handleCreate()} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Create Team Member
            </button>
          </motion.div>
        )}
      </div>
      
      {team.map((member: TeamMember) => (
        <TeamMemberEditor 
          key={member.id} 
          member={member} 
          onSave={onSave} 
          saving={saving}
          isEditing={editingId === member.id}
          setIsEditing={(editing) => setEditingId(editing ? member.id : null)}
        />
      ))}
    </div>
  );
};

const TeamMemberEditor = ({ 
  member, 
  onSave, 
  saving, 
  isEditing, 
  setIsEditing 
}: {
  member: TeamMember;
  onSave: (type: string, id: string, data: Partial<TeamMember>) => Promise<void>;
  saving: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}) => {
  const [data, setData] = useState(member);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'da'>('en');

  const handleSave = () => {
    void onSave('team', member.id, data);
    setIsEditing(false);
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
      setData({ ...data, image_url: result.url });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div layout className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          {data.image_url && (
            <img 
              src={data.image_url} 
              alt={data.name} 
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">{data.name}</h3>
            <p className="text-primary">{activeLanguage === 'en' ? data.role_en : data.role_da}</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
        >
          {isEditing ? <Icons.Cancel /> : '✏️'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
            <div className="flex items-center gap-4">
              {data.image_url && (
                <img 
                  src={data.image_url} 
                  alt={data.name} 
                  className="w-24 h-24 rounded-full object-cover"
                />
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
                <p className="text-xs text-gray-500 mt-1">Max 5MB • JPG, PNG, GIF</p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={e => setData({ ...data, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Language Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeLanguage === 'en'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setActiveLanguage('da')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeLanguage === 'da'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🇩🇰 Danish
            </button>
          </div>

          {/* English Fields */}
          {activeLanguage === 'en' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role (English)</label>
                <input
                  type="text"
                  value={data.role_en}
                  onChange={e => setData({ ...data, role_en: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (English)</label>
                <textarea
                  value={data.bio_en || ''}
                  onChange={e => setData({ ...data, bio_en: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          {/* Danish Fields */}
          {activeLanguage === 'da' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rolle (Dansk)</label>
                <input
                  type="text"
                  value={data.role_da}
                  onChange={e => setData({ ...data, role_da: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Dansk)</label>
                <textarea
                  value={data.bio_da || ''}
                  onChange={e => setData({ ...data, bio_da: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={data.email || ''}
                onChange={e => setData({ ...data, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                value={data.phone || ''}
                onChange={e => setData({ ...data, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <Icons.Save /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Language Toggle for Preview */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeLanguage === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveLanguage('da')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeLanguage === 'da' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              DA
            </button>
          </div>
          {(activeLanguage === 'en' ? data.bio_en : data.bio_da) && (
            <p className="text-gray-600 mb-4">{activeLanguage === 'en' ? data.bio_en : data.bio_da}</p>
          )}
          <div className="flex gap-4 text-sm text-gray-500">
            {data.email && <span>📧 {data.email}</span>}
            {data.phone && <span>📱 {data.phone}</span>}
          </div>
        </>
      )}
    </motion.div>
  );
};

const ImpactTab = ({ content, sdg, onSave, saving }: { 
  content: ContentSection[];
  sdg: SDGGoal[];
  onSave: (type: string, id: string, updates: Partial<ContentSection> | Partial<SDGGoal>) => Promise<void>;
  saving: boolean;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {content.filter((item: ContentSection) => item.section_key === 'conclusion').map((item: ContentSection) => 
        <ContentEditor key={item.id} item={item} onSave={onSave} saving={saving} />
      )}
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Progress Indicators</h3>
        <div className="grid gap-4">
          {sdg.map((goal: SDGGoal) => (
            <SDGEditor 
              key={goal.id} 
              goal={goal} 
              onSave={onSave} 
              saving={saving}
              isEditing={editingId === goal.id}
              setIsEditing={(editing) => setEditingId(editing ? goal.id : null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SDGEditor = ({ 
  goal, 
  onSave, 
  saving, 
  isEditing, 
  setIsEditing 
}: {
  goal: SDGGoal;
  onSave: (type: string, id: string, data: Partial<SDGGoal>) => Promise<void>;
  saving: boolean;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}) => {
  const [data, setData] = useState(goal);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'da'>('en');

  const handleSave = () => {
    void onSave('sdg', goal.id, data);
    setIsEditing(false);
  };

  return (
    <motion.div layout className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.icon_name || '🎯'}</span>
          <h4 className="font-semibold">{activeLanguage === 'en' ? data.title_en : data.title_da}</h4>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
        >
          {isEditing ? <Icons.Cancel /> : '✏️'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
              <input
                type="text"
                value={data.icon_name || ''}
                onChange={e => setData({ ...data, icon_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="🎯"
              />
            </div>
          </div>

          {/* Language Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeLanguage === 'en'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              onClick={() => setActiveLanguage('da')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeLanguage === 'da'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              🇩🇰 Danish
            </button>
          </div>

          {/* English Fields */}
          {activeLanguage === 'en' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  value={data.title_en}
                  onChange={e => setData({ ...data, title_en: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                <textarea
                  value={data.description_en || ''}
                  onChange={e => setData({ ...data, description_en: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          {/* Danish Fields */}
          {activeLanguage === 'da' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titel (Dansk)</label>
                <input
                  type="text"
                  value={data.title_da}
                  onChange={e => setData({ ...data, title_da: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beskrivelse (Dansk)</label>
                <textarea
                  value={data.description_da || ''}
                  onChange={e => setData({ ...data, description_da: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progress: {data.progress_percentage}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={data.progress_percentage}
              onChange={e => setData({ ...data, progress_percentage: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <Icons.Save /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Language Toggle for Preview */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setActiveLanguage('en')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeLanguage === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setActiveLanguage('da')}
              className={`px-3 py-1 text-xs rounded-full ${
                activeLanguage === 'da' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              DA
            </button>
          </div>
          {(activeLanguage === 'en' ? data.description_en : data.description_da) && (
            <p className="text-gray-600 mb-3">{activeLanguage === 'en' ? data.description_en : data.description_da}</p>
          )}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: `${data.progress_percentage}%` }}></div>
            </div>
            <span className="text-sm font-medium">{data.progress_percentage}%</span>
          </div>
        </>
      )}
    </motion.div>
  );
};

const ContactTab = ({ contact, onSave, saving }: { 
  contact: ContactInfo | null;
  onSave: (type: string, id: string, updates: Partial<ContactInfo>) => Promise<void>;
  saving: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState(contact || {} as ContactInfo);

  useEffect(() => {
    if (contact && !isEditing && JSON.stringify(data) !== JSON.stringify(contact)) {
      setData(contact);
    }
  }, [contact, isEditing, data]);

  const handleSave = () => {
    if (contact) {
      void onSave('contact', contact.id, data);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">Contact Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors"
        >
          {isEditing ? <Icons.Cancel /> : '✏️'}
        </button>
      </div>
      
      {contact && (
        isEditing ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={e => setData({ ...data, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={e => setData({ ...data, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <textarea
                value={data.address}
                onChange={e => setData({ ...data, address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CVR Number</label>
              <input
                type="text"
                value={data.cvr_number || ''}
                onChange={e => setData({ ...data, cvr_number: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">🇧🇩 Bangladesh Office Address</label>
              <textarea
                value={data.country_office_address || ''}
                onChange={e => setData({ ...data, country_office_address: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Gollamari, Khulna University, Khulna, Bangladesh"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                <Icons.Save /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="font-medium">{contact.address}</p>
            </div>
            {contact.cvr_number && (
              <div>
                <p className="text-sm text-gray-500 mb-1">CVR Number</p>
                <p className="font-medium">{contact.cvr_number}</p>
              </div>
            )}
            {contact.country_office_address && (
              <div>
                <p className="text-sm text-gray-500 mb-1">🇧🇩 Bangladesh Office</p>
                <p className="font-medium">{contact.country_office_address}</p>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

const MessagesTab = ({ messages, onMarkAsRead }: { 
  messages: ContactMessage[];
  onMarkAsRead: (id: string) => Promise<void>;
}) => (
  <div className="space-y-4">
    {messages.length === 0 ? (
      <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
        <p className="text-gray-500">No messages yet</p>
      </div>
    ) : (
      messages.map((msg: ContactMessage) => (
        <motion.div 
          key={msg.id} 
          layout
          className={`bg-white rounded-xl shadow-sm border p-6 ${!msg.is_read ? 'border-primary' : ''}`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">{msg.name}</h3>
              <p className="text-sm text-gray-500">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
              {!msg.is_read && (
                <button
                  onClick={() => void onMarkAsRead(msg.id)}
                  className="px-3 py-1 bg-primary text-white text-xs rounded-full hover:bg-primary/90"
                >
                  Mark Read
                </button>
              )}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
          </div>
        </motion.div>
      ))
    )}
  </div>
);
