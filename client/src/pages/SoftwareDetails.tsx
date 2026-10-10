import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { apiService, SoftwareProduct } from '../services/api';

const categoryNames: Record<number, { en: string; da: string }> = {
  1: { en: 'Energy Management Systems', da: 'Energistyringssystemer' },
  2: { en: 'Smart Grid Software', da: 'Smart Grid Software' },
  3: { en: 'Energy System Modeling', da: 'Energisystemmodellering' },
  4: { en: 'Simulation Software', da: 'Simuleringssoftware' },
  5: { en: 'Demand Response', da: 'Efterspørgselsstyring' },
  6: { en: 'Blockchain & P2P', da: 'Blockchain & P2P' },
  7: { en: 'Carbon Tracking', da: 'Kulstofsporing' },
  8: { en: 'Virtual Energy', da: 'Virtuel Energi' },
  9: { en: 'Quantum Computing', da: 'Kvantedatabehandling' },
};

export const SoftwareDetails = () => {
  const { softwareId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [software, setSoftware] = useState<SoftwareProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    apiService.getSoftware()
      .then(data => {
        const found = data.find(s => s.slug === softwareId);
        setSoftware(found || null);
      })
      .finally(() => setLoading(false));
  }, [softwareId]);

  const content = {
    en: {
      backButton: 'Back to Services',
      featuresTitle: 'Key Features',
      categoryTitle: 'Category',
      ctaTitle: 'Interested in This Solution?',
      ctaText: "Let's discuss how this software can help you achieve your goals.",
      contactButton: 'Get in Touch',
      notFound: 'Software not found',
      notFoundText: 'The software you are looking for does not exist.',
    },
    da: {
      backButton: 'Tilbage til tjenester',
      featuresTitle: 'Nøglefunktioner',
      categoryTitle: 'Kategori',
      ctaTitle: 'Interesseret i denne løsning?',
      ctaText: 'Lad os diskutere, hvordan denne software kan hjælpe dig med at nå dine mål.',
      contactButton: 'Kontakt os',
      notFound: 'Software ikke fundet',
      notFoundText: 'Den software, du leder efter, eksisterer ikke.',
    }
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

  if (!software) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-sand/10 to-primary/5 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">{t.notFound}</h1>
          <p className="text-muted mb-8">{t.notFoundText}</p>
          <button
            onClick={() => navigate('/services')}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-medium"
          >
            {t.backButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sand/10 to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-5xl pt-12 sm:pt-14 pb-12 sm:pb-16 md:pb-20">
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
          className="mb-12"
        >
          {/* Title & Description */}
          <div className="text-center mb-8">
            {categoryNames[software.category] && (
              <span className="inline-block mb-3 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                {categoryNames[software.category][language]}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 gradient-text-emerald">
              {language === 'en' ? software.name_en : software.name_da}
            </h1>
            <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto">
              {language === 'en' ? software.description_en : software.description_da}
            </p>
          </div>

          {/* Image */}
          {software.image_url && (
            <div className="-mx-4 sm:-mx-6 md:-mx-8">
              <img 
                src={software.image_url} 
                alt={language === 'en' ? software.name_en : software.name_da}
                className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  console.error('Failed to load image:', software.image_url);
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-2xl">✨</span>
            {t.featuresTitle}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {(language === 'en' ? software.features_en : software.features_da).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-muted">{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>



        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 sm:p-10 text-white text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t.ctaTitle}</h2>
          <p className="text-lg mb-6 opacity-90">{t.ctaText}</p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-all shadow-xl"
          >
            <span>{t.contactButton}</span>
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};
