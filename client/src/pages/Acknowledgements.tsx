import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export const Acknowledgements = () => {
  const { language } = useLanguage();
  const { data: team, loading } = useApi(apiService.getTeam);

  // Debug: Log team data to see image URLs
  console.log('Team data:', team);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading team...</p>
        </div>
      </div>
    );
  }

  const content = {
    en: {
      title: 'Our Team',
      intro: 'Meet the dedicated professionals committed to bringing innovative cleaning solutions to Bangladesh.'
    },
    da: {
      title: 'Vores Team',
      intro: 'Mød de dedikerede fagfolk, der er forpligtede til at bringe innovative rengøringsløsninger til Bangladesh.'
    }
  };

  const t = content[language];

  return (
    <div className="pt-12 sm:pt-14 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-center gradient-text">{t.title}</h1>
          <p className="text-sm sm:text-base text-muted text-center mb-12 max-w-3xl mx-auto">{t.intro}</p>
          
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {team?.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                    {member.image_url ? (
                      <img 
                        src={member.image_url} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image load error for:', member.name, member.image_url);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span class="text-4xl">👤</span>';
                        }}
                      />
                    ) : (
                      <span className="text-4xl">👤</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-1">{member.name}</h3>
                  <p className="text-muted mb-3">{language === 'en' ? member.role_en : member.role_da}</p>
                  {(language === 'en' ? member.bio_en : member.bio_da) && (
                    <p className="text-sm text-muted/80 mb-4">{language === 'en' ? member.bio_en : member.bio_da}</p>
                  )}
                </div>
                
                {/* Contact Info */}
                {(member.phone || member.email || member.linkedin_url) && (
                  <div className="space-y-2 text-left border-t pt-4">
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <span>📱</span> {member.phone}
                      </a>
                    )}
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline break-all">
                        <span>✉️</span> {member.email}
                      </a>
                    )}
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" 
                         className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <span>🔗</span> LinkedIn
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
