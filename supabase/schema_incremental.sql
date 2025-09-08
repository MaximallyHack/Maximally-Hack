    -- Maximally Hack Platform - Incremental Schema Updates
-- This schema works with your existing profiles table and adds what's missing

-- First, let's add missing columns to your existing profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS role text DEFAULT 'participant' CHECK (role IN ('participant', 'organizer', 'judge')),
  ADD COLUMN IF NOT EXISTS hackathons_participated integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wins integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS finals integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS organized integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS judged integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS badges text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS expertise text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS join_date timestamptz DEFAULT now();

-- Update join_date to match created_at for existing records
UPDATE public.profiles SET join_date = created_at WHERE join_date IS NULL;

-- Update skills column to be array type if it's not already
-- (Skip this if your skills column is already text[])
-- ALTER TABLE public.profiles ALTER COLUMN skills TYPE text[] USING string_to_array(skills, ',');

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  tagline text,
  description text not null,
  long_description text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  registration_open timestamptz,
  registration_close timestamptz,
  submission_open timestamptz,
  submission_close timestamptz,
  status text not null default 'upcoming' check (status in ('upcoming', 'active', 'completed', 'registration_open')),
  format text not null default 'online' check (format in ('online', 'in-person', 'hybrid')),
  location text not null,
  prize_pool integer default 0,
  max_team_size integer default 4,
  participant_count integer default 0,
  organizer_id uuid references public.profiles(id),
  tracks text[] default '{}',
  tags text[] default '{}',
  judges uuid[] default '{}',
  sponsors text[] default '{}',
  
  -- JSON fields for complex data
  socials jsonb default '{}',
  links jsonb default '{}',
  hero jsonb default '{}',
  criteria jsonb default '[]',
  why_join text[] default '{}',
  gallery jsonb default '[]',
  eligibility jsonb default '{}',
  community jsonb default '{}',
  contact jsonb default '{}',
  prizes jsonb default '[]',
  timeline jsonb default '[]',
  rules text[] default '{}',
  faqs jsonb default '[]',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  event_id uuid references public.events(id) on delete cascade,
  leader_id uuid references public.profiles(id),
  max_size integer default 4,
  join_code text unique not null,
  skills text[] default '{}',
  looking_for text[] default '{}',
  track text,
  status text not null default 'recruiting' check (status in ('recruiting', 'full', 'disbanded')),
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Team members table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('leader', 'member')),
  joined_at timestamptz default now(),
  
  unique(team_id, user_id)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  tagline text,
  description text not null,
  long_description text,
  event_id uuid references public.events(id) on delete cascade,
  team_id uuid references public.teams(id),
  submitted_by uuid references public.profiles(id),
  track text,
  tags text[] default '{}',
  tech_stack text[] default '{}',
  demo_url text,
  github_url text,
  slides_url text,
  video_url text,
  images text[] default '{}',
  status text not null default 'draft' check (status in ('draft', 'submitted', 'judging', 'judged')),
  features text[] default '{}',
  average_score decimal(3,2),
  awards text[] default '{}',
  
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Judges table (extends profiles for judges)
CREATE TABLE IF NOT EXISTS public.judges (
  id uuid references public.profiles(id) primary key,
  title text not null,
  company text not null,
  events_judged integer default 0,
  rating decimal(2,1) default 0,
  quote text,
  availability text default 'Available' check (availability in ('Available', 'Limited', 'Unavailable')),
  timezone text,
  social jsonb default '{}',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Scorecards table
CREATE TABLE IF NOT EXISTS public.scorecards (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid references public.submissions(id) on delete cascade,
  judge_id uuid references public.judges(id),
  event_id uuid references public.events(id) on delete cascade,
  
  -- Scores (can be customized per event)
  scores jsonb not null, -- e.g., {"impact": 9, "technical": 8, "creativity": 8, "presentation": 9}
  total_score decimal(3,2),
  feedback text,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  time_spent integer, -- in minutes
  
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  unique(submission_id, judge_id)
);

-- Event judge assignments (many-to-many)
CREATE TABLE IF NOT EXISTS public.event_judges (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  judge_id uuid references public.judges(id) on delete cascade,
  assigned_at timestamptz default now(),
  
  unique(event_id, judge_id)
);

-- User projects table (for tracking user's submissions across events)
CREATE TABLE IF NOT EXISTS public.user_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete cascade,
  role text default 'contributor' check (role in ('creator', 'contributor')),
  
  created_at timestamptz default now(),
  
  unique(user_id, submission_id)
);

-- Indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
CREATE INDEX IF NOT EXISTS events_slug_idx ON public.events(slug);
CREATE INDEX IF NOT EXISTS events_status_idx ON public.events(status);
CREATE INDEX IF NOT EXISTS events_organizer_idx ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS teams_event_idx ON public.teams(event_id);
CREATE INDEX IF NOT EXISTS teams_leader_idx ON public.teams(leader_id);
CREATE INDEX IF NOT EXISTS team_members_team_idx ON public.team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_user_idx ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS submissions_event_idx ON public.submissions(event_id);
CREATE INDEX IF NOT EXISTS submissions_team_idx ON public.submissions(team_id);
CREATE INDEX IF NOT EXISTS submissions_status_idx ON public.submissions(status);
CREATE INDEX IF NOT EXISTS scorecards_submission_idx ON public.scorecards(submission_id);
CREATE INDEX IF NOT EXISTS scorecards_judge_idx ON public.scorecards(judge_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Events policies
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
CREATE POLICY "Events are viewable by everyone" ON public.events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Organizers can create events" ON public.events;
CREATE POLICY "Organizers can create events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

DROP POLICY IF EXISTS "Organizers can update their events" ON public.events;
CREATE POLICY "Organizers can update their events" ON public.events
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Teams policies
DROP POLICY IF EXISTS "Teams are viewable by everyone" ON public.teams;
CREATE POLICY "Teams are viewable by everyone" ON public.teams
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create teams" ON public.teams;
CREATE POLICY "Authenticated users can create teams" ON public.teams
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Team leaders can update their teams" ON public.teams;
CREATE POLICY "Team leaders can update their teams" ON public.teams
  FOR UPDATE USING (auth.uid() = leader_id);

-- Team members policies
DROP POLICY IF EXISTS "Team members are viewable by everyone" ON public.team_members;
CREATE POLICY "Team members are viewable by everyone" ON public.team_members
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Team leaders can manage team members" ON public.team_members;
CREATE POLICY "Team leaders can manage team members" ON public.team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_members.team_id
      AND teams.leader_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can join teams" ON public.team_members;
CREATE POLICY "Users can join teams" ON public.team_members
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Submissions policies
DROP POLICY IF EXISTS "Submissions are viewable by everyone" ON public.submissions;
CREATE POLICY "Submissions are viewable by everyone" ON public.submissions
  FOR SELECT USING (status = 'submitted');

DROP POLICY IF EXISTS "Users can create submissions" ON public.submissions;
CREATE POLICY "Users can create submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Submission owners can update their submissions" ON public.submissions;
CREATE POLICY "Submission owners can update their submissions" ON public.submissions
  FOR UPDATE USING (auth.uid() = submitted_by);

-- Judges policies
DROP POLICY IF EXISTS "Judges are viewable by everyone" ON public.judges;
CREATE POLICY "Judges are viewable by everyone" ON public.judges
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Judges can update their own profile" ON public.judges;
CREATE POLICY "Judges can update their own profile" ON public.judges
  FOR UPDATE USING (auth.uid() = id);

-- Scorecards policies
DROP POLICY IF EXISTS "Judges can view all scorecards" ON public.scorecards;
CREATE POLICY "Judges can view all scorecards" ON public.scorecards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.judges WHERE judges.id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Judges can create their own scorecards" ON public.scorecards;
CREATE POLICY "Judges can create their own scorecards" ON public.scorecards
  FOR INSERT WITH CHECK (auth.uid() = judge_id);

DROP POLICY IF EXISTS "Judges can update their own scorecards" ON public.scorecards;
CREATE POLICY "Judges can update their own scorecards" ON public.scorecards
  FOR UPDATE USING (auth.uid() = judge_id);

-- Event judges policies
DROP POLICY IF EXISTS "Event judges are viewable by everyone" ON public.event_judges;
CREATE POLICY "Event judges are viewable by everyone" ON public.event_judges
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Event organizers can assign judges" ON public.event_judges;
CREATE POLICY "Event organizers can assign judges" ON public.event_judges
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.events
      WHERE events.id = event_judges.event_id
      AND events.organizer_id = auth.uid()
    )
  );

-- User projects policies
DROP POLICY IF EXISTS "User projects are viewable by everyone" ON public.user_projects;
CREATE POLICY "User projects are viewable by everyone" ON public.user_projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can add their own projects" ON public.user_projects;
CREATE POLICY "Users can add their own projects" ON public.user_projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic updates

-- Function to generate unique join codes for teams
CREATE OR REPLACE FUNCTION generate_join_code()
RETURNS text AS $$
DECLARE
  code text;
  exists_check boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 6));
    SELECT exists(SELECT 1 FROM public.teams WHERE join_code = code) INTO exists_check;
    IF NOT exists_check THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ language plpgsql;

-- Function to update submission average scores
CREATE OR REPLACE FUNCTION update_submission_average_score()
RETURNS trigger AS $$
BEGIN
  UPDATE public.submissions
  SET average_score = (
    SELECT avg(total_score)
    FROM public.scorecards
    WHERE submission_id = COALESCE(NEW.submission_id, OLD.submission_id)
    AND status = 'submitted'
  )
  WHERE id = COALESCE(NEW.submission_id, OLD.submission_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ language plpgsql;

-- Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS update_avg_score_trigger ON public.scorecards;
CREATE TRIGGER update_avg_score_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.scorecards
  FOR EACH ROW EXECUTE FUNCTION update_submission_average_score();

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create updated_at triggers for tables that have updated_at column
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_teams_updated_at ON public.teams;
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_submissions_updated_at ON public.submissions;
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_judges_updated_at ON public.judges;
CREATE TRIGGER update_judges_updated_at BEFORE UPDATE ON public.judges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scorecards_updated_at ON public.scorecards;
CREATE TRIGGER update_scorecards_updated_at BEFORE UPDATE ON public.scorecards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
