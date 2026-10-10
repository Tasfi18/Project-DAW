import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { apiService, Service } from '../services/api';

// Icon mapping
const iconComponents: Record<string, JSX.Element> = {
  sustainable: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  knowledge: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  technology: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  partnership: (
    <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
};

export const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    apiService.getServices()
      .then(data => {
        const found = data.find(s => s.slug === serviceId);
        setService(found || null);
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  const content = {
    en: {
      backButton: 'Back to Services',
      featuresTitle: 'Key Features',
      metricsTitle: 'Performance Metrics',
      ctaTitle: 'Interested in This Service?',
      ctaText: "Let's discuss how we can help you achieve your goals with this solution.",
      contactButton: 'Get in Touch',
      notFound: 'Service not found',
      notFoundText: 'The service you are looking for does not exist.',
    },
    da: {
      backButton: 'Tilbage til tjenester',
      featuresTitle: 'Nøglefunktioner',
      metricsTitle: 'Præstationsmålinger',
      ctaTitle: 'Interesseret i denne tjeneste?',
      ctaText: 'Lad os diskutere, hvordan vi kan hjælpe dig med at nå dine mål med denne løsning.',
      contactButton: 'Kontakt os',
      notFound: 'Tjeneste ikke fundet',
      notFoundText: 'Den tjeneste, du leder efter, eksisterer ikke.',
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

  if (!service) {
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

  const title = language === 'en' ? service.title_en : service.title_da;
  const description = language === 'en' ? service.description_en : service.description_da;
  const features = language === 'en' ? service.features_en : service.features_da;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sand/10 to-primary/5">
      {/* Hero Section */}
      <div className="relative pt-12 sm:pt-14 md:pt-16 pb-12 sm:pb-14 md:pb-16">
        <div className="absolute inset-0 pattern-dots opacity-5"></div>
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl relative">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 sm:mb-8 group transition-colors"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">{t.backButton}</span>
          </motion.button>

          {/* Service Header */}
          <div className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Icon and Text */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/20 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 text-primary">
                  {iconComponents[service.icon_name || 'technology']}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1"
              >
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-[1.2] py-1 mb-3 sm:mb-4 gradient-text-emerald">
                  {title}
                </h1>
                <p className="text-base sm:text-lg text-muted leading-relaxed">
                  {description}
                </p>
              </motion.div>
            </div>

            {/* Service Image (if exists) */}
            {service.image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="-mx-4 sm:-mx-6 md:-mx-8"
              >
                <img 
                  src={service.image_url} 
                  alt={title}
                  className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    console.error('Failed to load image:', service.image_url);
                  }}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl pb-12 sm:pb-16 md:pb-20">
        <div className="space-y-6 sm:space-y-8">
          {/* Main Content - Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-primary/10">
              <h2 className="text-xl sm:text-2xl font-bold text-dark mb-4 sm:mb-6 flex items-center gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {t.featuresTitle}
              </h2>

              <div className="space-y-3 sm:space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all group"
                  >
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm sm:text-base text-muted leading-relaxed flex-1">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-primary via-accent to-secondary p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl text-white">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t.metricsTitle}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {Object.entries(service.metrics).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                  >
                    <div className="text-2xl sm:text-3xl font-bold mb-1">{value}</div>
                    <div className="text-xs sm:text-sm opacity-90 capitalize">{key.replace(/_/g, ' ')}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 sm:mt-16 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 rounded-2xl sm:rounded-3xl blur-3xl opacity-30"></div>
          
          <div className="relative bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-cyan-300/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 sm:w-48 md:w-64 h-40 sm:h-48 md:h-64 bg-sky-900/20 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-tight">{t.ctaTitle}</h2>
              <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-95">{t.ctaText}</p>
              
              <motion.button
                onClick={() => navigate('/contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center bg-white text-sky-700 hover:bg-sky-50 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all shadow-2xl text-sm sm:text-base"
              >
                <span>{t.contactButton}</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
