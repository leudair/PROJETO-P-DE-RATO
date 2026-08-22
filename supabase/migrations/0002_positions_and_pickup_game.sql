-- Posicao do jogador (goleiro fica isento da mensalidade — ver logica em
-- src/lib/data/payments.ts e src/lib/data/public-status.ts) e uma tabela
-- separada para a "caixinha do jogo avulso" (pelada/racha esporadico com
-- time de onze aleatorio), que e' uma arrecadacao independente do elenco
-- fixo e das cobrancas de mensalidade/caixinha regulares.

alter table caixa_time.players
  add column position text check (position in ('goleiro', 'zagueiro', 'lateral', 'volante', 'meia', 'atacante'));

create table caixa_time.pickup_game_contributions (
  id uuid primary key default gen_random_uuid(),
  amount numeric(10, 2) not null check (amount >= 20),
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  mercado_pago_payment_id text unique,
  pix_qr_code text,
  pix_copy_paste text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index pickup_game_contributions_status_idx on caixa_time.pickup_game_contributions (status);

alter table caixa_time.pickup_game_contributions enable row level security;

create policy pickup_game_contributions_admin_all on caixa_time.pickup_game_contributions
  for all using (caixa_time.is_admin()) with check (caixa_time.is_admin());

grant all on all tables in schema caixa_time to anon, authenticated, service_role;

-- Sem policy "anon": assim como os pagamentos normais, a contribuicao do
-- jogo avulso e' criada pela pagina publica atraves do client de
-- service_role (ver src/lib/data/pickup-game.ts), nunca via RLS anonimo.
