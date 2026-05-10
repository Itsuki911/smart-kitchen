create extension if not exists pgcrypto;

create table if not exists public.recipe_runs (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default timezone('utc', now()),
    title text not null,
    message text not null,
    recipe text not null,
    health_check jsonb not null,
    filenames text[] not null default '{}',
    storage_paths text[] not null default '{}'
);

create index if not exists recipe_runs_created_at_idx
    on public.recipe_runs (created_at desc);

alter table public.recipe_runs enable row level security;
