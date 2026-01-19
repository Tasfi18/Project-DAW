import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { apiService, WorkProcessStep } from '../services/api';
import { useApi } from '../hooks/useApi';

// SVG Icon Components - Only for the three core values
const GlobeIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LightbulbIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const HandshakeIcon = () => (
  <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const Introduction = () => {
  const { language } = useLanguage();
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 200], [1, 1.1]);
  const { data: contentSections, loading } = useApi(apiService.getContent);
  const { data: workProcess, loading: workProcessLoading } = useApi(apiService.getWorkProcess);

  const introSection = contentSections?.find(s => s.section_key === 'introduction');
  const visionSection = contentSections?.find(s => s.section_key === 'vision');
  const whyChooseSection = contentSections?.find(s => s.section_key === 'why_choose_us');

  const sortedWorkProcess = workProcess?.sort((a: WorkProcessStep, b: WorkProcessStep) => a.display_order - b.display_order) || [];

  console.log('Content sections:', contentSections);
  console.log('Why Choose section:', whyChooseSection);

  if (loading || workProcessLoading) {
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
    en: {
      title: 'Digital Angel Wings',
      subtitle: 'Energy Infrastructure Solutions for a Sustainable Future',
      visionTitle: 'Our Vision',
      visionContent: 'We dream of a world where technology is not merely a privilege for the few but a transformative solution that empowers and uplifts communities globally. Through our efforts, we aim to be a catalyst for sustainable growth and innovation in developing countries. We are not just a company that talks about making a difference—we live and breathe it. We are the bridge connecting cutting-edge technology with the people who need it most.',
      howWeWorkTitle: 'How We Work',
      howWeWorkSubtitle: 'We focus on optimizing production processes and improving operational efficiency through our proven methodology.',
      workProcessComingSoon: 'Work process steps coming soon...',
    },
    da: {
      title: 'Digital Angel Wings',
      subtitle: 'Energiinfrastruktur løsninger til en bæredygtig fremtid',
      visionTitle: 'Vores Vision',
      visionContent: 'Vi drømmer om en verden, hvor teknologi ikke blot er et privilegium for de få, men en transformerende løsning, der styrker og løfter samfund globalt. Gennem vores indsats sigter vi mod at være en katalysator for bæredygtig vækst og innovation i udviklingslande. Vi er ikke bare en virksomhed, der taler om at gøre en forskel—vi lever og ånder det. Vi er broen, der forbinder banebrydende teknologi med de mennesker, der har mest brug for den.',
      howWeWorkTitle: 'Sådan arbejder vi',
      howWeWorkSubtitle: 'Vi fokuserer på at optimere produktionsprocesser og forbedre operationel effektivitet gennem vores dokumenterede metode.',
      workProcessComingSoon: 'Arbejdsprocesstrin kommer snart...',
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen pt-12 sm:pt-14">
      <section className="relative pt-2 sm:pt-3 md:pt-4 pb-8 sm:pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 gradient-bg-mesh opacity-20"></div>
        <motion.div style={{ scale }} className="absolute inset-0 pattern-grid opacity-5" />

        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4 md:mb-6 px-2">
              <span className="text-gradient">{t.title}</span>
            </h1>
            <div className="section-divider mb-4 sm:mb-5 md:mb-6"></div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted mb-6 sm:mb-8 md:mb-10 px-2 max-w-3xl mx-auto font-semibold">
              {introSection ? (language === 'en' ? introSection.title_en : introSection.title_da) : t.subtitle}
            </p>

            {introSection && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 text-left space-y-4 sm:space-y-6 md:space-y-8"
              >
                {(language === 'en' ? introSection.content_en : introSection.content_da).split('\n\n').map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-sm sm:text-base md:text-lg text-muted leading-relaxed text-justify"
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-10 sm:py-14 md:py-20 px-3 sm:px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-95"></div>
        <div className="absolute inset-0 pattern-grid opacity-10"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-4 sm:mb-6"
            >
            </motion.div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-4 sm:mb-6 text-white px-2">
              {t.visionTitle}
            </h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 180 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="h-1 sm:h-1.5 bg-white/80 mx-auto mb-5 sm:mb-8 rounded-full"
            />

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/95 leading-relaxed px-2 sm:px-4 font-light"
            >
              {visionSection ? (language === 'en' ? visionSection.content_en : visionSection.content_da) : t.visionContent}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-6 sm:mt-10 flex flex-wrap justify-center gap-4 sm:gap-6"
            >
              {[
                { icon: <GlobeIcon />, label: language === 'en' ? 'Global Impact' : 'Global Indvirkning' },
                { icon: <LightbulbIcon />, label: language === 'en' ? 'Innovation' : 'Innovation' },
                { icon: <HandshakeIcon />, label: language === 'en' ? 'Empowerment' : 'Styrkelse' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex flex-col items-center gap-1 sm:gap-2"
                >
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <span className="text-white/90 text-xs sm:text-sm font-medium">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {whyChooseSection && (
        <section className="relative py-10 sm:py-14 md:py-20 px-3 sm:px-4">
          <div className="absolute inset-0 gradient-bg-mesh opacity-10"></div>

          <div className="container mx-auto max-w-5xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-3 sm:mb-4"
              >
              </motion.div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 text-dark">
                {whyChooseSection ? (language === 'en' ? whyChooseSection.title_en : whyChooseSection.title_da) : 'Why Choose Us'}
              </h2>
              <div className="section-divider"></div>
            </motion.div>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {(() => {
                const content = language === 'en' ? whyChooseSection.content_en : whyChooseSection.content_da;
                // Split by double newline first, if only 1 item, try single newline
                let items = content.split('\n\n').filter(item => item.trim());
                if (items.length === 1) {
                  items = content.split('\n').filter(item => item.trim());
                }

                return items.map((item, index) => {
                  const [title, ...descParts] = item.split(':');
                  const description = descParts.join(':').trim();

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 border border-transparent hover:border-primary/20"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-dark mb-2">{title}</h3>
                          <p className="text-sm sm:text-base md:text-lg text-muted leading-relaxed">{description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                });
              })()}
            </div>
          </div>
        </section>
      )}

      {/* How We Work Section */}
      <section className="relative py-10 sm:py-14 md:py-20 px-3 sm:px-4 bg-gradient-to-b from-white to-sand/5">
        <div className="absolute inset-0 pattern-dots opacity-5"></div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block mb-3 sm:mb-4"
            >
            </motion.div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 gradient-text-emerald">
              {t.howWeWorkTitle}
            </h2>
            <div className="section-divider mb-4 sm:mb-6"></div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted max-w-3xl mx-auto px-2">
              {t.howWeWorkSubtitle}
            </p>
          </motion.div>

          {/* Process Steps with Timeline Design */}
          <div className="relative max-w-5xl mx-auto">
            {/* Vertical Line */}
            <div className="absolute left-4 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-secondary opacity-30 hidden sm:block"></div>

            <div className="space-y-6 sm:space-y-8 md:space-y-10">
              {sortedWorkProcess.length > 0 ? (
                sortedWorkProcess.map((step, index) => {
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
                      <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} md:items-center gap-3 sm:gap-4 md:gap-8`}>
                        <div className="flex items-center gap-3 sm:gap-4 md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                          <div
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-2xl shadow-xl flex-shrink-0"
                            style={{ background: step.icon_color }}
                          >
                            {step.step_number}
                          </div>
                        </div>

                        <div className={`md:w-[calc(50%-4rem)] ${isEven ? 'md:ml-auto' : 'md:mr-auto'} group`}>
                          <div className="bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/10 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-primary/30">
                            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                              <div
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                                style={{ backgroundColor: `${step.icon_color}20` }}
                              >
                                <span className="text-xl sm:text-2xl">{step.icon_emoji}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-dark mb-1 sm:mb-2">
                                  {language === 'en' ? step.title_en : step.title_da}
                                </h3>
                              </div>
                            </div>
                            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-muted">
                              {(language === 'en' ? step.items_en : step.items_da).map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start gap-2 sm:gap-3">
                                  <div
                                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                    style={{ background: step.icon_color }}
                                  >
                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <p className="text-center text-muted py-6 text-sm sm:text-base">
                  {t.workProcessComingSoon}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
