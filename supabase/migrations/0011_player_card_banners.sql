-- Duas artes de fundo (geradas por IA, mesma paleta azul/amarelo do time)
-- usadas como banner unico atras do card expandido do jogador: uma atras
-- da foto/video (retrato) e outra atras do bloco de texto (paisagem), pra
-- as duas metades do card parecerem uma peca so em vez de dois blocos
-- colados.

alter table caixa_time.team_settings add column player_card_media_banner_url text;
alter table caixa_time.team_settings add column player_card_info_banner_url text;
