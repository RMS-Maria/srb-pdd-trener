-- Выполните этот скрипт в Supabase: Project -> SQL Editor -> New query.

create table if not exists card_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null,
  correct_streak int not null default 0,
  wrong_count int not null default 0,
  last_seen timestamptz,
  next_due timestamptz not null default now(),
  ease numeric not null default 2.5,
  interval_days int not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, card_id)
);

alter table card_progress enable row level security;

create policy "Users can read own progress"
  on card_progress for select
  using (auth.uid() = user_id);

create policy "Users can upsert own progress"
  on card_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on card_progress for update
  using (auth.uid() = user_id);

-- Заготовка для будущего дашборда (Phase 2) — не используется в Phase 1.
create table if not exists sessions_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  cards_seen int not null default 0,
  cards_correct int not null default 0
);

alter table sessions_log enable row level security;

create policy "Users can read own sessions"
  on sessions_log for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on sessions_log for insert
  with check (auth.uid() = user_id);
