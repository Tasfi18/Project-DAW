import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiService } from '../services/api';
import { useApi } from '../hooks/useApi';

export const Contact = () => {
  const { language } = useLanguage();
  const { data: contactInfo, loading } = useApi(apiService.getContact);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const content = {
    en: {
      title: 'Let\'s Build the Future Together',
      subtitle: 'Transform your energy infrastructure with our expert solutions',
      description: 'We provide comprehensive energy infrastructure solutions from planning to implementation. Contact us to learn more about how we can help.',
      form: {
        name: 'Your Name',
        email: 'Email Address',
        phone: 'Phone Number',
        message: 'Tell us about your project',
        submit: 'Send Message',
        submitting: 'Sending...'
      }
    },
    da: {
      title: 'Lad Os Bygge Fremtiden Sammen',
      subtitle: 'Transformer din energiinfrastruktur med vores ekspertløsninger',
      description: 'Vi leverer omfattende energiinfrastrukturløsninger fra planlægning til implementering. Kontakt os for at lære mere om, hvordan vi kan hjælpe.',
      form: {
        name: 'Dit Navn',
        email: 'Email Adresse',
        phone: 'Telefonnummer',
        message: 'Fortæl os om dit projekt',
        submit: 'Send Besked',
        submitting: 'Sender...'
      }
    }
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      await apiService.createMessage(formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 sm:pt-14 pb-8 sm:pb-12">
      <div className="fixed inset-0 pattern-dots opacity-5 -z-10"></div>
      <div className="fixed inset-0 gradient-bg-mesh opacity-10 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3 sm:mb-4 px-2">
            <span className="text-gradient">{t.title}</span>
          </h1>
          <div className="section-divider mb-4 sm:mb-6"></div>
          <p className="text-sm sm:text-base md:text-lg text-muted max-w-2xl mx-auto px-2">
            {t.subtitle}
          </p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10"
          >
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 sm:space-y-6">
              <motion.div animate={{ scale: focusedField === 'name' ? 1.02 : 1 }} className="relative">
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                  placeholder={t.form.name} required
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-neutral-200 focus:border-primary focus:outline-none transition-all duration-300 text-dark placeholder-muted/60"
                />
                <motion.div animate={{ width: focusedField === 'name' ? '100%' : '0%' }} className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
              </motion.div>
              <motion.div animate={{ scale: focusedField === 'email' ? 1.02 : 1 }} className="relative">
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  placeholder={t.form.email} required
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-neutral-200 focus:border-primary focus:outline-none transition-all duration-300 text-dark placeholder-muted/60"
                />
                <motion.div animate={{ width: focusedField === 'email' ? '100%' : '0%' }} className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
              </motion.div>
              <motion.div animate={{ scale: focusedField === 'phone' ? 1.02 : 1 }} className="relative">
                <input
                  type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                  placeholder={t.form.phone}
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-neutral-200 focus:border-primary focus:outline-none transition-all duration-300 text-dark placeholder-muted/60"
                />
                <motion.div animate={{ width: focusedField === 'phone' ? '100%' : '0%' }} className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
              </motion.div>
              <motion.div animate={{ scale: focusedField === 'message' ? 1.02 : 1 }} className="relative">
                <textarea
                  name="message" value={formData.message} onChange={handleChange}
                  onFocus={() => setFocusedField('message')} onBlur={() => setFocusedField(null)}
                  placeholder={t.form.message} rows={5} required
                  className="w-full px-6 py-4 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-neutral-200 focus:border-primary focus:outline-none transition-all duration-300 text-dark placeholder-muted/60 resize-none"
                />
                <motion.div animate={{ width: focusedField === 'message' ? '100%' : '0%' }} className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
              </motion.div>
              <motion.button
                type="submit" disabled={isSubmitting}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full btn btn-primary relative overflow-hidden"
              >
                <span className="relative z-10">
                  {isSubmitting ? t.form.submitting : t.form.submit}
                </span>
                {isSubmitting && (
                  <motion.div
                    initial={{ x: '-100%' }} animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                )}
              </motion.button>
              
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-100 text-green-800 rounded-xl text-center"
                >
                  ✓ {language === 'en' ? 'Message sent successfully! We\'ll get back to you soon.' : 'Besked sendt! Vi vender tilbage snart.'}
                </motion.div>
              )}
              
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-100 text-red-800 rounded-xl text-center"
                >
                  ✗ {language === 'en' ? 'Error sending message. Please try again.' : 'Fejl ved afsendelse. Prøv igen.'}
                </motion.div>
              )}
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 sm:space-y-8"
          >
            {contactInfo && (
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <motion.div whileHover={{ y: -5 }} className="card p-5 sm:p-6 hover:shadow-glow transition-all duration-300">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl">📧</div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-dark mb-1 text-sm sm:text-base">Email</h3>
                      <p className="text-muted text-xs sm:text-sm break-all">{contactInfo.email}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="card p-5 sm:p-6 hover:shadow-glow transition-all duration-300">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl">📱</div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-dark mb-1 text-sm sm:text-base">{language === 'en' ? 'Phone' : 'Telefon'}</h3>
                      <p className="text-muted text-xs sm:text-sm">{contactInfo.phone}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} className="card p-5 sm:p-6 hover:shadow-glow transition-all duration-300">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl">📍</div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-dark mb-1 text-sm sm:text-base">{language === 'en' ? 'Location' : 'Lokation'}</h3>
                      <p className="text-muted text-xs sm:text-sm">{contactInfo.address}</p>
                    </div>
                  </div>
                </motion.div>
                {contactInfo.cvr_number && (
                  <motion.div whileHover={{ y: -5 }} className="card p-5 sm:p-6 hover:shadow-glow transition-all duration-300">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-2xl sm:text-3xl">🏢</div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-dark mb-1 text-sm sm:text-base">CVR</h3>
                        <p className="text-muted text-xs sm:text-sm">{contactInfo.cvr_number}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {contactInfo.country_office_address && (
                  <motion.div whileHover={{ y: -5 }} className="card p-5 sm:p-6 hover:shadow-glow transition-all duration-300 sm:col-span-2">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-2xl sm:text-3xl">🇧🇩</div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-dark mb-1 text-sm sm:text-base">{language === 'en' ? 'Bangladesh Office' : 'Bangladesh Kontor'}</h3>
                        <p className="text-muted text-xs sm:text-sm">{contactInfo.country_office_address}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            <motion.div className="glass rounded-xl sm:rounded-2xl p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-bold text-dark mb-2 sm:mb-3">
                {language === 'en' ? 'Get In Touch' : 'Kontakt Os'}
              </h3>
              <p className="text-muted text-xs sm:text-sm leading-relaxed">
                {t.description}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
