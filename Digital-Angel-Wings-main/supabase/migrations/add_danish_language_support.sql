-- Migration: Add Danish language support
-- This adds Danish columns to existing tables for bilingual content

-- Add Danish columns to content_sections
ALTER TABLE content_sections 
ADD COLUMN title_da TEXT,
ADD COLUMN content_da TEXT;

-- Add Danish columns to team_members
ALTER TABLE team_members 
ADD COLUMN role_da VARCHAR(100),
ADD COLUMN bio_da TEXT;

-- Add Danish columns to sdg_goals
ALTER TABLE sdg_goals 
ADD COLUMN title_da VARCHAR(100),
ADD COLUMN description_da TEXT;
-- Add Danish columns to performance_indicators
ALTER TABLE performance_indicators 
ADD COLUMN key_indicator_da TEXT,
ADD COLUMN activity_da TEXT,
ADD COLUMN data_outcome_da TEXT;

-- Rename existing columns to _en for clarity
ALTER TABLE content_sections 
RENAME COLUMN title TO title_en;
ALTER TABLE content_sections 
RENAME COLUMN content TO content_en;

ALTER TABLE team_members 
RENAME COLUMN role TO role_en;
ALTER TABLE team_members 
RENAME COLUMN bio TO bio_en;

ALTER TABLE sdg_goals 
RENAME COLUMN title TO title_en;
ALTER TABLE sdg_goals 
RENAME COLUMN description TO description_en;
ALTER TABLE performance_indicators 
RENAME COLUMN key_indicator TO key_indicator_en;
ALTER TABLE performance_indicators 
RENAME COLUMN activity TO activity_en;
ALTER TABLE performance_indicators 
RENAME COLUMN data_outcome TO data_outcome_en;

-- Add Danish translations for existing content_sections
UPDATE content_sections SET
  title_da = CASE section_key
    WHEN 'hero_tagline' THEN 'Digitale Englevinger – Din Bro Mellem Innovation og Bæredygtighed'
    WHEN 'introduction' THEN 'Hvem er vi?'
    WHEN 'vision' THEN 'Vores vision'
    WHEN 'leader_message' THEN 'En besked fra vores leder'
    WHEN 'conclusion' THEN 'Vores engagement'
    WHEN 'service_sustainable' THEN '⚙️ Stedsstyring og projektkoordinering'
    WHEN 'service_knowledge' THEN '📦 Materialeviden og indkøbsløsninger'
    WHEN 'service_outsourcing' THEN '🔧 Teknisk rådgivning og systemsupport'
    WHEN 'service_partnerships' THEN '🤝 Brancher vi betjener'
  END;
UPDATE content_sections SET
  content_da = CASE section_key
    WHEN 'hero_tagline' THEN 'Hos Digital Angel Energy kombinerer vi teknisk ekspertise med praktisk erfaring for at levere problemfri løsninger til forsynings- og energiinfrastrukturprojekter. Vores fokus er på at sikre, at hver installation — fra store solcelleparker til individuelle ladestationer — gennemføres sikkert, effektivt og til den højeste standard.'    WHEN 'introduction' THEN 'Hos Digital Angel Energy kombinerer vi teknisk ekspertise med praktisk erfaring for at levere problemfri løsninger til forsynings- og energiinfrastrukturprojekter.

Med et fundament bygget på stærk projektstyring, omfattende tilsyn på stedet og dyb materialeviden støtter vi vores kunder i at opnå operationel ekspertise og langsigtet pålidelighed.

Vision: At være den førende partner inden for energiinfrastrukturudvikling og skabe effektive og bæredygtige løsninger, der driver fremskridt.

Mission: Vi leverer end-to-end projektstyring, materialeviden og teknisk rådgivning for at sikre, at hver installation opfylder de højeste standarder for sikkerhed, kvalitet og ydeevne.'    WHEN 'vision' THEN 'Vi drømmer om en verden, hvor teknologi ikke blot er et privilegium for de få, men en transformerende løsning, der styrker og løfter samfund globalt. Gennem vores indsats sigter vi mod at være en katalysator for bæredygtig vækst og innovation i udviklingslande. Vi er ikke bare en virksomhed, der taler om at gøre en forskel — vi lever og ånder det. Vi er broen, der forbinder banebrydende teknologi med de mennesker, der har mest brug for den.'
    WHEN 'leader_message' THEN 'Mens vi påbegynder denne rejse inden for energiinfrastruktur, forbliver vores engagement urokkelig: at levere projekter, der ikke kun opfylder tekniske krav, men overgår forventningerne til sikkerhed, kvalitet og bæredygtighed. Vi bygger ikke bare installationer — vi bygger partnerskaber, der driver fremskridt.'
    WHEN 'conclusion' THEN 'Vi er forpligtede til dokumenteret erfaring med at styre komplekse infrastrukturprojekter, opretholde betroede relationer med kvalificerede installatører og materialeudleverandører, levere teknisk ekspertise og prioritere sikkerhed, kvalitet og langsigtet kundetilfredshed i hvert projekt.'    WHEN 'service_sustainable' THEN 'Vi leverer fuldskala stedsstyring for at sikre problemfri projektudførelse fra planlægning til færdiggørelse. Vores tilgang lægger vægt på sikkerhed, kvalitet og gennemsigtig kommunikation i hvert trin. End-to-end koordinering af forsyningsinstallationsprojekter, tilsyn på stedet og fremgangssporing, liaison mellem kunder, installatører og leverandører samt sikring af overholdelse af industri- og miljøstandarder.'    WHEN 'service_knowledge' THEN 'Vores materialespecialister bringer omfattende viden i at vælge og godkende højkvalitetskomponenter til energi- og forsyningssystemer. Vi støtter kunder i at vælge de rigtige materialer for at forbedre ydeevne, sikkerhed og omkostningseffektivitet. Evaluering og godkendelse af nye materialer, forberedelse af udbud og indkøbsdokumentation samt forsyningskædekoordinering gennem et pålideligt netværk af partnere.'
    WHEN 'service_outsourcing' THEN 'Digital Angel Energy fungerer som en betroet partner og tilbyder teknisk indsigt og support gennem hver projektfase. Vi hjælper kunder med at integrere effektive, fremtidssikrede løsninger skræddersyet til deres unikke operationelle behov. Ekspertrådgivning om systemdesign og installationsbest practices, teknisk tilsyn under opsætning og idriftsættelse samt kontinuerligt samarbejde med installatører og systemleverandører.'
    WHEN 'service_partnerships' THEN 'Elektrisk køretøjsladeinfrastruktur, Vedvarende energi og solinstallationer, Kommercielle og industrielle faciliteter, Private og små energiløsninger'
  END;
-- Add Danish translations for team_members
UPDATE team_members SET
  role_da = CASE role_en
    WHEN 'Chief Executive Officer' THEN 'Administrerende direktør'
    WHEN 'Chief Consultant' THEN 'Chefkonsulent'
    WHEN 'Consultant' THEN 'Konsulent'
    WHEN 'Marketing Manager' THEN 'Marketingchef'
    WHEN 'Operations Manager' THEN 'Driftschef'
  END,
  bio_da = CASE name
    WHEN 'Dilwara Hasin' THEN 'Leder Digital Angel Energy med vision og dedikation til at transformere energiinfrastruktur i Bangladesh.'
    WHEN 'René Sørensen' THEN 'Ekspert i europæiske energisystemer og infrastrukturprojektstyring.'
    WHEN 'Rian Hoque' THEN 'Specialiseret i vedvarende energiløsninger og kunderelationer.'
    WHEN 'Asad' THEN 'Driver brandbevædsthed og strategiske partnerskaber.'
    WHEN 'Kamauzzaman' THEN 'Styrer projektlogistik og stedsoperationer.'
  END;
-- Add Danish translations for sdg_goals
UPDATE sdg_goals SET
  title_da = CASE title_en
    WHEN 'Renewable Energy' THEN 'Vedvarende energi'
    WHEN 'EV Infrastructure' THEN 'EV-infrastruktur'
    WHEN 'Sustainable Systems' THEN 'Bæredygtige systemer'
  END,
  description_da = CASE title_en
    WHEN 'Renewable Energy' THEN 'Sol- og ren energiinfrastrukturudvikling'
    WHEN 'EV Infrastructure' THEN 'Installation af elektriske køretøjsladestationer'
    WHEN 'Sustainable Systems' THEN 'Energieffektive og miljøvenlige installationer'
  END;

-- Add Danish translations for performance_indicators
UPDATE performance_indicators SET
  key_indicator_da = CASE key_indicator_en
    WHEN 'Project Completion' THEN 'Projektfærdiggørelse'
    WHEN 'Safety Standards' THEN 'Sikkerhedsstandarder'
    WHEN 'Client Satisfaction' THEN 'Kundetilfredshed'
  END,
  activity_da = CASE key_indicator_en
    WHEN 'Project Completion' THEN 'Infrastrukturinstallationsprojekter'
    WHEN 'Safety Standards' THEN 'Stedssikkerhed og overholdelse'
    WHEN 'Client Satisfaction' THEN 'Kundefeedback og fastholdelse'
  END,
  data_outcome_da = CASE key_indicator_en
    WHEN 'Project Completion' THEN '98% levering til tiden'
    WHEN 'Safety Standards' THEN '100% hændelsesfri registrering'
    WHEN 'Client Satisfaction' THEN '95% tilfredshedsvurdering'
  END;
