-- Full schema. Run in Supabase: SQL Editor -> paste -> Run (or `supabase db push`).

-- ---------------------------------------------------------------
-- Profiles: one row per auth user, created automatically on sign-up
-- ---------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  university text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------
-- Synced documents. The app keeps the same JSON it stores locally
-- (src/types), keyed by its own client-generated id per user.
-- ---------------------------------------------------------------
create table public.study_sets (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) <= 100),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table public.subjects (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id text not null check (char_length(id) <= 100),
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.study_sets enable row level security;
alter table public.subjects enable row level security;

create policy "study_sets: own rows" on public.study_sets
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subjects: own rows" on public.subjects
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- Feedback: anyone can send, nobody can read it through the API
-- (the team reads it in the Supabase dashboard)
-- ---------------------------------------------------------------
create table public.feedback (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users (id) on delete set null,
  name text not null check (char_length(name) <= 100),
  role text check (char_length(role) <= 100),
  rating int not null check (rating between 1 and 5),
  text text not null check (char_length(text) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "feedback: anyone can insert" on public.feedback
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());

-- ---------------------------------------------------------------
-- AI usage per user per day (Edge Function "gemini" enforces the limit)
-- ---------------------------------------------------------------
create table public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);

alter table public.ai_usage enable row level security;

create policy "ai_usage: read own" on public.ai_usage
  for select using (auth.uid() = user_id);

-- Atomically counts one request; false when today's limit is already used up.
-- Day boundary is Tashkent time.
create function public.consume_ai_quota(daily_limit int)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  used int;
begin
  insert into public.ai_usage (user_id, day, count)
  values (auth.uid(), (now() at time zone 'Asia/Tashkent')::date, 1)
  on conflict (user_id, day) do update set count = public.ai_usage.count + 1
  returning count into used;
  return used <= daily_limit;
end;
$$;

revoke execute on function public.consume_ai_quota(int) from public, anon;
grant execute on function public.consume_ai_quota(int) to authenticated;

-- ---------------------------------------------------------------
-- Telegram reminders: the app creates a one-time code, the bot links
-- the chat when the user sends /start <code>
-- ---------------------------------------------------------------
create table public.telegram_links (
  user_id uuid primary key references auth.users (id) on delete cascade,
  link_code text unique,
  chat_id bigint unique,
  linked_at timestamptz
);

alter table public.telegram_links enable row level security;

create policy "telegram_links: read own" on public.telegram_links
  for select using (auth.uid() = user_id);

create function public.create_telegram_link_code()
returns text
language plpgsql
security definer set search_path = ''
as $$
declare
  code text := encode(extensions.gen_random_bytes(9), 'hex');
begin
  insert into public.telegram_links (user_id, link_code)
  values (auth.uid(), code)
  on conflict (user_id) do update set link_code = excluded.link_code;
  return code;
end;
$$;

revoke execute on function public.create_telegram_link_code() from public, anon;
grant execute on function public.create_telegram_link_code() to authenticated;
