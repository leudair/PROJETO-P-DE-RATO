-- Foto do jogador, escudo do time (separado do banner de topo), e duas
-- coisas novas:
-- - jersey_wash_contributions: caixinha separada e anonima pra lavagem dos
--   coletes, no mesmo molde de pickup_game_contributions (sem vinculo com
--   jogador, sem valor minimo).
-- - withdrawals: retiradas do caixa geral (ex: "Churrasco - R$100"), pra
--   dar transparencia no extrato publico — reduz o saldo total exibido,
--   nao pertence a nenhuma caixinha especifica.

alter table caixa_time.players add column photo_url text;
alter table caixa_time.team_settings add column crest_image_url text;

create table caixa_time.jersey_wash_contributions (
  id uuid primary key default gen_random_uuid(),
  amount numeric(10, 2) not null check (amount > 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  mercado_pago_payment_id text unique,
  pix_qr_code text,
  pix_copy_paste text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index jersey_wash_contributions_status_idx on caixa_time.jersey_wash_contributions (status);

create table caixa_time.withdrawals (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  amount numeric(10, 2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

alter table caixa_time.jersey_wash_contributions enable row level security;
alter table caixa_time.withdrawals enable row level security;

create policy jersey_wash_contributions_admin_all on caixa_time.jersey_wash_contributions
  for all using (caixa_time.is_admin()) with check (caixa_time.is_admin());

create policy withdrawals_admin_all on caixa_time.withdrawals
  for all using (caixa_time.is_admin()) with check (caixa_time.is_admin());

grant all on all tables in schema caixa_time to anon, authenticated, service_role;
