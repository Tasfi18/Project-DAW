-- Digital Angel Wings Services - Correct Data
INSERT INTO services (slug, title_en, title_da, description_en, description_da, features_en, features_da, icon_name, display_order, is_active) VALUES
(
  'site-management-project-coordination',
  'Site Management & Project Coordination',
  'Stedstyring & Projektkoordinering',
  'We provide full-scope site management to ensure smooth project execution from planning through completion. Our approach emphasizes safety, quality, and transparent communication at every stage.',
  'Vi leverer fuldspektret stedstyring for at sikre problemfri projektudførelse fra planlægning til færdiggørelse. Vores tilgang lægger vægt på sikkerhed, kvalitet og gennemsigtig kommunikation i alle faser.',
  ARRAY['End-to-end coordination of utility installation projects', 'On-site supervision and progress tracking', 'Liaison between customers, installers, and suppliers', 'Assurance of compliance with industry and environmental standards'],
  ARRAY['Ende-til-ende koordinering af forsyningsinstallationsprojekter', 'On-site supervision og fremskridt tracking', 'Forbindelse mellem kunder, installatører og leverandører', 'Sikring af overholdelse af industri- og miljøstandarder'],
  'partnership',
  1,
  true
),
(
  'material-expertise-procurement-solutions',
  'Material Expertise & Procurement Solutions',
  'Materialeekspertise & Indkøbsløsninger',
  'Our material specialists bring extensive knowledge in selecting and approving high-quality components for energy and utility systems. We support customers in choosing the right materials to enhance performance, safety, and cost efficiency.',
  'Vores materialespecialister har omfattende viden om valg og godkendelse af højkvalitetskomponenter til energi- og forsyningssystemer. Vi støtter kunder i at vælge de rigtige materialer for at forbedre ydeevne, sikkerhed og omkostningseffektivitet.',
  ARRAY['Evaluation and approval of new materials', 'Preparation of tenders and procurement documentation', 'Supply chain coordination through a reliable network of partners'],
  ARRAY['Evaluering og godkendelse af nye materialer', 'Forberedelse af udbud og indkøbsdokumentation', 'Supply chain koordinering gennem et pålideligt netværk af partnere'],
  'technology',
  2,
  true
),
(
  'technical-advisory-system-support',
  'Technical Advisory & System Support',
  'Teknisk Rådgivning & Systemsupport',
  'Digital Angel Energy serves as a trusted partner, offering technical insights and support throughout each project phase. We help clients integrate effective, future-ready solutions tailored to their unique operational needs.',
  'Digital Angel Energy fungerer som en betroet partner, der tilbyder teknisk indsigt og support gennem hver projektfase. Vi hjælper kunder med at integrere effektive, fremtidssikre løsninger, der er skræddersyet til deres unikke operationelle behov.',
  ARRAY['Expert advice on system design and installation best practices', 'Technical supervision during setup and commissioning', 'Continuous collaboration with installers and system providers'],
  ARRAY['Ekspertrådgivning om systemdesign og installationsbest practices', 'Teknisk supervision under opsætning og ibrugtagning', 'Løbende samarbejde med installatører og systemudbydere'],
  'knowledge',
  3,
  true
);
