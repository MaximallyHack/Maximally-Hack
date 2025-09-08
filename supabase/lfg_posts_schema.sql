-- LFG (Looking for Group) Posts table
-- This table stores posts from individuals looking for teams or teams looking for members

CREATE TABLE IF NOT EXISTS public.lfg_posts (
  id uuid primary key default uuid_generate_v4(),
  
  -- Post content
  title text not null,
  description text not null,
  type text not null check (type in ('individual', 'team')),
  
  -- Relationships
  user_id uuid references public.profiles(id) on delete cascade, -- For individual posts
  team_id uuid references public.teams(id) on delete cascade, -- For team posts
  event_id uuid references public.events(id) on delete cascade, -- Optional: specific to an event
  
  -- Post details
  skills text[] default '{}',
  preferred_roles text[] default '{}', -- For individuals
  looking_for text[] default '{}', -- For teams
  availability text, -- e.g., "Full-time", "Part-time", "Weekends only"
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  
  -- Status and metadata
  status text not null default 'active' check (status in ('active', 'inactive', 'fulfilled')),
  posted_at timestamptz default now(),
  expires_at timestamptz, -- Optional expiration
  
  -- Constraints
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  -- Either user_id OR team_id must be set, but not both
  constraint check_post_owner check (
    (user_id is not null and team_id is null) or 
    (user_id is null and team_id is not null)
  )
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS lfg_posts_type_idx ON public.lfg_posts(type);
CREATE INDEX IF NOT EXISTS lfg_posts_status_idx ON public.lfg_posts(status);
CREATE INDEX IF NOT EXISTS lfg_posts_user_idx ON public.lfg_posts(user_id);
CREATE INDEX IF NOT EXISTS lfg_posts_team_idx ON public.lfg_posts(team_id);
CREATE INDEX IF NOT EXISTS lfg_posts_event_idx ON public.lfg_posts(event_id);
CREATE INDEX IF NOT EXISTS lfg_posts_posted_at_idx ON public.lfg_posts(posted_at);

-- Row Level Security
ALTER TABLE public.lfg_posts ENABLE ROW LEVEL SECURITY;

-- LFG posts policies
DROP POLICY IF EXISTS "LFG posts are viewable by everyone" ON public.lfg_posts;
CREATE POLICY "LFG posts are viewable by everyone" ON public.lfg_posts
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Users can create individual LFG posts" ON public.lfg_posts;
CREATE POLICY "Users can create individual LFG posts" ON public.lfg_posts
  FOR INSERT WITH CHECK (
    type = 'individual' AND 
    auth.uid() = user_id AND 
    team_id IS NULL
  );

DROP POLICY IF EXISTS "Team leaders can create team LFG posts" ON public.lfg_posts;
CREATE POLICY "Team leaders can create team LFG posts" ON public.lfg_posts
  FOR INSERT WITH CHECK (
    type = 'team' AND 
    user_id IS NULL AND
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = lfg_posts.team_id
      AND teams.leader_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Post owners can update their LFG posts" ON public.lfg_posts;
CREATE POLICY "Post owners can update their LFG posts" ON public.lfg_posts
  FOR UPDATE USING (
    (type = 'individual' AND auth.uid() = user_id) OR
    (type = 'team' AND EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = lfg_posts.team_id
      AND teams.leader_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Post owners can delete their LFG posts" ON public.lfg_posts;
CREATE POLICY "Post owners can delete their LFG posts" ON public.lfg_posts
  FOR DELETE USING (
    (type = 'individual' AND auth.uid() = user_id) OR
    (type = 'team' AND EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = lfg_posts.team_id
      AND teams.leader_id = auth.uid()
    ))
  );

-- Updated at trigger
DROP TRIGGER IF EXISTS update_lfg_posts_updated_at ON public.lfg_posts;
CREATE TRIGGER update_lfg_posts_updated_at BEFORE UPDATE ON public.lfg_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
