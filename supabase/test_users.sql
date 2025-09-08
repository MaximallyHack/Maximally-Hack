-- Test Users for Role-Based Testing
-- Run this in your Supabase SQL editor to create test accounts

-- Note: These are test accounts. In a real production environment, 
-- users would be created through the normal registration process.

-- Insert test profiles (these will be linked to auth users you create manually)
-- After running this script, you can create accounts with these usernames:

-- Test Participant User
INSERT INTO public.profiles (
  id, 
  username, 
  name, 
  email, 
  role, 
  bio, 
  skills,
  location,
  github,
  linkedin
) VALUES (
  '11111111-1111-1111-1111-111111111111',  -- Replace with actual auth.users ID
  'testparticipant',
  'Test Participant',
  'participant@test.com',
  'participant',
  'I am a test participant who loves coding and hackathons!',
  ARRAY['React', 'JavaScript', 'Node.js', 'Python'],
  'San Francisco, CA',
  'github.com/testparticipant',
  'linkedin.com/in/testparticipant'
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Test Organizer User  
INSERT INTO public.profiles (
  id,
  username,
  name, 
  email,
  role,
  bio,
  skills,
  location,
  organized
) VALUES (
  '22222222-2222-2222-2222-222222222222',  -- Replace with actual auth.users ID
  'testorganizer',
  'Test Organizer', 
  'organizer@test.com',
  'organizer',
  'Experienced hackathon organizer passionate about bringing developers together!',
  ARRAY['Event Management', 'Community Building', 'Sponsorship'],
  'New York, NY',
  5
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Test Judge User
INSERT INTO public.profiles (
  id,
  username,
  name,
  email, 
  role,
  bio,
  skills,
  location,
  judged
) VALUES (
  '33333333-3333-3333-3333-333333333333',  -- Replace with actual auth.users ID
  'testjudge',
  'Test Judge',
  'judge@test.com', 
  'judge',
  'Senior software engineer and hackathon judge with 10+ years experience.',
  ARRAY['Software Architecture', 'Product Management', 'Technical Leadership'],
  'Austin, TX',
  15
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  name = EXCLUDED.name,
  role = EXCLUDED.role;

-- Create judge profile for the test judge
INSERT INTO public.judges (
  id,
  title,
  company,
  events_judged,
  rating,
  quote,
  availability,
  timezone,
  social
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'Senior Software Engineer',
  'Tech Corp Inc.',
  15,
  4.8,
  'Great code tells a story that anyone can understand.',
  'Available',
  'America/Chicago',
  '{"linkedin": "linkedin.com/in/testjudge", "twitter": "twitter.com/testjudge"}'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  company = EXCLUDED.company,
  events_judged = EXCLUDED.events_judged;

-- Create a sample event for testing
INSERT INTO public.events (
  id,
  slug,
  title,
  tagline,
  description,
  long_description,
  start_date,
  end_date,
  registration_open,
  registration_close,
  submission_open,
  submission_close,
  status,
  format,
  location,
  prize_pool,
  max_team_size,
  participant_count,
  organizer_id,
  tracks,
  tags
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'test-hackathon-2024',
  'Test Hackathon 2024',
  'A hackathon for testing our platform',
  'This is a test hackathon event for validating our platform functionality.',
  'Join us for an amazing 48-hour hackathon where you can test all features of our platform. This event is specifically designed for testing purposes and includes all the workflows you would expect in a real hackathon.',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '9 days', 
  NOW(),
  NOW() + INTERVAL '6 days',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '9 days',
  'registration_open',
  'hybrid',
  'San Francisco, CA / Online',
  10000,
  4,
  0,
  '22222222-2222-2222-2222-222222222222', -- Test organizer
  ARRAY['Web Development', 'Mobile Apps', 'AI/ML', 'Blockchain'],
  ARRAY['hackathon', 'coding', 'innovation', 'test']
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  organizer_id = EXCLUDED.organizer_id;

-- Create a test team
INSERT INTO public.teams (
  id,
  name,
  description,
  event_id,
  leader_id,
  max_size,
  join_code,
  skills,
  looking_for,
  track,
  status
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Test Team Alpha',
  'A test team for validating team functionality',
  '44444444-4444-4444-4444-444444444444',
  '11111111-1111-1111-1111-111111111111', -- Test participant as leader
  4,
  'TEST01',
  ARRAY['React', 'Node.js', 'PostgreSQL'],
  ARRAY['UI/UX Designer', 'Data Scientist'],
  'Web Development',
  'recruiting'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  leader_id = EXCLUDED.leader_id;

-- Add team member
INSERT INTO public.team_members (
  team_id,
  user_id,
  role,
  joined_at
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  '11111111-1111-1111-1111-111111111111',
  'leader',
  NOW()
) ON CONFLICT (team_id, user_id) DO UPDATE SET
  role = EXCLUDED.role;

-- Instructions for manual setup:
-- 
-- 1. Go to your Supabase Auth dashboard
-- 2. Create three test users manually:
--    - Email: participant@test.com, Password: testpassword123
--    - Email: organizer@test.com, Password: testpassword123  
--    - Email: judge@test.com, Password: testpassword123
-- 
-- 3. After creating each user, copy their auth.users.id and replace the UUIDs above
-- 4. Run this script to create the profile data
-- 
-- 5. Now you can login as:
--    - Participant: participant@test.com / testpassword123
--    - Organizer: organizer@test.com / testpassword123
--    - Judge: judge@test.com / testpassword123

-- Temporary function to help update user roles (for development only)
CREATE OR REPLACE FUNCTION update_user_role(user_email TEXT, new_role TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles 
  SET role = new_role 
  WHERE id = (
    SELECT id FROM auth.users WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage examples:
-- SELECT update_user_role('your-email@example.com', 'organizer');
-- SELECT update_user_role('your-email@example.com', 'judge');
-- SELECT update_user_role('your-email@example.com', 'participant');
