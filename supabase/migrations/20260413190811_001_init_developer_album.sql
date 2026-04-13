create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  full_name text,
  headline text,
  bio text,
  avatar_url text,
  location text,
  website_url text,
  github_url text,
  linkedin_url text,
  portfolio_url text,
  is_public boolean not null default true,
  availability_status text,
  github_id bigint,
  github_login text,
  github_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (
    username is null
    or char_length(username) between 3 and 30
  ),
  constraint profiles_username_format check (
    username is null
    or username ~ '^[a-z0-9]+(?:[a-z0-9_-]*[a-z0-9]+)?$'
  ),
  constraint profiles_availability_status check (
    availability_status is null
    or availability_status in ('open_to_work', 'freelance', 'unavailable')
  )
);

create unique index profiles_github_id_unique_idx
on public.profiles (github_id)
where github_id is not null;

create unique index profiles_github_login_unique_idx
on public.profiles (github_login)
where github_login is not null;

create table public.stacks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text,
  icon_name text,
  color_token text,
  created_at timestamptz not null default now(),
  constraint stacks_name_not_blank check (btrim(name) <> ''),
  constraint stacks_slug_not_blank check (btrim(slug) <> '')
);

create table public.profile_stacks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  stack_id uuid not null references public.stacks (id) on delete cascade,
  is_primary boolean not null default false,
  order_index integer not null default 0,
  constraint profile_stacks_unique_profile_stack unique (profile_id, stack_id),
  constraint profile_stacks_order_index_non_negative check (order_index >= 0)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null,
  description text,
  cover_image_url text,
  project_url text,
  repo_url text,
  is_featured boolean not null default false,
  visibility text not null default 'public',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_title_not_blank check (btrim(title) <> ''),
  constraint projects_slug_not_blank check (btrim(slug) <> ''),
  constraint projects_visibility check (visibility in ('public', 'private')),
  constraint projects_unique_profile_slug unique (profile_id, slug)
);

create table public.project_stacks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  stack_id uuid not null references public.stacks (id) on delete cascade,
  constraint project_stacks_unique_project_stack unique (project_id, stack_id)
);

create table public.developer_cards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  template text not null default 'default',
  accent_color text not null default 'cyan',
  rarity_tier text not null default 'common',
  tagline text,
  cover_style text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint developer_cards_template_not_blank check (btrim(template) <> ''),
  constraint developer_cards_accent_color_not_blank check (btrim(accent_color) <> ''),
  constraint developer_cards_rarity_tier check (rarity_tier in ('common', 'rare', 'epic', 'legendary'))
);

create table public.albums (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  is_default boolean not null default false,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint albums_name_not_blank check (btrim(name) <> '')
);

create table public.album_items (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums(id) on delete cascade,
  collected_profile_id uuid references public.profiles(id) on delete cascade,
  source text not null default 'platform',
  github_user_id bigint,
  github_login text,
  github_name text,
  github_avatar_url text,
  github_html_url text,
  github_bio text,
  github_location text,
  github_company text,
  github_blog text,
  github_public_repos integer not null default 0,
  github_followers integer not null default 0,
  github_following integer not null default 0,
  github_total_stars integer not null default 0,
  github_twitter_username text,
  added_at timestamptz not null default now(),
  last_synced_at timestamptz,
  sync_status text not null default 'idle',
  sync_error text,
  position integer not null default 0,
  constraint album_items_source_check check (source in ('platform', 'github')),
  constraint album_items_sync_status_check check (sync_status in ('idle', 'success', 'error')),
  constraint album_items_source_data_check check (
    (
      source = 'platform'
      and collected_profile_id is not null
      and github_user_id is null
    )
    or
    (
      source = 'github'
      and collected_profile_id is null
      and github_user_id is not null
    )
  ),
  constraint album_items_position_non_negative check (position >= 0)
);

create unique index album_items_unique_platform_item_idx
on public.album_items (album_id, collected_profile_id)
where source = 'platform' and collected_profile_id is not null;

create unique index album_items_unique_github_item_idx
on public.album_items (album_id, github_user_id)
where source = 'github' and github_user_id is not null;

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles (id) on delete cascade,
  target_profile_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_unique_owner_target unique (owner_profile_id, target_profile_id)
);

create index idx_profiles_is_public on public.profiles (is_public);
create index idx_profiles_username on public.profiles (username);
create index idx_profile_stacks_profile_id on public.profile_stacks (profile_id);
create index idx_profile_stacks_stack_id on public.profile_stacks (stack_id);
create index idx_projects_profile_id on public.projects (profile_id);
create index idx_projects_visibility on public.projects (visibility);
create index idx_project_stacks_project_id on public.project_stacks (project_id);
create index idx_project_stacks_stack_id on public.project_stacks (stack_id);
create index idx_developer_cards_profile_id on public.developer_cards (profile_id);
create index idx_albums_owner_profile_id on public.albums (owner_profile_id);
create index idx_album_items_album_id on public.album_items (album_id);
create index idx_album_items_collected_profile_id on public.album_items (collected_profile_id);
create index idx_album_items_source on public.album_items (source);
create index idx_album_items_github_user_id on public.album_items (github_user_id);
create index idx_album_items_album_position on public.album_items (album_id, position);
create index idx_album_items_github_total_stars on public.album_items (github_total_stars);
create index idx_album_items_github_twitter_username on public.album_items (github_twitter_username);
create index idx_favorites_owner_profile_id on public.favorites (owner_profile_id);
create index idx_favorites_target_profile_id on public.favorites (target_profile_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_username text;
begin
  generated_username :=
    lower(
      regexp_replace(
        coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
        '[^a-zA-Z0-9_]+',
        '',
        'g'
      )
    );

  if generated_username is null or btrim(generated_username) = '' then
    generated_username := 'dev';
  end if;

  if char_length(generated_username) < 3 then
    generated_username := generated_username || 'dev';
  end if;

  insert into public.profiles (
    id,
    username,
    full_name
  )
  values (
    new.id,
    left(generated_username, 24) || substring(replace(new.id::text, '-', '') from 1 for 6),
    new.raw_user_meta_data ->> 'full_name'
  );

  insert into public.developer_cards (profile_id)
  values (new.id);

  insert into public.albums (
    owner_profile_id,
    name,
    is_default,
    is_public
  )
  values (
    new.id,
    'Meu Álbum',
    true,
    false
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();

create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute procedure public.set_updated_at();

create trigger set_projects_updated_at
before update on public.projects
for each row
execute procedure public.set_updated_at();

create trigger set_developer_cards_updated_at
before update on public.developer_cards
for each row
execute procedure public.set_updated_at();

create trigger set_albums_updated_at
before update on public.albums
for each row
execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.stacks enable row level security;
alter table public.profile_stacks enable row level security;
alter table public.projects enable row level security;
alter table public.project_stacks enable row level security;
alter table public.developer_cards enable row level security;
alter table public.albums enable row level security;
alter table public.album_items enable row level security;
alter table public.favorites enable row level security;

create policy "profiles_public_read"
on public.profiles
for select
using (
  is_public = true
  or auth.uid() = id
);

create policy "profiles_owner_insert"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "profiles_owner_update"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "profiles_owner_delete"
on public.profiles
for delete
using (auth.uid() = id);

create policy "stacks_public_read"
on public.stacks
for select
using (true);

create policy "profile_stacks_public_read"
on public.profile_stacks
for select
using (
  exists (
    select 1
    from public.profiles p
    where p.id = profile_stacks.profile_id
      and (p.is_public = true or p.id = auth.uid())
  )
);

create policy "profile_stacks_owner_insert"
on public.profile_stacks
for insert
with check (auth.uid() = profile_id);

create policy "profile_stacks_owner_update"
on public.profile_stacks
for update
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "profile_stacks_owner_delete"
on public.profile_stacks
for delete
using (auth.uid() = profile_id);

create policy "projects_public_read"
on public.projects
for select
using (
  (
    visibility = 'public'
    and exists (
      select 1
      from public.profiles p
      where p.id = projects.profile_id
        and p.is_public = true
    )
  )
  or auth.uid() = profile_id
);

create policy "projects_owner_insert"
on public.projects
for insert
with check (auth.uid() = profile_id);

create policy "projects_owner_update"
on public.projects
for update
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "projects_owner_delete"
on public.projects
for delete
using (auth.uid() = profile_id);

create policy "project_stacks_public_read"
on public.project_stacks
for select
using (
  exists (
    select 1
    from public.projects pr
    join public.profiles p on p.id = pr.profile_id
    where pr.id = project_stacks.project_id
      and (
        (pr.visibility = 'public' and p.is_public = true)
        or p.id = auth.uid()
      )
  )
);

create policy "project_stacks_owner_insert"
on public.project_stacks
for insert
with check (
  exists (
    select 1
    from public.projects pr
    where pr.id = project_stacks.project_id
      and pr.profile_id = auth.uid()
  )
);

create policy "project_stacks_owner_delete"
on public.project_stacks
for delete
using (
  exists (
    select 1
    from public.projects pr
    where pr.id = project_stacks.project_id
      and pr.profile_id = auth.uid()
  )
);

create policy "developer_cards_public_read"
on public.developer_cards
for select
using (
  (
    is_published = true
    and exists (
      select 1
      from public.profiles p
      where p.id = developer_cards.profile_id
        and p.is_public = true
    )
  )
  or auth.uid() = profile_id
);

create policy "developer_cards_owner_insert"
on public.developer_cards
for insert
with check (auth.uid() = profile_id);

create policy "developer_cards_owner_update"
on public.developer_cards
for update
using (auth.uid() = profile_id)
with check (auth.uid() = profile_id);

create policy "developer_cards_owner_delete"
on public.developer_cards
for delete
using (auth.uid() = profile_id);

create policy "albums_owner_read"
on public.albums
for select
using (
  owner_profile_id = auth.uid()
  or is_public = true
);

create policy "albums_owner_insert"
on public.albums
for insert
with check (owner_profile_id = auth.uid());

create policy "albums_owner_update"
on public.albums
for update
using (owner_profile_id = auth.uid())
with check (owner_profile_id = auth.uid());

create policy "albums_owner_delete"
on public.albums
for delete
using (owner_profile_id = auth.uid());

create policy "album_items_read"
on public.album_items
for select
using (
  exists (
    select 1
    from public.albums a
    where a.id = album_items.album_id
      and (a.owner_profile_id = auth.uid() or a.is_public = true)
  )
);

create policy "album_items_owner_insert"
on public.album_items
for insert
with check (
  exists (
    select 1
    from public.albums a
    where a.id = album_items.album_id
      and a.owner_profile_id = auth.uid()
  )
  and (
    (
      source = 'platform'
      and collected_profile_id is not null
      and collected_profile_id <> auth.uid()
      and exists (
        select 1
        from public.profiles p
        where p.id = album_items.collected_profile_id
          and p.is_public = true
      )
    )
    or
    (
      source = 'github'
      and github_user_id is not null
      and github_login is not null
      and github_avatar_url is not null
      and github_html_url is not null
    )
  )
);

create policy "album_items_owner_update"
on public.album_items
for update
using (
  exists (
    select 1
    from public.albums a
    where a.id = album_items.album_id
      and a.owner_profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.albums a
    where a.id = album_items.album_id
      and a.owner_profile_id = auth.uid()
  )
);

create policy "album_items_owner_delete"
on public.album_items
for delete
using (
  exists (
    select 1
    from public.albums a
    where a.id = album_items.album_id
      and a.owner_profile_id = auth.uid()
  )
);

create policy "favorites_owner_read"
on public.favorites
for select
using (owner_profile_id = auth.uid());

create policy "favorites_owner_insert"
on public.favorites
for insert
with check (
  owner_profile_id = auth.uid()
  and target_profile_id <> auth.uid()
);

create policy "favorites_owner_delete"
on public.favorites
for delete
using (owner_profile_id = auth.uid());
