-- Initial Data Seed
-- Run this after schema.sql to populate tables with default data

-- Insert content sections
INSERT INTO content_sections (section_key, title, content) VALUES
('hero_tagline', 'Building Reliable Connections for a Sustainable Future', 'At Digital Angel Energy, we combine technical expertise with practical experience to deliver seamless solutions for utility and energy infrastructure projects. Our focus is on ensuring that every installation — from large-scale solar parks to individual charging stations — is completed safely, efficiently, and to the highest standard.'),
('introduction', 'Who Are We?', 'At Digital Angel Energy, we combine technical expertise with practical experience to deliver seamless solutions for utility and energy infrastructure projects.

With a foundation built on strong project management, comprehensive site supervision, and deep material knowledge, we support our clients in achieving operational excellence and long-term reliability.

Vision: To be the leading partner in energy infrastructure development, creating efficient and sustainable solutions that power progress.

Mission: We provide end-to-end project management, material expertise, and technical advisory services to ensure every installation meets the highest standards of safety, quality, and performance.'),
('vision', 'Our Vision', 'We dream of a world where technology is not merely a privilege for the few but a transformative solution that empowers and uplifts communities globally. Through our efforts, we aim to be a catalyst for sustainable growth and innovation in developing countries. We are not just a company that talks about making a difference—we live and breathe it. We are the bridge connecting cutting-edge technology with the people who need it most.'),
('leader_message', 'A Message From Our Leader', 'As we embark on this journey in energy infrastructure, our commitment remains steadfast: to deliver projects that not only meet technical requirements but exceed expectations in safety, quality, and sustainability. We don''t just build installations — we build partnerships that power progress.'),
('conclusion', 'Our Commitment', 'We are committed to proven experience in managing complex infrastructure projects, maintaining trusted relationships with qualified installers and material suppliers, delivering technical excellence, and prioritizing safety, quality, and long-term customer satisfaction in every project.'),
('service_sustainable', '⚙️ Site Management & Project Coordination', 'We provide full-scope site management to ensure smooth project execution from planning through completion. Our approach emphasizes safety, quality, and transparent communication at every stage. End-to-end coordination of utility installation projects, on-site supervision and progress tracking, liaison between customers, installers, and suppliers, and assurance of compliance with industry and environmental standards.'),
('service_knowledge', '📦 Material Expertise & Procurement Solutions', 'Our material specialists bring extensive knowledge in selecting and approving high-quality components for energy and utility systems. We support customers in choosing the right materials to enhance performance, safety, and cost efficiency. Evaluation and approval of new materials, preparation of tenders and procurement documentation, and supply chain coordination through a reliable network of partners.'),
('service_outsourcing', '🔧 Technical Advisory & System Support', 'Digital Angel Energy serves as a trusted partner, offering technical insights and support throughout each project phase. We help clients integrate effective, future-ready solutions tailored to their unique operational needs. Expert advice on system design and installation best practices, technical supervision during setup and commissioning, and continuous collaboration with installers and system providers.'),
('service_partnerships', '🤝 Industries We Serve', 'Electric vehicle charging infrastructure, Renewable energy and solar installations, Commercial and industrial facilities, Private and small-scale energy solutions');

-- Insert team members
INSERT INTO team_members (name, role, bio, phone, email, linkedin_url, display_order) VALUES
('Dilwara Hasin', 'Chief Executive Officer', 'Leading Digital Angel Energy with vision and dedication to transform energy infrastructure in Bangladesh.', NULL, 'dilwara4@yahoo.com', NULL, 1),
('René Sørensen', 'Chief Consultant', 'Expert in European energy systems and infrastructure project management.', '+000000000', 'example@gmail.com', 'https://www.linkedin.com', 2),
('Rian Hoque', 'Consultant', 'Specializing in renewable energy solutions and client relations.', NULL, NULL, NULL, 3),
('Asad', 'Marketing Manager', 'Driving brand awareness and strategic partnerships.', NULL, NULL, NULL, 4),
('Kamauzzaman', 'Operations Manager', 'Managing project logistics and site operations.', NULL, NULL, NULL, 5);

-- Insert SDG goals
INSERT INTO sdg_goals (title, description, progress_percentage, icon_name, display_order) VALUES
('Renewable Energy', 'Solar and clean energy infrastructure development', 65, '☀️', 1),
('EV Infrastructure', 'Electric vehicle charging station installations', 55, '🔌', 2),
('Sustainable Systems', 'Energy-efficient and eco-friendly installations', 60, '🌱', 3);

-- Insert performance indicators
INSERT INTO performance_indicators (key_indicator, activity, data_outcome, display_order) VALUES
('Project Completion', 'Infrastructure installation projects', '98% on-time delivery', 1),
('Safety Standards', 'Site safety and compliance', '100% incident-free record', 2),
('Client Satisfaction', 'Customer feedback and retention', '95% satisfaction rating', 3);

-- Insert contact info
INSERT INTO contact_info (phone, email, address, cvr_number) VALUES
('+45 42806247', 'dilwara4@yahoo.com', 'Floraparken 4 A, 4690, Haslev, Denmark', '45339106');
