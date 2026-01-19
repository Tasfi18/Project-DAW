import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export const LeaderMessage = () => {
  const { language } = useLanguage();
  const { data: contentSections, loading } = useApi(apiService.getContent);
  const { data: team } = useApi(apiService.getTeam);

  const leaderMessage = contentSections?.find(s => s.section_key === 'leader_message');
  const leader = team?.find(m => m.role_en.toLowerCase().includes('ceo') || m.role_en.toLowerCase().includes('chief'));

  // Debug: Log leader data
  console.log('Leader data:', leader);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  const content = {
    en: { title: 'A Message From Our Leader' },
    da: { title: 'En Besked Fra Vores Leder' }
  };

  const t = content[language];

  return (
    <div className="pt-12 sm:pt-14 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t.title}</h1>
          
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative mx-auto max-w-xs md:max-w-none">
              <div className="w-full aspect-square rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center overflow-hidden">
                {leader?.image_url ? (
                  <img 
                    src={leader.image_url} 
                    alt={leader.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Leader image load error:', leader.image_url);
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="w-[90%] h-[90%] rounded-full bg-gray-800 flex items-center justify-center"><span class="text-5xl sm:text-6xl">👩‍💼</span></div>';
                    }}
                  />
                ) : (
                  <div className="w-[90%] h-[90%] rounded-full bg-gray-800 flex items-center justify-center">
                    <span className="text-5xl sm:text-6xl">👩‍💼</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              {leader && (
                <>
                  <h2 className="text-2xl sm:text-3xl font-bold text-dark">{leader.name}</h2>
                  <p className="text-lg sm:text-xl text-muted">{language === 'en' ? leader.role_en : leader.role_da}</p>
                </>
              )}
              {leaderMessage && (
                <div className="space-y-4">
                  {(language === 'en' ? leaderMessage.content_en : leaderMessage.content_da).split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-base sm:text-lg text-muted leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
