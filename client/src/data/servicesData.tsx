// Shared services data for reuse across components
export const ServiceIcons = {
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

export const servicesData = [
  {
    id: 1,
    icon: ServiceIcons.sustainable,
    category: 1,
    title: { en: 'Sustainable Energy Solutions', da: 'Bæredygtige Energiløsninger' },
    description: { 
      en: 'Comprehensive green energy implementation with focus on solar, wind, and hybrid renewable systems.',
      da: 'Omfattende grøn energiimplementering med fokus på sol-, vind- og hybride vedvarende systemer.'
    },
    features: {
      en: [
        'Solar panel installation & maintenance',
        'Wind energy integration',
        'Energy storage systems',
        'Carbon footprint reduction',
        'Green certification assistance',
      ],
      da: [
        'Installation og vedligeholdelse af solpaneler',
        'Vindenergiintegration',
        'Energilagringssystemer',
        'Reduktion af CO2-aftryk',
        'Grøn certificeringsassistance',
      ],
    },
    metrics: { efficiency: '95%', savings: '40%', roi: '3-5 years' }
  },
  {
    id: 2,
    icon: ServiceIcons.technology,
    category: 1,
    title: { en: 'EV Charging Infrastructure', da: 'EV-ladeinfrastruktur' },
    description: { 
      en: 'Complete EV charging solutions from planning to implementation and maintenance.',
      da: 'Komplette EV-ladeløsninger fra planlægning til implementering og vedligeholdelse.'
    },
    features: {
      en: [
        'Site assessment & planning',
        'Charger installation & setup',
        'Network integration',
        'Payment system integration',
        'Maintenance & support',
      ],
      da: [
        'Stedvurdering og planlægning',
        'Installation og opsætning af ladere',
        'Netværksintegration',
        'Integration af betalingssystem',
        'Vedligeholdelse og support',
      ],
    },
    metrics: { coverage: '24/7', uptime: '99.9%', response: '<2hrs' }
  },
  {
    id: 3,
    icon: ServiceIcons.knowledge,
    category: 2,
    title: { en: 'Technical Training & Knowledge Transfer', da: 'Teknisk Træning og Vidensoverførsel' },
    description: { 
      en: 'Empowering local teams with skills and knowledge for sustainable technology management.',
      da: 'Styrker lokale teams med færdigheder og viden til bæredygtig teknologistyring.'
    },
    features: {
      en: [
        'Customized training programs',
        'Hands-on workshops',
        'Certification programs',
        'Remote learning platforms',
        'Continuous support & mentoring',
      ],
      da: [
        'Skræddersyede træningsprogrammer',
        'Praktiske workshops',
        'Certificeringsprogrammer',
        'Fjernundervisningsplatforme',
        'Løbende support og mentoring',
      ],
    },
    metrics: { trained: '5000+', retention: '92%', satisfaction: '98%' }
  },
  {
    id: 4,
    icon: ServiceIcons.technology,
    category: 2,
    title: { en: 'Smart Technology Integration', da: 'Smart Teknologiintegration' },
    description: { 
      en: 'Implementing cutting-edge IoT and automation solutions for improved efficiency.',
      da: 'Implementering af avancerede IoT- og automatiseringsløsninger for forbedret effektivitet.'
    },
    features: {
      en: [
        'IoT sensor deployment',
        'Data analytics platforms',
        'Process automation',
        'Predictive maintenance',
        'Real-time monitoring',
      ],
      da: [
        'IoT-sensorudrulning',
        'Dataanalyseplatforme',
        'Procesautomatisering',
        'Forudsigende vedligeholdelse',
        'Realtidsovervågning',
      ],
    },
    metrics: { efficiency: '+45%', downtime: '-60%', accuracy: '99.5%' }
  },
  {
    id: 5,
    icon: ServiceIcons.partnership,
    category: 3,
    title: { en: 'Strategic Partnership Development', da: 'Strategisk Partnerskabsudvikling' },
    description: { 
      en: 'Building bridges between international expertise and local implementation.',
      da: 'Bygger broer mellem international ekspertise og lokal implementering.'
    },
    features: {
      en: [
        'Partner identification & vetting',
        'Joint venture facilitation',
        'Contract negotiation',
        'Risk assessment',
        'Performance monitoring',
      ],
      da: [
        'Partneridentifikation og screening',
        'Joint venture-facilitering',
        'Kontraktforhandling',
        'Risikovurdering',
        'Performance overvågning',
      ],
    },
    metrics: { success: '95%', value: '$50M+', partners: '100+' }
  },
  {
    id: 6,
    icon: ServiceIcons.partnership,
    category: 3,
    title: { en: 'Innovation Consulting', da: 'Innovationsrådgivning' },
    description: { 
      en: 'Driving innovation through strategic consulting and technology adoption.',
      da: 'Driver innovation gennem strategisk rådgivning og teknologiadoption.'
    },
    features: {
      en: [
        'Innovation strategy development',
        'Technology roadmapping',
        'Digital transformation',
        'Change management',
        'Impact measurement',
      ],
      da: [
        'Udvikling af innovationsstrategi',
        'Teknologi-roadmapping',
        'Digital transformation',
        'Forandringsledelse',
        'Effektmåling',
      ],
    },
    metrics: { growth: '+35%', innovation: '80+', time: '-40%' }
  },
];
