import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService, ContactInfo } from '../services/api';
import logo from '../assets/logo8.jpg';

// SVG Icon Components - Only for contact info
const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const OfficeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const Footer = () => {
  const { language } = useLanguage();
  const [contact, setContact] = useState<ContactInfo | null>(null);

  useEffect(() => {
    void apiService.getContact().then(setContact);
  }, []);

  const content = {
    en: {
      quickLinks: 'Quick Links',
      contactUs: 'Contact Us',
      rights: 'All rights reserved.',
      about: 'About',
      services: 'Services',
      leadership: 'Leadership',
      team: 'Team',
      impact: 'Impact',
      contact: 'Contact',
      description: '',
    },
    da: {
      quickLinks: 'Hurtige Links',
      contactUs: 'Kontakt Os',
      rights: 'Alle rettigheder forbeholdes.',
      about: 'Om',
      services: 'Tjenester',
      leadership: 'Ledelse',
      team: 'Team',
      impact: 'Påvirkning',
      contact: 'Kontakt',
      description: '',
    },
  };

  const t = content[language];

  const navLinks = [
    { path: '/about', label: t.about },
    { path: '/services', label: t.services },
    { path: '/leadership', label: t.leadership },
    { path: '/team', label: t.team },
    { path: '/impact', label: t.impact },
    { path: '/contact', label: t.contact },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#004d5c] via-[#006876] to-[#008396] text-white">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-teal-400/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

            {/* Company Info */}
            <div className="space-y-3">
              <Link to="/" className="inline-flex items-center gap-2.5 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <img
                    src={logo}
                    alt="Digital Angel Wings"
                    className="w-10 h-10 object-contain rounded-lg bg-white/10 p-1"
                  />
                </motion.div>
                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-200 transition-colors leading-tight">
                    Digital Angel Wings
                  </h3>
                  <p className="text-[10px] text-cyan-100/70 tracking-wider uppercase font-medium">
                    Sustainable Future
                  </p>
                </div>
              </Link>
              <p className="text-xs text-white/80 leading-relaxed">
                {t.description}
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-white pb-1.5 border-b border-cyan-300/40 inline-block">
                {t.quickLinks}
              </h4>
              <ul className="space-y-1.5 mt-2">
                {navLinks.map((link) => (
                  <motion.li
                    key={link.path}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to={link.path}
                      className="text-xs text-white/80 hover:text-cyan-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-sm mb-2 text-white pb-1.5 border-b border-cyan-300/40 inline-block">
                {t.contactUs}
              </h4>
              {contact ? (
                <ul className="space-y-2.5 mt-2">
                  <li className="flex items-start gap-2 group">
                    <span className="text-cyan-200 flex-shrink-0 mt-0.5"><EmailIcon /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/60 font-medium">Email</p>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-xs text-white/90 hover:text-cyan-200 transition-colors break-all"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 group">
                    <span className="text-cyan-200 flex-shrink-0 mt-0.5"><PhoneIcon /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/60 font-medium">Phone</p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-xs text-white/90 hover:text-cyan-200 transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 group">
                    <span className="text-cyan-200 flex-shrink-0 mt-0.5"><LocationIcon /></span>
                    <div className="min-w-0">
                      <p className="text-[10px] text-white/60 font-medium">Address</p>
                      <span className="text-xs text-white/90 leading-relaxed">
                        {contact.address}
                      </span>
                    </div>
                  </li>
                  {contact.cvr_number && (
                    <li className="flex items-start gap-2 group">
                      <span className="text-cyan-200 flex-shrink-0 mt-0.5"><BuildingIcon /></span>
                      <div className="min-w-0">
                        <p className="text-[10px] text-white/60 font-medium">CVR</p>
                        <span className="text-xs text-white/90">
                          {contact.cvr_number}
                        </span>
                      </div>
                    </li>
                  )}
                  {contact.country_office_address && (
                    <li className="flex items-start gap-2 group">
                      <span className="text-cyan-200 flex-shrink-0 mt-0.5"><OfficeIcon /></span>
                      <div className="min-w-0">
                        <p className="text-[10px] text-white/60 font-medium">{language === 'en' ? 'Bangladesh Office' : 'Bangladesh Kontor'}</p>
                        <span className="text-xs text-white/90 leading-relaxed">
                          {contact.country_office_address}
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              ) : (
                <div className="space-y-2 mt-2">
                  <div className="h-3 bg-white/5 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-white/5 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-white/5 rounded animate-pulse w-5/6"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 py-4">
          <p className="text-center text-xs text-white/70">
            © {new Date().getFullYear()} Digital Angel Wings. {t.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};
