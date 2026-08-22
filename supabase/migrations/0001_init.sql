-- caixa-time — schema inicial
-- Vive no schema "caixa_time" (nao "public") porque esse projeto Supabase
-- e compartilhado com outro produto do usuario (WeCare Bio Boost) — usar um
-- schema proprio isola completamente as tabelas de um produto do outro,
-- sem precisar de um projeto Supabase novo (que exigiria plano pago, ja
-- que a organizacao free atingiu o limite de projetos gratuitos).
--
-- profiles: admin do time (id = auth.users.id), acesso ao painel
-- team_settings: linha unica de configuracao (valor padrao da mensalidade, nome do time)
-- players: jogadores do time
-- payments: cobrancas de mensalidade/caixinha, com dados do Pix quando geradas via Mercado Pago

create schema if not exists caixa_time;

create extension if not exists "pgcrypto";

create table caixa_time.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table caixa_time.team_settings (
  id smallint primary key default 1 check (id = 1),
  team_name text not null default 'Meu Time',
  default_mensalidade_amount numeric(10, 2) not null default 75.00,
  updated_at timestamptz not null default now()
);

insert into caixa_time.team_settings (id) values (1);

create table caixa_time.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table caixa_time.payments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references caixa_time.players (id) on delete cascade,
  type text not null check (type in ('mensalidade', 'caixinha')),
  amount numeric(10, 2) not null check (amount > 0),
  -- primeiro dia do mes de referencia; null para caixinha avulsa nao ligada a um ciclo
  reference_month date,
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  mercado_pago_payment_id text unique,
  pix_qr_code text,
  pix_copy_paste text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index payments_player_id_idx on caixa_time.payments (player_id);
create index payments_status_idx on caixa_time.payments (status);
create index payments_reference_month_idx on caixa_time.payments (reference_month);

-- evita gerar a mensalidade duas vezes pro mesmo jogador no mesmo mes;
-- caixinha nao entra nessa restricao (varias contribuicoes no mesmo mes sao validas)
create unique index payments_mensalidade_unique_idx
  on caixa_time.payments (player_id, reference_month)
  where type = 'mensalidade';

-- helper usado nas policies de RLS para checar papel sem recursao
create or replace function caixa_time.is_admin()
returns boolean
language sql
security definer
set search_path = caixa_time
stable
as $$
  select exists (
    select 1 from caixa_time.profiles
    where id = auth.uid()
  );
$$;

alter table caixa_time.profiles enable row level security;
alter table caixa_time.team_settings enable row level security;
alter table caixa_time.players enable row level security;
alter table caixa_time.payments enable row level security;

-- profiles: cada admin ve o proprio perfil
create policy profiles_select_own on caixa_time.profiles
  for select using (id = auth.uid());

-- team_settings/players/payments: acesso total restrito a quem tem linha em profiles (admin do time)
create policy team_settings_admin_all on caixa_time.team_settings
  for all using (caixa_time.is_admin()) with check (caixa_time.is_admin());

create policy players_admin_all on caixa_time.players
  for all using (caixa_time.is_admin()) with check (caixa_time.is_admin());

create policy payments_admin_all on caixa_time.payments
  for all using (caixa_time.is_admin()) with check (caixa_time.is_admin());

-- Nenhuma policy para o papel "anon": a pagina publica de status le os dados
-- exclusivamente pelo lado do servidor com o client de service_role
-- (ver src/lib/data/public-status.ts), sem nunca expor telefone, id de
-- pagamento do Mercado Pago ou codigo Pix ao navegador.

-- Necessario pro PostgREST enxergar o schema (alem de habilitar em
-- Project Settings > API > Exposed schemas no dashboard):
grant usage on schema caixa_time to anon, authenticated, service_role;
grant all on all tables in schema caixa_time to anon, authenticated, service_role;
grant all on all sequences in schema caixa_time to anon, authenticated, service_role;
alter default privileges in schema caixa_time grant all on tables to anon, authenticated, service_role;
alter default privileges in schema caixa_time grant all on sequences to anon, authenticated, service_role;
