-- Moldura decorativa (anel azul/dourado, miolo transparente) sobreposta
-- na foto redonda de cada jogador, reaproveitada pra todos em vez de
-- editar foto por foto.

alter table caixa_time.team_settings add column player_avatar_frame_url text;
