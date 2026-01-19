import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';
import { ServiceCard } from '../components/ServiceCard';

export const Hero = () => {
  const { language } = useLanguage();
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { data: contentSections, loading: contentLoading } = useApi(apiService.getContent);
  const { data: services, loading: servicesLoading } = useApi(apiService.getServices);
  
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const heroSection = contentSections?.find(s => s.section_key === 'hero_tagline');
  const partnerSection = contentSections?.find(s => s.section_key === 'partner_with_us');
  const servicesSectionTitle = contentSections?.find(s => s.section_key === 'services_section');
  const displayServices = services?.slice(0, 3) || [];

  // Icon mapping
  const iconMap: Record<string, string> = {
    sustainable: '☀️',
    knowledge: '📚',
    technology: '💻',
    partnership: '🤝',
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const content = {
    en: {
      title: 'Digital Angel Wings',
      primaryCta: 'Get In Touch',
      secondaryCta: 'Learn More',
      defaultTagline: 'BUILDING RELIABLE CONNECTIONS FOR A SUSTAINABLE FUTURE',
      defaultDescription: 'We combine technical expertise with practical experience to deliver seamless solutions for utility and energy infrastructure projects. From large-scale solar parks to individual charging stations — completed safely, efficiently, and to the highest standard.',
      servicesTitle: 'Our Services',
      servicesSubtitle: '',
      viewAllServices: 'View All Services',
      ctaTitle: "Let's Build the Future Together",
      ctaDescription: 'Partner with us to bring professional project management, innovative materials, and reliable expertise to your energy infrastructure projects.',
      ctaButton: 'Start Your Journey',
    },
    da: {
      title: 'Digital Angel Wings',
      primaryCta: 'Kontakt Os',
      secondaryCta: 'Lær Mere',
      defaultTagline: 'Digitale Englevinger – Din Bro Mellem Innovation og Bæredygtighed',
      defaultDescription: 'Vi kombinerer teknisk ekspertise med praktisk erfaring for at levere problemfri løsninger til forsynings- og energiinfrastrukturprojekter. Fra store solcelleparker til individuelle ladestationer — gennemført sikkert, effektivt og til højeste standard.',
      servicesTitle: 'Vores Tjenester',
      servicesSubtitle: '',
      viewAllServices: 'Se Alle Tjenester',
      ctaTitle: 'Lad Os Bygge Fremtiden Sammen',
      ctaDescription: 'Samarbejd med os for at bringe professionel projektstyring, innovative materialer og pålidelig ekspertise til dine energiinfrastrukturprojekter.',
      ctaButton: 'Start Din Rejse',
    },
  };

  const t = content[language];

  const loading = contentLoading || servicesLoading;

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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      {/* Animated Background */}
      <div className="absolute inset-0 gradient-bg-mesh opacity-20"></div>
      <div className="absolute inset-0">
        <motion.div
          style={{ x: mousePosition.x, y: mousePosition.y }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ x: -mousePosition.x, y: -mousePosition.y }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 right-20 w-64 h-64 bg-accent/10 rounded-full blur-2xl"
        />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 pattern-grid opacity-5"></div>
      
      {/* Hero Content */}
      <section className="relative pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 md:pb-10 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="inline-block mb-6 sm:mb-7 md:mb-8"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-3xl shadow-2xl animate-float overflow-hidden">
                <img 
                  src="/logo8.jpg" 
                  alt="Digital Angel Wings Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            {/* Title */}
            <motion.h1
              style={{ opacity }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-display font-bold mb-4 sm:mb-5 md:mb-6"
            >
              <span className="text-gradient inline-block">
                {t.title}
              </span>
            </motion.h1>
            
            {/* Animated Divider */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1.5 bg-gradient-to-r from-primary via-secondary to-accent mx-auto mb-5 sm:mb-6 md:mb-7 rounded-full shadow-glow"
            />
            
            {/* Subtitle & Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-dark font-semibold mb-3 sm:mb-4 md:mb-5 px-2"
            >
              {heroSection ? (language === 'en' ? heroSection.title_en : heroSection.title_da) : t.defaultTagline}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-base lg:text-lg text-muted mb-6 sm:mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed px-2"
            >
              {heroSection ? (language === 'en' ? heroSection.content_en : heroSection.content_da) : t.defaultDescription}
            </motion.p>
            
            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-2"
            >
              <Link
                to="/contact"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-lg sm:shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t.primaryCta}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-sage/80 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              
              <Link
                to="/about"
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/80 backdrop-blur-sm border-2 border-primary/20 text-dark rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl hover:bg-white hover:border-primary/40 transform hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <span className="flex items-center justify-center gap-2">
                  {t.secondaryCta}
                  <span className="group-hover:rotate-12 transition-transform">✨</span>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview Section */}
      {displayServices.length > 0 && (
        <section className="relative py-6 sm:py-8 md:py-10 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6 sm:mb-8 md:mb-10"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-3 sm:mb-4 text-dark px-2">
                {servicesSectionTitle 
                  ? (language === 'en' ? servicesSectionTitle.title_en : servicesSectionTitle.title_da)
                  : t.servicesTitle
                }
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted px-2">
                {servicesSectionTitle 
                  ? (language === 'en' ? servicesSectionTitle.content_en : servicesSectionTitle.content_da)
                  : t.servicesSubtitle
                }
              </p>
            </motion.div>

            <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3">
              {displayServices.map((service, index) => {
                const title = language === 'en' ? service.title_en : service.title_da;
                const description = language === 'en' ? service.description_en : service.description_da;
                const icon = iconMap[service.icon_name || ''] || '🔧';
                const colors: Array<'primary' | 'secondary' | 'accent'> = ['primary', 'secondary', 'accent'];
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <ServiceCard
                      icon={icon}
                      title={title}
                      description={description.substring(0, 120) + '...'}
                      color={colors[index % 3]}
                      delay={index * 0.1}
                    />
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-6 sm:mt-8 md:mt-10"
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                {t.viewAllServices}
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section - Partner With Us */}
      <section className="relative py-6 sm:py-8 md:py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl"
          >
            <div className="absolute inset-0 pattern-grid opacity-10"></div>
            <div className="relative z-10 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-5 px-2">
                  {partnerSection ? (language === 'en' ? partnerSection.title_en : partnerSection.title_da) : t.ctaTitle}
                </h2>
                <div className="text-sm sm:text-base md:text-base lg:text-lg mb-5 sm:mb-6 md:mb-7 opacity-90 max-w-4xl mx-auto space-y-3 sm:space-y-4 px-2">
                  {partnerSection ? (
                    (language === 'en' ? partnerSection.content_en : partnerSection.content_da).split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <p>{t.ctaDescription}</p>
                  )}
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  {t.ctaButton}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};