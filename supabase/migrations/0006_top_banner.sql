-- Banner fino no topo, separado do banner/video maior (que passa a ficar no
-- rodape) — pensado pra futura propaganda/patrocinio, formato mais discreto.

alter table caixa_time.team_settings add column top_banner_url text;
