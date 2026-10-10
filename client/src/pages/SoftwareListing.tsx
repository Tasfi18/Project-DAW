import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { apiService, SoftwareProduct } from '../services/api';

export const SoftwareListing = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [software, setSoftware] = useState<SoftwareProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    apiService.getSoftware()
      .then(data => setSoftware(data))
      .finally(() => setLoading(false));
  }, []);

  const content = {
    en: {
      title: 'Software Solutions',
      subtitle: 'Cutting-edge software platforms for energy management',
      backButton: 'Back to Services',
    },
    da: {
      title: 'Software Løsninger',
      subtitle: 'Banebrydende softwareplatforme til energistyring',
      backButton: 'Tilbage til tjenester',
    }
  };

  const categoryEmoji: Record<number, string> = {
    1: '⚡', 2: '🔌', 3: '📊', 4: '🏗️', 5: '📉', 6: '🔗', 7: '🌍', 8: '💻', 9: '⚛️'
  };

  const t = content[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-sand/10 to-primary/5 flex items-center justify-center px-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary/20 rounded-full"></div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sand/10 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl pt-12 sm:pt-14 pb-12 sm:pb-16 md:pb-20">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.backButton}
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text-emerald">
            {t.title}
          </h1>
          <div className="section-divider mb-4" />
          <p className="text-lg text-muted max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Software Grid */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {software.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="h-full group"
              onClick={() => navigate(`/software/${product.slug}`)}
            >
              <div className="h-full flex flex-col bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-blue-500/10 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:-translate-y-2 group-hover:scale-105 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 cursor-pointer">
                {/* Card Header with Icon */}
                <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10 transition-all duration-500 flex items-center gap-3 sm:gap-4 group-hover:from-blue-500/20 group-hover:via-cyan-500/20 group-hover:to-blue-600/20">
                  <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative text-blue-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 flex-shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center text-3xl sm:text-4xl">
                      {categoryEmoji[product.category]}
                    </div>
                  </div>
                  
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-dark relative">
                    {language === 'en' ? product.name_en : product.name_da}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">
                    {language === 'en' ? product.description_en : product.description_da}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
