-- caixa-time — schema inicial
-- profiles: admin do time (id = auth.users.id), acesso ao painel
-- team_settings: linha unica de configuracao (valor padrao da mensalidade, nome do time)
-- players: jogadores do time
-- payments: cobrancas de mensalidade/caixinha, com dados do Pix quando geradas via Mercado Pago

create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table public.team_settings (
  id smallint primary key default 1 check (id = 1),
  team_name text not null default 'Meu Time',
  default_mensalidade_amount numeric(10, 2) not null default 75.00,
  updated_at timestamptz not null default now()
);

insert into public.team_settings (id) values (1);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players (id) on delete cascade,
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

create index payments_player_id_idx on public.payments (player_id);
create index payments_status_idx on public.payments (status);
create index payments_reference_month_idx on public.payments (reference_month);

-- evita gerar a mensalidade duas vezes pro mesmo jogador no mesmo mes;
-- caixinha nao entra nessa restricao (varias contribuicoes no mesmo mes sao validas)
create unique index payments_mensalidade_unique_idx
  on public.payments (player_id, reference_month)
  where type = 'mensalidade';

-- helper usado nas policies de RLS para checar papel sem recursao
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.team_settings enable row level security;
alter table public.players enable row level security;
alter table public.payments enable row level security;

-- profiles: cada admin ve o proprio perfil
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());

-- team_settings/players/payments: acesso total restrito a quem tem linha em profiles (admin do time)
create policy team_settings_admin_all on public.team_settings
  for all using (public.is_admin()) with check (public.is_admin());

create policy players_admin_all on public.players
  for all using (public.is_admin()) with check (public.is_admin());

create policy payments_admin_all on public.payments
  for all using (public.is_admin()) with check (public.is_admin());

-- Nenhuma policy para o papel "anon": a pagina publica de status le os dados
-- exclusivamente pelo lado do servidor com o client de service_role
-- (ver src/lib/data/public-status.ts), sem nunca expor telefone, id de
-- pagamento do Mercado Pago ou codigo Pix ao navegador.
