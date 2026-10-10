import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/logo8.jpg';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();

  const allLinks = [
    { name: { en: 'Home', da: 'Hjem' }, path: '/', hidden: false },
    { name: { en: 'About', da: 'Om os' }, path: '/about', hidden: false },
    { name: { en: 'Services', da: 'Tjenester' }, path: '/services', hidden: false },
    { name: { en: 'Leadership', da: 'Ledelse' }, path: '/leadership', hidden: false },
    { name: { en: 'Team', da: 'Team' }, path: '/team', hidden: false },
    { name: { en: 'Impact', da: 'Indvirkning' }, path: '/impact', hidden: true },
    { name: { en: 'Contact', da: 'Kontakt' }, path: '/contact', hidden: false },
  ];

  // Filter out hidden links for navigation display
  const visibleLinks = allLinks.filter(link => !link.hidden);

  // Only Home, About, Services for desktop navbar
  const desktopLinks = allLinks.slice(0, 3);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled
      ? 'bg-gradient-to-r from-primary via-secondary to-accent shadow-lg py-2.5'
      : 'bg-gradient-to-r from-primary via-secondary to-accent py-3'
      }`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group relative shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={logo}
                alt="Digital Angel Wings Logo"
                className="h-9 sm:h-10 lg:h-11 w-auto object-contain transition-all duration-300"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg lg:text-xl font-bold font-display text-white leading-tight">
                Digital Angel Wings
              </span>
              <span className="text-2xs text-white/80 font-medium tracking-widest uppercase opacity-80 hidden sm:block">
                Sustainable Future
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Only visible on LG+ screens */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              {desktopLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group px-4 py-2 rounded-xl transition-all duration-300"
                >
                  <span className={`text-base font-medium transition-colors whitespace-nowrap ${location.pathname === link.path
                    ? 'text-white font-semibold'
                    : 'text-white/80 hover:text-white'
                    }`}>
                    {link.name[language]}
                  </span>
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl -z-10"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className={`absolute bottom-0 left-4 right-4 h-0.5 bg-white transition-all duration-300 ${location.pathname === link.path
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-80'
                    }`}></span>
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 ml-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLanguage}
                className="relative px-5 py-2.5 rounded-xl bg-white text-primary font-medium shadow-md hover:shadow-lg transition-all text-base whitespace-nowrap"
              >
                <span className="relative z-10">{language === 'en' ? 'DA' : 'EN'}</span>
              </motion.button>
              <Link
                to="/contact"
                className="btn btn-primary text-base px-6 py-2.5 whitespace-nowrap"
              >
                <span>Get Started</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Menu Button - Visible on ALL screens */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all"
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-6 h-5"
            >
              <span className={`absolute left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 top-2' : 'top-0'
                }`}></span>
              <span className={`absolute left-0 top-2 w-4 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}></span>
              <span className={`absolute left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 top-2' : 'top-4'
                }`}></span>
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white/95 backdrop-blur-lg rounded-2xl mt-4 shadow-xl"
            >
              <div className="py-6 space-y-2">
                {visibleLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl transition-all ${location.pathname === link.path
                        ? 'bg-gradient-to-r from-primary/15 via-secondary/15 to-accent/15 text-primary font-semibold'
                        : 'hover:bg-neutral-50 text-muted hover:text-dark'
                        }`}
                    >
                      <span className="font-medium">{link.name[language]}</span>
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: visibleLinks.length * 0.05 }}
                  className="pt-4 space-y-3"
                >
                  <button
                    onClick={toggleLanguage}
                    className="w-full btn btn-accent"
                  >
                    {language === 'en' ? 'Switch to Danish' : 'Switch to English'}
                  </button>
                  <Link
                    to="/contact"
                    onClick={() => setIsOpen(false)}
                    className="w-full btn btn-primary"
                  >
                    Get Started →
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};