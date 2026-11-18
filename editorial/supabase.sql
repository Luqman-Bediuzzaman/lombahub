begin;
create table if not exists public.jk_stories (
  id uuid primary key, version integer not null, draft jsonb not null, live jsonb,
  updated timestamptz not null, live_media uuid[] not null default '{}',
  first_slug text, first_published date
);
create unique index if not exists jk_story_slug on public.jk_stories(first_slug);
create table if not exists public.jk_media (
  id uuid primary key, story_id uuid not null references public.jk_stories(id) on delete cascade,
  jpeg text not null
);
alter table public.jk_stories enable row level security;
alter table public.jk_media enable row level security;
revoke all on public.jk_stories, public.jk_media from public, anon, authenticated;
grant select, insert, update, delete on public.jk_stories,public.jk_media to service_role;
create table if not exists public.jk_editor_state (id integer primary key check(id=1), launched boolean not null);
insert into public.jk_editor_state values (1,false) on conflict do nothing;
alter table public.jk_editor_state enable row level security;
revoke all on public.jk_editor_state from public,anon,authenticated;
grant select,update on public.jk_editor_state to service_role;
create or replace function public.jk_remember_publication() returns trigger language plpgsql set search_path='' as $$
begin
  update public.jk_editor_state set launched=true where id=1 and not launched;
  return new;
end;
$$;
revoke all on function public.jk_remember_publication() from public,anon,authenticated;
grant execute on function public.jk_remember_publication() to service_role;
drop trigger if exists jk_first_publication on public.jk_stories;
create trigger jk_first_publication after update of live on public.jk_stories for each row
when (new.live is not null) execute function public.jk_remember_publication();
commit;
