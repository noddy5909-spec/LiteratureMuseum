-- 이미 테이블이 있을 때 Realtime만 켜려면 Supabase SQL Editor에서 실행하세요.

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.theme_entries to anon, authenticated;
grant select, insert, update, delete on public.theme_comments to anon, authenticated;

alter table public.theme_entries replica identity full;
alter table public.theme_comments replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public' and tablename = 'theme_entries'
  ) then
    alter publication supabase_realtime add table public.theme_entries;
  end if;

  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public' and tablename = 'theme_comments'
  ) then
    alter publication supabase_realtime add table public.theme_comments;
  end if;
end $$;
