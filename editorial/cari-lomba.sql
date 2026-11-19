-- Migrasi terpisah; tidak mengubah jk_stories, jk_media, atau editorial Kisah Juara.
-- Jalankan sekali di SQL editor Supabase sebelum menyalakan editor Cari Lomba di Vercel.
begin;
create table if not exists public.jk_opportunities (
  id uuid primary key, version integer not null check(version>0), draft jsonb not null,
  live jsonb, updated timestamptz not null, first_slug text unique,
  first_published date
);
alter table public.jk_opportunities add column if not exists poster_live text;
create index if not exists jk_opportunities_updated on public.jk_opportunities(updated desc);
create table if not exists public.jk_opportunity_state (id integer primary key check(id=1),launched boolean not null);
insert into public.jk_opportunity_state values (1,false) on conflict do nothing;
alter table public.jk_opportunities enable row level security;
alter table public.jk_opportunity_state enable row level security;
revoke all on public.jk_opportunities,public.jk_opportunity_state from public,anon,authenticated;
grant select,insert,update,delete on public.jk_opportunities to service_role;
grant select,update on public.jk_opportunity_state to service_role;
create or replace function public.jk_record_opportunity_publication()
returns trigger language plpgsql set search_path='' as $$
begin
  update public.jk_opportunity_state set launched=true where id=1 and not launched;
  return new;
end;
$$;
revoke all on function public.jk_record_opportunity_publication() from public,anon,authenticated;
grant execute on function public.jk_record_opportunity_publication() to service_role;
drop trigger if exists jk_opportunity_first_pub on public.jk_opportunities;
create trigger jk_opportunity_first_pub after insert or update of live on public.jk_opportunities
for each row when (new.live is not null) execute function public.jk_record_opportunity_publication();
commit;
