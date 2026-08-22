-- Suporte a imagens: banner de topo (team_settings) e logo por patrocinador
-- (sponsors). As imagens em si ficam no Supabase Storage, num bucket
-- publico chamado "caixa-time-media" (criado manualmente no dashboard —
-- ver README); aqui so guardamos a URL publica resultante.

alter table caixa_time.team_settings add column banner_image_url text;
alter table caixa_time.sponsors add column logo_url text;
