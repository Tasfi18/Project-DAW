import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, Service, WorkProcessStep, SoftwareProduct } from '../services/api';

// Icon mapping for rendering
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

export const Progress = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [software, setSoftware] = useState<SoftwareProduct[]>([]);
  const [workProcess, setWorkProcess] = useState<WorkProcessStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    Promise.all([
      apiService.getServices(),
      apiService.getSoftware(),
      apiService.getWorkProcess()
    ])
      .then(([servicesData, softwareData, workProcessData]) => {
        setServices(servicesData);
        setSoftware(softwareData);
        setWorkProcess(workProcessData.sort((a, b) => a.display_order - b.display_order));
      })
      .finally(() => setLoading(false));
  }, []);

  const content = {
    en: {
      title: 'Our Services',
      subtitle: 'Comprehensive Solutions for Sustainable Development',
      description: 'We bridge the gap between advanced technology and sustainable development in emerging markets through innovative consultancy services.',
      categories: ['All Services', 'Energy Solutions', 'Technology', 'Partnerships'],
      readyTitle: 'Ready to Transform Your Business?',
      readyText: "Let's collaborate to create sustainable solutions that make a real difference. Our team of experts is ready to help you achieve your goals.",
      contactButton: 'Schedule Consultation',
    },
    da: {
      title: 'Vores Tjenester',
      subtitle: 'Omfattende løsninger til bæredygtig udvikling',
      description: 'Vi bygger bro mellem avanceret teknologi og bæredygtig udvikling i nye markeder gennem innovative rådgivningstjenester.',
      categories: ['Alle tjenester', 'Energiløsninger', 'Teknologi', 'Partnerskaber'],
      readyTitle: 'Klar til at transformere din virksomhed?',
      readyText: 'Lad os samarbejde for at skabe bæredygtige løsninger, der gør en reel forskel. Vores team af eksperter er klar til at hjælpe dig med at nå dine mål.',
      contactButton: 'Book konsultation',
    }
  };

  const t = content[language];

  // Filter services based on active tab
  const displayServices = activeTab === 0 
    ? services 
    : services.filter(service => service.category === activeTab);

  if (loading) {
    return (
      <div className="pt-12 sm:pt-14 md:pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary/20 rounded-full"></div>
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sand/10 to-primary/5 overflow-hidden">
      {/* Hero Section */}
      <div className="relative pt-12 sm:pt-14 md:pt-16 pb-12 sm:pb-14 md:pb-16">
        <div className="absolute inset-0 pattern-dots opacity-5"></div>
        
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4 gradient-text-emerald">
              {t.title}
            </h1>
            
            <div className="section-divider mb-4 sm:mb-5 md:mb-6" />
            
            <p className="text-base sm:text-lg md:text-xl text-muted max-w-3xl mx-auto mb-3 sm:mb-4 px-2">
              {t.subtitle}
            </p>
            
            <p className="text-sm sm:text-base text-muted/80 max-w-2xl mx-auto px-2">
              {t.description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="py-8 sm:py-10 md:py-12 bg-gradient-to-r from-primary via-accent to-secondary relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              {language === 'en' 
                ? 'Bridging Innovation and Sustainability'
                : 'Brobygger mellem innovation og bæredygtighed'}
            </h2>
            <p className="text-sm sm:text-base md:text-lg opacity-95 leading-relaxed">
              {language === 'en'
                ? 'We connect advanced European technology with emerging markets, delivering practical solutions that drive sustainable development and create lasting positive impact.'
                : 'Vi forbinder avanceret europæisk teknologi med nye markeder og leverer praktiske løsninger, der fremmer bæredygtig udvikling og skaber varig positiv effekt.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Service Categories Tabs */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl py-8 sm:py-10 md:py-12">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12">
          {t.categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-200 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                  : 'bg-white/80 text-muted hover:bg-white hover:text-primary hover:shadow-md'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2">
          {displayServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="h-full group"
              onClick={() => navigate(`/services/${service.slug}`)}
            >
              <div
                className="h-full flex flex-col bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-primary/10 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:-translate-y-2 group-hover:scale-105 group-hover:border-primary/30 group-hover:bg-primary/5 cursor-pointer"
              >
                {/* Card Header with Icon */}
                <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 transition-all duration-500 flex items-center gap-3 sm:gap-4 group-hover:from-primary/20 group-hover:via-accent/20 group-hover:to-secondary/20">
                  <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl"></div>
                  
                  <div 
                    className="relative text-primary transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 flex-shrink-0"
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12">
                      {iconComponents[service.icon_name || 'technology']}
                    </div>
                  </div>
                  
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-dark relative">
                    {language === 'en' ? service.title_en : service.title_da}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">
                    {language === 'en' ? service.description_en : service.description_da}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Software Solutions Card */}
          {software.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: displayServices.length * 0.05 }}
              className="h-full group"
              onClick={() => navigate('/software')}
            >
              <div className="h-full flex flex-col bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl overflow-hidden border border-blue-500/10 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/20 group-hover:-translate-y-2 group-hover:scale-105 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 cursor-pointer">
                <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-600/10 transition-all duration-500 flex items-center gap-3 sm:gap-4 group-hover:from-blue-500/20 group-hover:via-cyan-500/20 group-hover:to-blue-600/20">
                  <div className="absolute top-0 right-0 w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="relative text-blue-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 flex-shrink-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center text-3xl sm:text-4xl">
                      💻
                    </div>
                  </div>
                  
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-dark relative">
                    {language === 'en' ? 'Software Solutions' : 'Software løsninger'}
                  </h3>
                </div>

                <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                  <p className="text-muted text-xs sm:text-sm leading-relaxed">
                    {language === 'en' 
                      ? 'Explore our comprehensive suite of innovative software solutions designed to optimize energy management, enhance operational efficiency, and drive sustainable practices across your organization.'
                      : 'Udforsk vores omfattende pakke af innovative softwareløsninger designet til at optimere energistyring, forbedre operationel effektivitet og fremme bæredygtige praksisser på tværs af din organisation.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        

        {/* Our Process Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 sm:mt-12 md:mt-16"
        >
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-3 sm:mb-4"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <span className="text-2xl sm:text-3xl">⚙️</span>
              </div>
            </motion.div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 gradient-text-emerald px-2">
              {language === 'en' ? 'How We Work' : 'Sådan arbejder vi'}
            </h2>
            <div className="section-divider mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg text-muted max-w-3xl mx-auto px-4">
              {language === 'en' 
                ? 'We focus on optimizing production processes and improving operational efficiency through our proven methodology.'
                : 'Vi fokuserer på at optimere produktionsprocesser og forbedre operationel effektivitet gennem vores dokumenterede metode.'}
            </p>
          </div>

          {/* Process Steps with Timeline Design */}
          <div className="relative max-w-5xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary opacity-30 hidden sm:block"></div>
            
            <div className="space-y-6 sm:space-y-8 md:space-y-10">
              {workProcess.length > 0 ? (
                workProcess.map((step, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="relative"
                    >
                      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center gap-4 md:gap-8`}>
                        <div className="flex items-center gap-4 md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                          <div 
                            className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl md:text-2xl shadow-xl flex-shrink-0"
                            style={{ background: step.icon_color }}
                          >
                            {step.step_number}
                          </div>
                        </div>
                        
                        <div className={`md:w-[calc(50%-4rem)] ${isEven ? 'md:ml-auto' : 'md:mr-auto'} group`}>
                          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-primary/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-start gap-4 mb-4">
                              <div 
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: `${step.icon_color}20` }}
                              >
                                <span className="text-2xl sm:text-3xl">{step.icon_emoji}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-dark mb-2">
                                  {language === 'en' ? step.title_en : step.title_da}
                                </h3>
                              </div>
                            </div>
                            <ul className="space-y-3 text-sm sm:text-base text-muted">
                              {(language === 'en' ? step.items_en : step.items_da).map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-3">
                                  <div 
                                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: step.icon_color }}
                                  >
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <p className="text-center text-muted py-8">
                  {language === 'en' ? 'Work process steps coming soon...' : 'Arbejdsprocesstrin kommer snart...'}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 rounded-2xl sm:rounded-3xl blur-3xl opacity-30"></div>
          
          <div className="relative bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 lg:p-16 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-cyan-300/10 rounded-full blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-48 sm:w-56 md:w-64 h-48 sm:h-56 md:h-64 bg-sky-900/20 rounded-full blur-2xl -z-0"></div>
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 leading-tight"
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
              >
                {t.readyTitle}
              </motion.h2>
              
              <motion.p 
                className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 opacity-95 leading-relaxed px-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t.readyText}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center bg-white text-sky-700 hover:bg-sky-50 font-bold px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl transition-all shadow-2xl text-sm sm:text-base"
                >
                  <span>{t.contactButton}</span>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
