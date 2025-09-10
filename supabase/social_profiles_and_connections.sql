-- Enhanced Profiles, Search, and Connections Schema
-- Run this in Supabase SQL editor. Idempotent where possible.

-- 1) Extend profiles with richer fields
alter table if exists profiles
  add column if not exists bio text,
  add column if not exists skills text[] default '{}',
  add column if not exists socials jsonb default '{}'::jsonb,
  add column if not exists headline text,
  add column if not exists location text;

-- 2) Projects owned by users
create table if not exists user_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  url text,
  repo_url text,
  images text[] default '{}',
  tags text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3) Certificates earned by users
create table if not exists user_certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  issuer text,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  skills text[] default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4) Hackathon history per user
-- References events table if present; otherwise stores denormalized event info
create table if not exists user_hackathon_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid,
  event_name text,
  role text check (role in ('participant','judge','organizer')),
  team_id uuid,
  project_id uuid,
  started_at timestamp with time zone,
  ended_at timestamp with time zone,
  outcome jsonb default '{}'::jsonb, -- e.g., {"awards":[...],"rank":...}
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 5) User connections (LinkedIn-like)
-- Requests table for pending/blocked states; connections for accepted relationships
create table if not exists user_connection_requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending','accepted','declined','blocked','cancelled')),
  created_at timestamp with time zone default now(),
  responded_at timestamp with time zone
);

create unique index if not exists ux_user_connection_requests_unique
  on user_connection_requests (least(requester_id, recipient_id), greatest(requester_id, recipient_id))
  where status in ('pending');

create table if not exists user_connections (
  id uuid primary key default gen_random_uuid(),
  user_id_a uuid not null references auth.users(id) on delete cascade,
  user_id_b uuid not null references auth.users(id) on delete cascade,
  connected_at timestamp with time zone default now(),
  constraint ux_connection_pair unique (user_id_a, user_id_b),
  constraint chk_connection_order check (user_id_a < user_id_b)
);

create index if not exists idx_user_connections_a on user_connections(user_id_a);
create index if not exists idx_user_connections_b on user_connections(user_id_b);

-- 6) Helper functions and triggers for updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

create trigger set_updated_at_user_projects
  before update on user_projects
  for each row execute procedure set_updated_at();

create trigger set_updated_at_user_certificates
  before update on user_certificates
  for each row execute procedure set_updated_at();

create trigger set_updated_at_user_hackathon_history
  before update on user_hackathon_history
  for each row execute procedure set_updated_at();

-- 7) RLS policies
alter table user_projects enable row level security;
alter table user_certificates enable row level security;
alter table user_hackathon_history enable row level security;
alter table user_connection_requests enable row level security;
alter table user_connections enable row level security;

-- Profiles typically already have RLS. Ensure profile privacy with simple policies.
-- Allow read of profiles to authenticated users; write only to self.
create policy if not exists "read profiles" on profiles
  for select using (auth.role() = 'anon' or auth.role() = 'authenticated');

create policy if not exists "update own profile" on profiles
  for update using (id = auth.uid());

-- Projects
create policy if not exists "select projects of any profile" on user_projects
  for select using (true);
create policy if not exists "insert own projects" on user_projects
  for insert with check (user_id = auth.uid());
create policy if not exists "update own projects" on user_projects
  for update using (user_id = auth.uid());
create policy if not exists "delete own projects" on user_projects
  for delete using (user_id = auth.uid());

-- Certificates
create policy if not exists "select certificates of any profile" on user_certificates
  for select using (true);
create policy if not exists "insert own certificates" on user_certificates
  for insert with check (user_id = auth.uid());
create policy if not exists "update own certificates" on user_certificates
  for update using (user_id = auth.uid());
create policy if not exists "delete own certificates" on user_certificates
  for delete using (user_id = auth.uid());

-- Hackathon history
create policy if not exists "select hackathon history" on user_hackathon_history
  for select using (true);
create policy if not exists "manage own hackathon history" on user_hackathon_history
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Connection requests
create policy if not exists "select own-related requests" on user_connection_requests
  for select using (
    requester_id = auth.uid() or recipient_id = auth.uid()
  );

create policy if not exists "create request as requester" on user_connection_requests
  for insert with check (requester_id = auth.uid());

create policy if not exists "cancel own request" on user_connection_requests
  for update using (requester_id = auth.uid()) with check (requester_id = auth.uid());

create policy if not exists "respond as recipient" on user_connection_requests
  for update using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- Connections
create policy if not exists "select connections involving me" on user_connections
  for select using (
    user_id_a = auth.uid() or user_id_b = auth.uid()
  );

create policy if not exists "delete my connections" on user_connections
  for delete using (
    user_id_a = auth.uid() or user_id_b = auth.uid()
  );

-- 8) Function to accept a request and create a connection atomically
create or replace function accept_connection_request(p_request_id uuid)
returns void language plpgsql security definer as $$
begin
  -- Ensure caller is recipient
  perform 1 from user_connection_requests
    where id = p_request_id and recipient_id = auth.uid() and status = 'pending';
  if not found then
    raise exception 'Request not found or not authorized';
  end if;

  -- Fetch pair
  declare v_req record;
  begin
    select requester_id, recipient_id into v_req from user_connection_requests where id = p_request_id;
    -- Normalize order
    insert into user_connections(user_id_a, user_id_b)
    values (least(v_req.requester_id, v_req.recipient_id), greatest(v_req.requester_id, v_req.recipient_id))
    on conflict do nothing;
    -- Mark accepted
    update user_connection_requests set status = 'accepted', responded_at = now() where id = p_request_id;
  end;
end
$$;

-- 9) Function to remove a connection pair by user id
create or replace function remove_connection_with(p_other_user uuid)
returns void language plpgsql security definer as $$
begin
  delete from user_connections
  where (user_id_a = least(auth.uid(), p_other_user) and user_id_b = greatest(auth.uid(), p_other_user));
end
$$;

