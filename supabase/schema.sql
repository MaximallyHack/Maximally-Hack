-- Maximally Hack Platform - Supabase Database Schema
-- This schema replaces the JSON fixtures with a real database

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  name text not null,
  avatar text,
  role text not null default 'participant' check (role in ('participant', 'organizer', 'judge')),
  bio text,
  skills text[] default '{}',
  location text,
  github text,
  linkedin text,
  twitter text,
  website text,
  join_date timestamptz default now(),
  
  -- Stats
  hackathons_participated integer default 0,
  wins integer default 0,
  finals integer default 0,
  organized integer default 0,
  judged integer default 0,
  
  -- Additional fields
  badges text[] default '{}',
  expertise text[] default '{}',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events table
create table public.events (
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
create table public.teams (
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
create table public.team_members (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references public.teams(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('leader', 'member')),
  joined_at timestamptz default now(),
  
  unique(team_id, user_id)
);

-- Submissions table
create table public.submissions (
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
create table public.judges (
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
create table public.scorecards (
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
create table public.event_judges (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid references public.events(id) on delete cascade,
  judge_id uuid references public.judges(id) on delete cascade,
  assigned_at timestamptz default now(),
  
  unique(event_id, judge_id)
);

-- User projects table (for tracking user's submissions across events)
create table public.user_projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete cascade,
  role text default 'contributor' check (role in ('creator', 'contributor')),
  
  created_at timestamptz default now(),
  
  unique(user_id, submission_id)
);

-- Indexes for better performance
create index profiles_username_idx on public.profiles(username);
create index profiles_role_idx on public.profiles(role);
create index events_slug_idx on public.events(slug);
create index events_status_idx on public.events(status);
create index events_organizer_idx on public.events(organizer_id);
create index teams_event_idx on public.teams(event_id);
create index teams_leader_idx on public.teams(leader_id);
create index team_members_team_idx on public.team_members(team_id);
create index team_members_user_idx on public.team_members(user_id);
create index submissions_event_idx on public.submissions(event_id);
create index submissions_team_idx on public.submissions(team_id);
create index submissions_status_idx on public.submissions(status);
create index scorecards_submission_idx on public.scorecards(submission_id);
create index scorecards_judge_idx on public.scorecards(judge_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.submissions enable row level security;
alter table public.judges enable row level security;
alter table public.scorecards enable row level security;
alter table public.event_judges enable row level security;
alter table public.user_projects enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Events policies
create policy "Events are viewable by everyone" on public.events
  for select using (true);

create policy "Organizers can create events" on public.events
  for insert with check (auth.uid() = organizer_id);

create policy "Organizers can update their events" on public.events
  for update using (auth.uid() = organizer_id);

-- Teams policies
create policy "Teams are viewable by everyone" on public.teams
  for select using (true);

create policy "Authenticated users can create teams" on public.teams
  for insert with check (auth.role() = 'authenticated');

create policy "Team leaders can update their teams" on public.teams
  for update using (auth.uid() = leader_id);

-- Team members policies
create policy "Team members are viewable by everyone" on public.team_members
  for select using (true);

create policy "Team leaders can manage team members" on public.team_members
  for all using (
    exists (
      select 1 from public.teams
      where teams.id = team_members.team_id
      and teams.leader_id = auth.uid()
    )
  );

create policy "Users can join teams" on public.team_members
  for insert with check (auth.uid() = user_id);

-- Submissions policies
create policy "Submissions are viewable by everyone" on public.submissions
  for select using (status = 'submitted');

create policy "Users can create submissions" on public.submissions
  for insert with check (auth.uid() = submitted_by);

create policy "Submission owners can update their submissions" on public.submissions
  for update using (auth.uid() = submitted_by);

-- Judges policies
create policy "Judges are viewable by everyone" on public.judges
  for select using (true);

create policy "Judges can update their own profile" on public.judges
  for update using (auth.uid() = id);

-- Scorecards policies
create policy "Judges can view all scorecards" on public.scorecards
  for select using (
    exists (
      select 1 from public.judges where judges.id = auth.uid()
    )
  );

create policy "Judges can create their own scorecards" on public.scorecards
  for insert with check (auth.uid() = judge_id);

create policy "Judges can update their own scorecards" on public.scorecards
  for update using (auth.uid() = judge_id);

-- Event judges policies
create policy "Event judges are viewable by everyone" on public.event_judges
  for select using (true);

create policy "Event organizers can assign judges" on public.event_judges
  for insert with check (
    exists (
      select 1 from public.events
      where events.id = event_judges.event_id
      and events.organizer_id = auth.uid()
    )
  );

-- User projects policies
create policy "User projects are viewable by everyone" on public.user_projects
  for select using (true);

create policy "Users can add their own projects" on public.user_projects
  for insert with check (auth.uid() = user_id);

-- Functions for automatic updates
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, name)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to generate unique join codes for teams
create or replace function generate_join_code()
returns text as $$
declare
  code text;
  exists_check boolean;
begin
  loop
    code := upper(substring(md5(random()::text) from 1 for 6));
    select exists(select 1 from public.teams where join_code = code) into exists_check;
    if not exists_check then
      return code;
    end if;
  end loop;
end;
$$ language plpgsql;

-- Function to update submission average scores
create or replace function update_submission_average_score()
returns trigger as $$
begin
  update public.submissions
  set average_score = (
    select avg(total_score)
    from public.scorecards
    where submission_id = new.submission_id
    and status = 'submitted'
  )
  where id = new.submission_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to update average scores when scorecards are updated
create trigger update_avg_score_trigger
  after insert or update or delete on public.scorecards
  for each row execute function update_submission_average_score();

-- Updated at triggers
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute function update_updated_at_column();

create trigger update_events_updated_at before update on public.events
  for each row execute function update_updated_at_column();

create trigger update_teams_updated_at before update on public.teams
  for each row execute function update_updated_at_column();

create trigger update_submissions_updated_at before update on public.submissions
  for each row execute function update_updated_at_column();

create trigger update_judges_updated_at before update on public.judges
  for each row execute function update_updated_at_column();

create trigger update_scorecards_updated_at before update on public.scorecards
  for each row execute function update_updated_at_column();
