-- ============================================================
-- JAM Planner — Supabase Database Schema
-- Phase 1: Users, Syllabus Sections, Tasks, Progress
-- Run this in your Supabase SQL editor.
-- ============================================================

-- Enable UUID extension (usually pre-enabled on Supabase)
create extension if not exists "uuid-ossp";


-- ============================================================
-- TABLE: profiles
-- Extends Supabase auth.users with app-specific metadata.
-- A row is auto-created on signup via a trigger (see below).
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- RLS: users can only see and edit their own profile
alter table public.profiles enable row level security;

create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id);


-- ============================================================
-- TABLE: syllabus_sections
-- The 7 canonical JAM 2026 Physics sections.
-- Seeded once; read-only for users (admin-managed).
-- ============================================================
create table public.syllabus_sections (
  id          smallint primary key generated always as identity,
  slug        text unique not null,          -- e.g. 'mathematical-physics'
  title       text not null,                 -- e.g. 'Mathematical Physics'
  description text,
  icon        text,                          -- e.g. emoji or icon key
  sort_order  smallint not null default 0
);

-- No RLS needed — public read-only reference data
alter table public.syllabus_sections enable row level security;

create policy "syllabus_sections: public read"
  on public.syllabus_sections for select
  using (true);

-- Seed the 7 JAM Physics sections
insert into public.syllabus_sections (slug, title, description, icon, sort_order) values
  ('mathematical-physics',      'Mathematical Physics',       'Vector calculus, linear algebra, complex analysis, differential equations, Fourier series & transforms, special functions.',   '∂',  1),
  ('mechanics-general-properties', 'Mechanics & General Properties', 'Newtonian mechanics, conservation laws, rigid body dynamics, oscillations, special relativity fundamentals.',            '⚙',  2),
  ('oscillations-waves-optics', 'Oscillations, Waves & Optics', 'SHM, superposition, interference, diffraction, polarisation, lasers and optical instruments.',                              '〜',  3),
  ('electricity-magnetism',     'Electricity & Magnetism',    'Electrostatics, Gauss law, magnetostatics, Maxwell equations, electromagnetic waves, AC circuits.',                            '⚡',  4),
  ('kinetic-theory-thermodynamics', 'Kinetic Theory & Thermodynamics', 'Kinetic theory, laws of thermodynamics, entropy, thermodynamic potentials, statistical mechanics basics.',            '🌡', 5),
  ('modern-physics',            'Modern Physics',             'Quantum mechanics basics, hydrogen atom, nuclear physics, radioactivity, elementary particles.',                               '⚛',  6),
  ('solid-state-electronics',   'Solid State Physics & Electronics', 'Crystal structure, band theory, semiconductors, p-n junction, transistors, logic gates.',                             '▦',  7);


-- ============================================================
-- TABLE: section_progress
-- Tracks per-user mastery level for each syllabus section.
-- mastery_score: 0–100 (derived from completed tasks, or manual).
-- ============================================================
create table public.section_progress (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  section_id      smallint not null references public.syllabus_sections(id),
  mastery_score   smallint default 0 check (mastery_score between 0 and 100),
  last_studied_at timestamptz,
  updated_at      timestamptz default now() not null,
  unique (user_id, section_id)
);

alter table public.section_progress enable row level security;

create policy "section_progress: select own"
  on public.section_progress for select
  using (auth.uid() = user_id);

create policy "section_progress: insert own"
  on public.section_progress for insert
  with check (auth.uid() = user_id);

create policy "section_progress: update own"
  on public.section_progress for update
  using (auth.uid() = user_id);


-- ============================================================
-- TABLE: tasks
-- Daily study tasks linked to a syllabus section.
-- status: 'todo' | 'in_progress' | 'done'
-- ============================================================
create type public.task_status as enum ('todo', 'in_progress', 'done');

create table public.tasks (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  section_id      smallint not null references public.syllabus_sections(id),
  title           text not null,
  notes           text,
  status          public.task_status default 'todo' not null,
  due_date        date,
  completed_at    timestamptz,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null
);

alter table public.tasks enable row level security;

create policy "tasks: select own"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "tasks: insert own"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "tasks: update own"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "tasks: delete own"
  on public.tasks for delete
  using (auth.uid() = user_id);


-- ============================================================
-- TRIGGER: auto-create profile on auth.users insert
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- TRIGGER: keep updated_at current
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_progress_updated_at
  before update on public.section_progress
  for each row execute procedure public.set_updated_at();

create trigger set_tasks_updated_at
  before update on public.tasks
  for each row execute procedure public.set_updated_at();
