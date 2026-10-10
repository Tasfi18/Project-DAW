import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export const Conclusion = () => {
  const { language } = useLanguage();
  const { data: sdgGoals, loading } = useApi(apiService.getSDG);
  const { data: contentSections } = useApi(apiService.getContent);

  const conclusion = contentSections?.find(s => s.section_key === 'conclusion');

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
    en: { title: 'Our Impact', complete: 'Complete' },
    da: { title: 'Vores Indvirkning', complete: 'Færdig' }
  };

  const t = content[language];

  return (
    <div className="pt-12 sm:pt-14 min-h-screen pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center gradient-text">{t.title}</h1>
          
          {sdgGoals && sdgGoals.length > 0 && (
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {sdgGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-8 text-center"
                >
                  <div className="text-5xl mb-4">{goal.icon_name || '🎯'}</div>
                  <h3 className="text-xl font-bold text-dark mb-4">{language === 'en' ? goal.title_en : goal.title_da}</h3>
                  {(language === 'en' ? goal.description_en : goal.description_da) && (
                    <p className="text-sm text-muted mb-4">{language === 'en' ? goal.description_en : goal.description_da}</p>
                  )}
                  <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress_percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      className="absolute h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                  <p className="text-sm text-muted mt-2">{goal.progress_percentage}% {t.complete}</p>
                </motion.div>
              ))}
            </div>
          )}

          {conclusion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-3xl p-8 md:p-12 text-center"
            >
              <h2 className="text-xl sm:text-2xl font-bold gradient-text-emerald mb-6">{conclusion ? (language === 'en' ? conclusion.title_en : conclusion.title_da) : ''}</h2>
              <p className="text-base text-muted leading-relaxed max-w-3xl mx-auto">
                {conclusion ? (language === 'en' ? conclusion.content_en : conclusion.content_da) : ''}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
