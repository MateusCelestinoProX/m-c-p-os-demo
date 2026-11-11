-- ============================================================================
--  MCP OS — Segurança (RLS) + Realtime  |  Projeto: kgeurirtbjsgytzvmzoq
--  Rode TUDO isto em: Supabase → SQL Editor → New query → Run
--  Idempotente: pode rodar quantas vezes quiser.
--
--  POR QUE A VERSÃO ANTERIOR NÃO FECHOU O BURACO:
--  o `drop policy if exists "<nome>"` só apaga a política se o NOME bater.
--  Havia políticas permissivas antigas (criadas pelo dashboard) com nomes que
--  eu não adivinhei. No Postgres, políticas PERMISSIVAS se somam com OR — basta
--  UMA "libera geral" sobreviver para o anon continuar escrevendo.
--  Solução: apagar as políticas DINAMICAMENTE (por definição, não por nome).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) custom_backgrounds  →  leitura PÚBLICA, escrita SÓ p/ admin autenticado
--    Apaga TODAS as políticas existentes (tabela é 100% do app) e recria certo.
-- ----------------------------------------------------------------------------
alter table public.custom_backgrounds enable row level security;
alter table public.custom_backgrounds replica identity full;  -- payload completo no Realtime (delete/update)

do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'custom_backgrounds'
  loop
    execute format('drop policy if exists %I on public.custom_backgrounds', pol.policyname);
  end loop;
end $$;

create policy "custom_bg public read"
  on public.custom_backgrounds for select
  to anon, authenticated
  using (true);

create policy "custom_bg auth insert"
  on public.custom_backgrounds for insert
  to authenticated  with check (true);

create policy "custom_bg auth update"
  on public.custom_backgrounds for update
  to authenticated  using (true) with check (true);

create policy "custom_bg auth delete"
  on public.custom_backgrounds for delete
  to authenticated  using (true);

-- ----------------------------------------------------------------------------
-- 2) app_config  →  leitura pública, escrita só autenticada (mesmo tratamento)
-- ----------------------------------------------------------------------------
alter table public.app_config enable row level security;
alter table public.app_config replica identity full;

do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'app_config'
  loop
    execute format('drop policy if exists %I on public.app_config', pol.policyname);
  end loop;
end $$;

create policy "app_config public read"
  on public.app_config for select
  to anon, authenticated  using (true);

create policy "app_config auth write"
  on public.app_config for all
  to authenticated  using (true) with check (true);

-- ----------------------------------------------------------------------------
-- 3) Storage bucket "background-media"  →  leitura pública, escrita só admin.
--
--    Aqui NÃO apagamos tudo cegamente (storage.objects pode ter políticas de
--    OUTROS buckets). Apagamos apenas:
--      (a) políticas que citam 'background-media', e
--      (b) QUALQUER política que dê ESCRITA a anon/public (o buraco real) —
--          isto preserva políticas de escrita restritas a 'authenticated'.
-- ----------------------------------------------------------------------------
update storage.buckets
   set public = true,
       file_size_limit = 52428800,  -- 50 MB por arquivo
       allowed_mime_types = array[
         'image/png','image/jpeg','image/jpg','image/webp','image/gif',
         'video/mp4','video/webm','video/quicktime'
       ]
 where id = 'background-media';

do $$
declare pol record;
begin
  for pol in
    select policyname, roles, cmd, qual, with_check
    from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
  loop
    if  coalesce(pol.qual, '')       ilike '%background-media%'
     or coalesce(pol.with_check, '') ilike '%background-media%'
     or pol.policyname ilike '%background-media%'
     or pol.policyname ilike '%bg-media%'
     or ( (pol.roles && array['anon','public']::name[])
          and pol.cmd in ('INSERT','UPDATE','DELETE','ALL') )
    then
      execute format('drop policy if exists %I on storage.objects', pol.policyname);
    end if;
  end loop;
end $$;

create policy "bg-media public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'background-media');

create policy "bg-media auth insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'background-media');

create policy "bg-media auth update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'background-media') with check (bucket_id = 'background-media');

create policy "bg-media auth delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'background-media');

-- ----------------------------------------------------------------------------
-- 4) Realtime  →  publica as tabelas p/ o postgres_changes entregar eventos
--    (sem isto, "aparece na hora sem atualizar a página" não funciona)
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_publication_tables
                 where pubname='supabase_realtime' and schemaname='public' and tablename='custom_backgrounds') then
    execute 'alter publication supabase_realtime add table public.custom_backgrounds';
  end if;
  if not exists (select 1 from pg_publication_tables
                 where pubname='supabase_realtime' and schemaname='public' and tablename='app_config') then
    execute 'alter publication supabase_realtime add table public.app_config';
  end if;
end $$;

-- ============================================================================
-- 5) CONFERÊNCIA — rode e confira o resultado (deve bater com os comentários)
-- ============================================================================

-- (a) Políticas das tabelas do app: ESCRITA deve estar só p/ {authenticated}.
select tablename, policyname, roles, cmd
  from pg_policies
 where schemaname='public' and tablename in ('custom_backgrounds','app_config')
 order by tablename, cmd;

-- (b) Políticas de storage referentes ao bucket: escrita só {authenticated}.
select policyname, roles, cmd
  from pg_policies
 where schemaname='storage' and tablename='objects'
 order by cmd;

-- (c) RLS realmente ligada nas tabelas (relrowsecurity = true).
select relname, relrowsecurity
  from pg_class
 where relname in ('custom_backgrounds','app_config');

-- (d) Tabelas publicadas no Realtime (devem aparecer as duas).
select schemaname, tablename
  from pg_publication_tables
 where pubname='supabase_realtime' and schemaname='public';

-- (e) Config do bucket (public=true, limite e mime types corretos).
select id, public, file_size_limit, allowed_mime_types
  from storage.buckets where id='background-media';
