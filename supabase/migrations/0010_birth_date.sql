-- Troca idade (numero estatico, fica desatualizado) por data de nascimento
-- — a idade passa a ser calculada dinamicamente a partir dela, e a data
-- fica disponivel pra futuramente avisar aniversario do jogador.
alter table caixa_time.players drop column age;
alter table caixa_time.players add column birth_date date;
