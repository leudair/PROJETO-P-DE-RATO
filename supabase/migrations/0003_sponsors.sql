-- Patrocinadores do time — banner no rodape da pagina publica (nome +
-- link, sem logo por enquanto). Dado publico por natureza (marketing do
-- patrocinador), mas segue o mesmo padrao do resto do app: leitura pela
-- pagina publica via client de service_role, sem policy "anon".

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website_url text,
  active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index sponsors_active_idx on public.sponsors (active);

alter table public.sponsors enable row level security;

create policy sponsors_admin_all on public.sponsors
  for all using (public.is_admin()) with check (public.is_admin());
