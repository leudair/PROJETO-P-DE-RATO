-- Foto estatica separada pro circulo pequeno (avatar com moldura). O
-- photo_url continua sendo usado no banner grande do card expandido, que
-- pode ser foto OU video; avatar_photo_url e' sempre uma imagem estatica,
-- pra garantir enquadramento confiavel dentro da moldura (video tem frame
-- variavel dependendo do instante que carrega). Se nulo, cai pra
-- photo_url como fallback.

alter table caixa_time.players add column avatar_photo_url text;
