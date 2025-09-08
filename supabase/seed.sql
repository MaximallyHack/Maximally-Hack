    -- Maximally Hack Platform - Data Seeding Script
-- This script migrates the JSON fixtures data to Supabase tables

-- Insert demo users first (needed for foreign key references)
INSERT INTO public.profiles (
  id, username, name, avatar, role, bio, skills, location, github, linkedin, 
  twitter, website, hackathons_participated, wins, finals, organized, judged, badges
) VALUES 
-- Regular participants
(
  uuid_generate_v4(),
  'alexdeveloper',
  'Alex Chen',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'participant',
  'Full-stack developer passionate about AI and social impact. Love building solutions that make a difference.',
  ARRAY['React', 'Node.js', 'Python', 'AI/ML'],
  'San Francisco, CA',
  'alexdeveloper',
  'alexchen',
  'alexdev',
  'https://alexchen.dev',
  12, 3, 8, 0, 0,
  ARRAY['AI Innovator', 'First Place Winner', 'Community Contributor']
),
(
  uuid_generate_v4(),
  'designerguru',
  'Sarah Williams',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'participant',
  'UX/UI designer with a passion for creating beautiful and accessible user experiences.',
  ARRAY['Figma', 'UI/UX', 'Prototyping', 'User Research'],
  'New York, NY',
  'designerguru',
  'sarahwilliams',
  'sarahdesigns',
  'https://sarahwilliams.design',
  8, 2, 5, 0, 0,
  ARRAY['Design Master', 'People''s Choice', 'Accessibility Champion']
),
-- Organizer
(
  uuid_generate_v4(),
  'techforgood',
  'TechForGood Foundation',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  'organizer',
  'Non-profit organization dedicated to using technology for social good and positive impact.',
  ARRAY['Event Management', 'Community Building', 'Social Impact'],
  'Global',
  null,
  null,
  null,
  'https://techforgood.org',
  0, 0, 0, 15, 0,
  ARRAY['Organizer Excellence', 'Community Builder', 'Impact Champion']
),
-- Judges
(
  uuid_generate_v4(),
  'sarahchen',
  'Dr. Sarah Chen',
  'https://images.unsplash.com/photo-1494790108755-2616b612b829?w=100&h=100&fit=crop&crop=face',
  'judge',
  'AI Research Director at Google with 15+ years of experience in machine learning and artificial intelligence.',
  ARRAY['AI', 'Machine Learning', 'Research', 'Deep Learning'],
  'Mountain View, CA',
  null,
  'drsarahchen',
  'sarahchen_ai',
  'https://ai.google/research/people/SarahChen',
  0, 0, 0, 0, 25,
  ARRAY['Expert Judge', 'AI Pioneer', 'Research Excellence']
),
(
  uuid_generate_v4(),
  'markrodriguez',
  'Mark Rodriguez',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'judge',
  'CTO at HealthTech Innovations, leading the development of next-generation healthcare solutions.',
  ARRAY['Healthcare Tech', 'Leadership', 'Product Strategy', 'Engineering'],
  'Boston, MA',
  null,
  'markrodrigueztech',
  'marktech',
  'https://healthtechinnovations.com',
  0, 0, 0, 0, 18,
  ARRAY['Healthcare Expert', 'CTO Excellence', 'Innovation Leader']
),
(
  uuid_generate_v4(),
  'lisathompson',
  'Lisa Thompson',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  'judge',
  'Head of Sustainability at Microsoft, leading climate tech initiatives and environmental policy.',
  ARRAY['Climate Technology', 'Sustainability', 'Environmental Policy', 'Green Tech'],
  'Seattle, WA',
  null,
  'lisathompson',
  'lisa_climate',
  'https://microsoft.com/sustainability',
  0, 0, 0, 0, 22,
  ARRAY['Climate Champion', 'Sustainability Expert', 'Policy Leader']
);

-- Get user IDs for references (store in variables)
-- In a real migration, you'd want to use the actual UUIDs or create a mapping table

-- Insert demo events
INSERT INTO public.events (
  slug, title, tagline, description, long_description, start_date, end_date,
  registration_open, registration_close, submission_open, submission_close,
  status, format, location, prize_pool, max_team_size, participant_count,
  organizer_id, tracks, tags, sponsors,
  socials, links, hero, criteria, why_join, gallery, eligibility, community, contact, prizes, timeline, rules, faqs
) VALUES 
(
  'ai-for-good-challenge',
  'Maximally AI Shipathon',
  '48-hour global hackathon for the curious, the chaotic, and the creative',
  'Build something real in 48 hours. Whether you''re a coder, artist, student, or first-time builder — if you''re excited about AI, this is your playground.',
  '🧠 **Maximally AI Shipathon** is a **48-hour global hackathon** for the curious, the chaotic, and the creative. Whether you''re a coder, artist, student, or first-time builder — if you''re excited about AI and want to build something real, this event is for you.',
  '2025-08-30T00:00:00Z',
  '2025-09-01T00:00:00Z',
  '2025-07-01T00:00:00Z',
  '2025-08-29T23:59:59Z',
  '2025-08-30T00:00:00Z',
  '2025-08-31T23:59:59Z',
  'upcoming',
  'hybrid',
  'Online + Chandigarh',
  10000,
  4,
  1573,
  (SELECT id FROM public.profiles WHERE username = 'techforgood' LIMIT 1),
  ARRAY['🛠️ Build with AI', '🎨 Create with AI', '🧪 Experiment with AI'],
  ARRAY['AI', 'Shipathon', '48h', 'Global'],
  ARRAY['google', 'microsoft', 'openai', 'nvidia'],
  '{"instagram": "https://instagram.com/maximallyhack", "linkedin": "https://linkedin.com/company/maximally", "youtube": "https://youtube.com/@maximallyhack", "twitter": "https://twitter.com/maximallyhack"}',
  '{"website": "https://www.maximally.in", "registration": "https://maximally-ai-shipathon-2025.devpost.com/", "devpost": "https://maximally-ai-shipathon-2025.devpost.com/", "discord": "https://discord.gg/S2YyGtBWKa", "email": "hello@maximally.in", "instagram": "https://instagram.com/maximally.in"}',
  '{"coverImage": "/api/placeholder/1200/600", "promoVideo": "https://youtu.be/v5Ah9H-f94E?si=E-7dfnkhqZ87XG5X", "countdown": true}',
  '[{"name": "Originality & Creativity", "percentage": 25, "description": "Is it fresh and unexpected?"}, {"name": "Execution", "percentage": 25, "description": "Does it work or at least demo clearly?"}, {"name": "Clarity", "percentage": 20, "description": "Can we understand it easily?"}, {"name": "AI Use", "percentage": 20, "description": "Was AI used meaningfully?"}, {"name": "Beginner Spirit", "percentage": 10, "description": "Bonus for first-timers or clever hacks"}]',
  ARRAY['🎯 Build anything AI-powered - code, no-code, or prompt your way through', '🚀 First-time builders welcome - no experience needed, just energy and ideas', '🎨 Three awesome tracks: Build, Create, or Experiment with AI', '🛠️ Use any tools - from OpenAI to Glide, RunwayML to Replit', '🌍 Join a global playground where weird is welcome and creativity wins'],
  '[{"id": "shipathon-promo", "type": "video", "src": "https://www.youtube.com/embed/v5Ah9H-f94E", "thumbnail": "https://img.youtube.com/vi/v5Ah9H-f94E/maxresdefault.jpg", "alt": "Maximally AI Shipathon 2025 Promo", "caption": "Official promo - Build fast, ship smarter"}]',
  '{"age": "Global, all ages, all skill levels", "teamSize": "Solo or teams up to 4", "ipPolicy": "Teams retain full ownership of their projects", "codeOfConduct": "https://maximally.ai/code-of-conduct"}',
  '{"discord": "https://discord.gg/S2YyGtBWKa", "responseTime": "< 1 hour during event"}',
  '{"name": "Maximally Team", "email": "hello@maximally.in", "organizer": "Aryan Khurana & Team Maximally"}',
  '[{"place": 1, "amount": 3000, "title": "Most Creative Build", "description": "For the most original and unexpected creation"}, {"place": 2, "amount": 2000, "title": "Best First-Timer", "description": "For outstanding work by a first-time builder"}, {"place": 3, "amount": 1500, "title": "Peoples Choice", "description": "Voted by the community"}]',
  '[{"time": "Aug 30, 12:00 AM IST", "title": "Shipathon Begins!", "description": "Start building - registration on Devpost, join Discord", "isActive": false, "isCompleted": false}]',
  ARRAY['Teams of 1-4 builders - solo builders welcome too', 'No prebuilt projects - all builds must start after Aug 30, 12:00 AM IST', 'Project must be safe, respectful, and follow our code of conduct'],
  '[{"question": "What''s the difference between this and a regular hackathon?", "answer": "This is a shipathon focused on building real AI-powered projects! Whether you code, no-code, or prompt your way through - it''s all about creativity and making something that works."}]'
);

-- Insert judge profiles into judges table (extends profiles)
INSERT INTO public.judges (
  id, title, company, events_judged, rating, quote, availability, timezone, social
) VALUES 
(
  (SELECT id FROM public.profiles WHERE username = 'sarahchen' LIMIT 1),
  'AI Research Director',
  'Google',
  25,
  4.9,
  'I love seeing how young innovators apply AI to solve real-world problems.',
  'Available',
  'PST',
  '{"linkedin": "drsarahchen", "twitter": "sarahchen_ai", "website": "https://ai.google/research/people/SarahChen"}'
),
(
  (SELECT id FROM public.profiles WHERE username = 'markrodriguez' LIMIT 1),
  'CTO',
  'HealthTech Innovations',
  18,
  4.8,
  'Healthcare technology has the power to save lives and improve outcomes for everyone.',
  'Available',
  'EST',
  '{"linkedin": "markrodrigueztech", "twitter": "marktech", "website": "https://healthtechinnovations.com"}'
),
(
  (SELECT id FROM public.profiles WHERE username = 'lisathompson' LIMIT 1),
  'Head of Sustainability',
  'Microsoft',
  22,
  4.9,
  'Technology is our most powerful tool in the fight against climate change.',
  'Available',
  'PST',
  '{"linkedin": "lisathompson", "twitter": "lisa_climate", "website": "https://microsoft.com/sustainability"}'
);

-- Insert demo teams
INSERT INTO public.teams (
  name, description, event_id, leader_id, join_code, skills, looking_for, track, status
) VALUES 
(
  'AI Innovators',
  'Looking for frontend developers and designers to build healthcare AI solutions.',
  (SELECT id FROM public.events WHERE slug = 'ai-for-good-challenge' LIMIT 1),
  (SELECT id FROM public.profiles WHERE username = 'alexdeveloper' LIMIT 1),
  'ABC123',
  ARRAY['AI', 'Healthcare', 'Frontend', 'Design'],
  ARRAY['Frontend Developer', 'Designer'],
  'Healthcare',
  'recruiting'
),
(
  'Climate Warriors',
  'Passionate about environmental solutions. Need data scientists and developers.',
  (SELECT id FROM public.events WHERE slug = 'ai-for-good-challenge' LIMIT 1),
  (SELECT id FROM public.profiles WHERE username = 'designerguru' LIMIT 1),
  'XYZ789',
  ARRAY['Environmental Science', 'Data Analysis'],
  ARRAY['Data Scientist', 'Backend Developer'],
  'Climate',
  'recruiting'
);

-- Insert team members
INSERT INTO public.team_members (team_id, user_id, role) VALUES 
(
  (SELECT id FROM public.teams WHERE name = 'AI Innovators' LIMIT 1),
  (SELECT id FROM public.profiles WHERE username = 'alexdeveloper' LIMIT 1),
  'leader'
),
(
  (SELECT id FROM public.teams WHERE name = 'AI Innovators' LIMIT 1),
  (SELECT id FROM public.profiles WHERE username = 'designerguru' LIMIT 1),
  'member'
),
(
  (SELECT id FROM public.teams WHERE name = 'Climate Warriors' LIMIT 1),
  (SELECT id FROM public.profiles WHERE username = 'designerguru' LIMIT 1),
  'leader'
);

-- Insert demo submissions
INSERT INTO public.submissions (
  title, tagline, description, long_description, event_id, team_id, submitted_by,
  track, tags, tech_stack, demo_url, github_url, slides_url, video_url,
  images, status, features, awards, submitted_at
) VALUES 
(
  'HealthAI Assistant',
  'AI-powered virtual health assistant',
  'AI-powered virtual health assistant that provides personalized medical guidance and symptom checking using advanced natural language processing and medical knowledge databases.',
  'HealthAI Assistant is a comprehensive virtual health companion that leverages cutting-edge AI to provide personalized medical guidance, symptom analysis, and health recommendations.',
  (SELECT id FROM public.events WHERE slug = 'ai-for-good-challenge' LIMIT 1),
  (SELECT id FROM public.teams WHERE name = 'AI Innovators' LIMIT 1),
  (SELECT id FROM public.profiles WHERE username = 'alexdeveloper' LIMIT 1),
  'Healthcare',
  ARRAY['AI', 'Healthcare', 'NLP', 'React', 'Python'],
  ARRAY['React', 'Python', 'TensorFlow', 'OpenAI API', 'FastAPI'],
  'https://healthai-demo.example.com',
  'https://github.com/team1/healthai-assistant',
  'https://slides.example.com/healthai',
  'https://youtube.com/watch?v=healthai',
  ARRAY['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop'],
  'submitted',
  ARRAY['Symptom analysis and triage', 'Personalized health recommendations', 'Medical knowledge base integration', 'Privacy-first design', 'Multi-language support'],
  ARRAY['Finalist', 'Healthcare Track Winner'],
  '2024-12-17T15:30:00Z'
);

-- Insert demo scorecards
INSERT INTO public.scorecards (
  submission_id, judge_id, event_id, scores, total_score, feedback, status, time_spent, submitted_at
) VALUES 
(
  (SELECT id FROM public.submissions WHERE title = 'HealthAI Assistant' LIMIT 1),
  (SELECT id FROM public.profiles WHERE username = 'sarahchen' LIMIT 1),
  (SELECT id FROM public.events WHERE slug = 'ai-for-good-challenge' LIMIT 1),
  '{"impact": 9, "technical": 8, "creativity": 8, "presentation": 9}',
  8.5,
  'Excellent use of AI for healthcare accessibility. Strong technical implementation.',
  'submitted',
  45,
  '2024-12-17T20:30:00Z'
),
(
  (SELECT id FROM public.submissions WHERE title = 'HealthAI Assistant' LIMIT 1),
  (SELECT id FROM public.profiles WHERE username = 'markrodriguez' LIMIT 1),
  (SELECT id FROM public.events WHERE slug = 'ai-for-good-challenge' LIMIT 1),
  '{"impact": 10, "technical": 9, "creativity": 9, "presentation": 8}',
  9.0,
  'Impressive healthcare application with real-world potential. Great user experience.',
  'submitted',
  52,
  '2024-12-17T19:45:00Z'
);

-- Insert user projects relationships
INSERT INTO public.user_projects (user_id, submission_id, role) VALUES 
(
  (SELECT id FROM public.profiles WHERE username = 'alexdeveloper' LIMIT 1),
  (SELECT id FROM public.submissions WHERE title = 'HealthAI Assistant' LIMIT 1),
  'creator'
),
(
  (SELECT id FROM public.profiles WHERE username = 'designerguru' LIMIT 1),
  (SELECT id FROM public.submissions WHERE title = 'HealthAI Assistant' LIMIT 1),
  'contributor'
);
