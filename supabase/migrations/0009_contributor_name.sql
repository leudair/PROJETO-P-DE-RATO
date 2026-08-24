-- Nome de quem contribuiu pro jogo avulso / lavagem dos coletes — sem isso
-- o dinheiro chega via Pix mas ninguem sabe quem pagou. Coletado junto com
-- o valor no mesmo formulario (nao um passo separado depois do pagamento).
alter table caixa_time.pickup_game_contributions add column contributor_name text;
alter table caixa_time.jersey_wash_contributions add column contributor_name text;
