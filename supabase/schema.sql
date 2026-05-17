-- 남녕 문학관: Supabase SQL Editor에서 실행하세요.

create extension if not exists "pgcrypto";

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  grade text not null,
  class_num text not null,
  student_number text not null,
  name text not null,
  created_at timestamptz not null default now(),
  constraint students_identity_unique unique (grade, class_num, student_number, name)
);

create table if not exists public.theme_entries (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  hall_id text not null,
  work_id text not null,
  author_display text not null,
  body text not null,
  liked_by text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists theme_entries_hall_id_idx on public.theme_entries (hall_id);
create index if not exists theme_entries_student_id_idx on public.theme_entries (student_id);

create table if not exists public.theme_comments (
  id uuid primary key default gen_random_uuid(),
  theme_id uuid not null references public.theme_entries (id) on delete cascade,
  student_id uuid references public.students (id) on delete set null,
  author_display text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists theme_comments_theme_id_idx on public.theme_comments (theme_id);

alter table public.students enable row level security;
alter table public.theme_entries enable row level security;
alter table public.theme_comments enable row level security;

-- 수업 MVP: anon 키로 읽기·쓰기 허용 (운영 시 정책 강화 권장)
create policy "students_anon_all"
  on public.students for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "theme_entries_anon_all"
  on public.theme_entries for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "theme_comments_anon_all"
  on public.theme_comments for all
  to anon, authenticated
  using (true)
  with check (true);
