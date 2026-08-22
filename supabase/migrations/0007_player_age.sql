-- Idade do jogador, exibida no card junto com a posicao.
alter table caixa_time.players add column age smallint check (age > 0 and age < 100);
