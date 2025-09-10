-- Team Settings and Team Mails Schema
-- This schema adds team settings and replaces team chat with team mails

-- Team Settings table
CREATE TABLE IF NOT EXISTS public.team_settings (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references public.teams(id) on delete cascade not null unique,
  
  -- General Settings
  team_description text,
  team_visibility text not null default 'public' check (team_visibility in ('public', 'private', 'invite-only')),
  allow_join_requests boolean default true,
  auto_accept_applications boolean default false,
  max_members_override integer,
  
  -- Communication Settings
  enable_team_mails boolean default true,
  mail_notifications boolean default true,
  allow_external_contact boolean default true,
  
  -- Privacy Settings
  show_member_profiles boolean default true,
  show_member_skills boolean default true,
  show_team_activity boolean default true,
  show_join_code boolean default false,
  
  -- Permissions
  member_can_invite boolean default false,
  member_can_view_applications boolean default false,
  member_can_manage_settings boolean default false,
  
  -- Additional Settings
  team_tags text[] default '{}',
  custom_fields jsonb default '{}',
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Team Mails table
CREATE TABLE IF NOT EXISTS public.team_mails (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references public.teams(id) on delete cascade not null,
  
  -- Mail Details
  sender_id uuid references public.profiles(id) on delete cascade not null,
  recipient_ids uuid[] not null, -- Array of user IDs (team members)
  
  subject text not null,
  body text not null,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  
  -- Mail Type
  mail_type text not null default 'team' check (mail_type in ('team', 'announcement', 'meeting', 'update', 'alert')),
  
  -- Attachments and Rich Content
  attachments text[] default '{}', -- URLs to attachments
  is_html boolean default false,
  
  -- Status and Tracking
  is_sent boolean default true,
  is_draft boolean default false,
  scheduled_send_at timestamptz,
  
  -- Read Receipts
  read_by uuid[] default '{}', -- Array of user IDs who have read the mail
  read_timestamps jsonb default '{}', -- Object mapping user_id to read timestamp
  
  -- Threading
  thread_id uuid, -- For mail threads/conversations
  reply_to_id uuid references public.team_mails(id),
  
  -- Metadata
  tags text[] default '{}',
  important boolean default false,
  archived boolean default false,
  
  sent_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Team Mail Recipients table (for better tracking)
CREATE TABLE IF NOT EXISTS public.team_mail_recipients (
  id uuid primary key default uuid_generate_v4(),
  mail_id uuid references public.team_mails(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Status
  is_read boolean default false,
  read_at timestamptz,
  is_archived boolean default false,
  is_starred boolean default false,
  is_deleted boolean default false,
  
  -- Notifications
  notification_sent boolean default false,
  notification_sent_at timestamptz,
  
  created_at timestamptz default now(),
  
  unique(mail_id, recipient_id)
);

-- Team Mail Drafts table (for draft management)
CREATE TABLE IF NOT EXISTS public.team_mail_drafts (
  id uuid primary key default uuid_generate_v4(),
  team_id uuid references public.teams(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Draft Content
  subject text default '',
  body text default '',
  recipient_ids uuid[] default '{}',
  attachments text[] default '{}',
  
  -- Draft Metadata
  mail_type text default 'team' check (mail_type in ('team', 'announcement', 'meeting', 'update', 'alert')),
  priority text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  
  -- Auto-save
  auto_saved_at timestamptz default now(),
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS team_settings_team_idx ON public.team_settings(team_id);
CREATE INDEX IF NOT EXISTS team_mails_team_idx ON public.team_mails(team_id);
CREATE INDEX IF NOT EXISTS team_mails_sender_idx ON public.team_mails(sender_id);
CREATE INDEX IF NOT EXISTS team_mails_sent_at_idx ON public.team_mails(sent_at);
CREATE INDEX IF NOT EXISTS team_mails_thread_idx ON public.team_mails(thread_id);
CREATE INDEX IF NOT EXISTS team_mail_recipients_mail_idx ON public.team_mail_recipients(mail_id);
CREATE INDEX IF NOT EXISTS team_mail_recipients_user_idx ON public.team_mail_recipients(recipient_id);
CREATE INDEX IF NOT EXISTS team_mail_drafts_team_idx ON public.team_mail_drafts(team_id);
CREATE INDEX IF NOT EXISTS team_mail_drafts_author_idx ON public.team_mail_drafts(author_id);

-- Row Level Security
ALTER TABLE public.team_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_mails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_mail_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_mail_drafts ENABLE ROW LEVEL SECURITY;

-- Team Settings Policies
DROP POLICY IF EXISTS "Team members can view team settings" ON public.team_settings;
CREATE POLICY "Team members can view team settings" ON public.team_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_settings.team_id
      AND team_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team leaders can manage team settings" ON public.team_settings;
CREATE POLICY "Team leaders can manage team settings" ON public.team_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_settings.team_id
      AND teams.leader_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team members with permission can update settings" ON public.team_settings;
CREATE POLICY "Team members with permission can update settings" ON public.team_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.teams
      WHERE teams.id = team_settings.team_id
      AND teams.leader_id = auth.uid()
    )
    OR 
    (
      member_can_manage_settings = true
      AND EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.team_id = team_settings.team_id
        AND team_members.user_id = auth.uid()
      )
    )
  );

-- Team Mails Policies
DROP POLICY IF EXISTS "Team members can view team mails" ON public.team_mails;
CREATE POLICY "Team members can view team mails" ON public.team_mails
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_mails.team_id
      AND team_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Team members can send team mails" ON public.team_mails;
CREATE POLICY "Team members can send team mails" ON public.team_mails
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = team_mails.team_id
      AND team_members.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Senders can update their own team mails" ON public.team_mails;
CREATE POLICY "Senders can update their own team mails" ON public.team_mails
  FOR UPDATE USING (auth.uid() = sender_id);

-- Team Mail Recipients Policies
DROP POLICY IF EXISTS "Recipients can view their mail status" ON public.team_mail_recipients;
CREATE POLICY "Recipients can view their mail status" ON public.team_mail_recipients
  FOR SELECT USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Recipients can update their mail status" ON public.team_mail_recipients;
CREATE POLICY "Recipients can update their mail status" ON public.team_mail_recipients
  FOR UPDATE USING (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "Team mails can create recipient records" ON public.team_mail_recipients;
CREATE POLICY "Team mails can create recipient records" ON public.team_mail_recipients
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_mails
      WHERE team_mails.id = team_mail_recipients.mail_id
      AND team_mails.sender_id = auth.uid()
    )
  );

-- Team Mail Drafts Policies
DROP POLICY IF EXISTS "Users can manage their own drafts" ON public.team_mail_drafts;
CREATE POLICY "Users can manage their own drafts" ON public.team_mail_drafts
  FOR ALL USING (auth.uid() = author_id);

-- Functions for triggers
CREATE OR REPLACE FUNCTION create_default_team_settings()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.team_settings (team_id)
  VALUES (NEW.id)
  ON CONFLICT (team_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ language plpgsql;

-- Create default team settings when a new team is created
DROP TRIGGER IF EXISTS create_team_settings_trigger ON public.teams;
CREATE TRIGGER create_team_settings_trigger
  AFTER INSERT ON public.teams
  FOR EACH ROW EXECUTE FUNCTION create_default_team_settings();

-- Function to create recipient records when a mail is sent
CREATE OR REPLACE FUNCTION create_mail_recipients()
RETURNS trigger AS $$
DECLARE
  recipient_id uuid;
BEGIN
  -- Only create recipients for sent mails (not drafts)
  IF NEW.is_sent = true AND NOT NEW.is_draft THEN
    FOREACH recipient_id IN ARRAY NEW.recipient_ids
    LOOP
      INSERT INTO public.team_mail_recipients (mail_id, recipient_id)
      VALUES (NEW.id, recipient_id)
      ON CONFLICT (mail_id, recipient_id) DO NOTHING;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ language plpgsql;

-- Create recipient records when a mail is sent
DROP TRIGGER IF EXISTS create_mail_recipients_trigger ON public.team_mails;
CREATE TRIGGER create_mail_recipients_trigger
  AFTER INSERT ON public.team_mails
  FOR EACH ROW EXECUTE FUNCTION create_mail_recipients();

-- Updated at triggers for team settings and mails
DROP TRIGGER IF EXISTS update_team_settings_updated_at ON public.team_settings;
CREATE TRIGGER update_team_settings_updated_at BEFORE UPDATE ON public.team_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_mails_updated_at ON public.team_mails;
CREATE TRIGGER update_team_mails_updated_at BEFORE UPDATE ON public.team_mails
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_mail_drafts_updated_at ON public.team_mail_drafts;
CREATE TRIGGER update_team_mail_drafts_updated_at BEFORE UPDATE ON public.team_mail_drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create default team settings for existing teams
INSERT INTO public.team_settings (team_id)
SELECT id FROM public.teams
ON CONFLICT (team_id) DO NOTHING;
