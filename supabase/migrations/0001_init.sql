-- Week 1 schema: profiles, study sets, private feedback.
-- Run in Supabase: SQL Editor -> paste -> Run (or `supabase db push`).

-- Profiles: one row per auth user, created automatically on sign-up
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

-- Study sets: the generated quiz/flashcards/notes/exam is kept as JSON.
-- Week 2 moves the app from localStorage to this table.
create table public.study_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  type text not null check (type in ('quiz', 'flashcards', 'notes', 'exam')),
  title text not null check (char_length(title) <= 300),
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index study_sets_user_created_idx on public.study_sets (user_id, created_at desc);

alter table public.study_sets enable row level security;

create policy "study_sets: read own" on public.study_sets
  for select using (auth.uid() = user_id);
create policy "study_sets: insert own" on public.study_sets
  for insert with check (auth.uid() = user_id);
create policy "study_sets: update own" on public.study_sets
  for update using (auth.uid() = user_id);
create policy "study_sets: delete own" on public.study_sets
  for delete using (auth.uid() = user_id);

-- Feedback: anyone can send, nobody can read through the API (team reads it in the dashboard)
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
