# Caixa do Time

Site para controlar a mensalidade e a caixinha do time: cobrança via Pix
(Mercado Pago) e uma página pública mostrando quem já pagou.

- **Painel admin** (`/admin`): cadastro de jogadores, geração de cobranças
  (mensalidade do mês / caixinha avulsa), geração de Pix e confirmação de
  pagamento automática via webhook do Mercado Pago.
- **Página pública** (`/`): sem login, mostra o status de pagamento de cada
  jogador no mês e o total arrecadado.

Stack: Next.js 16 (App Router) + Supabase + Tailwind CSS v4.

## Rodando localmente

```bash
npm install
npm run dev
```

Copie `.env.local.example` para `.env.local` e preencha os valores (veja os
checklists abaixo). Sem um projeto Supabase real configurado, o app builda e
o admin renderiza, mas qualquer consulta ao banco falha em runtime — isso é
esperado até o checklist do Supabase ser concluído.

## Checklist: Supabase (obrigatório para o app funcionar de verdade)

**Importante:** as tabelas do caixa-time vivem no schema **`caixa_time`**,
não em `public`. Isso é proposital — o projeto Supabase usado pode ser
compartilhado com outro produto (ex: o plano free só permite alguns
projetos gratuitos por organização), e um schema próprio isola
completamente as tabelas de um app das do outro, sem risco de colisão de
nomes e sem precisar pagar por um projeto dedicado. Se você tiver um
projeto Supabase totalmente livre só para isso, pode usar `caixa_time`
mesmo assim (não custa nada extra) ou trocar por `public` em todas as
migrations + `db: { schema: ... }` nos 3 clients em `src/lib/supabase/`.

1. Criar (ou reaproveitar) um projeto em
   [supabase.com/dashboard](https://supabase.com/dashboard).
2. Preencher em `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` (em
   Project Settings > API).
3. Rodar o conteúdo de `supabase/migrations/0001_init.sql` até
   `0004_banner_images.sql`, em ordem, no SQL Editor do Supabase (sem CLI
   linkado neste setup — `npx supabase link`/`db push` não foram usados).
4. **Expor o schema na API**: Project Settings → API → **Exposed schemas**
   → adicionar `caixa_time` à lista (por padrão só `public` está exposto;
   sem isso o PostgREST retorna 404 pra qualquer tabela do app).
5. Gerar os tipos reais (substitui o `database.types.ts` escrito à mão):
   ```bash
   npx supabase gen types typescript --linked --schema caixa_time > src/lib/supabase/database.types.ts
   ```
6. Criar o primeiro admin manualmente (não há tela de cadastro, é
   intencional — time pequeno e de confiança):
   - Authentication > Users > "Add user" no dashboard do Supabase, com
     email/senha.
   - No SQL Editor, rodar:
     ```sql
     insert into caixa_time.profiles (id, full_name)
     values ('<uuid do usuario criado acima>', 'Seu nome');
     ```
7. Logar em `/admin/login` com esse email/senha.
8. Para o banner de imagem (topo da página pública) e logo de patrocinador
   funcionarem, criar um bucket público no Storage: **Storage → New bucket**,
   nome `caixa-time-media` (nome específico para não colidir com buckets de
   outro produto no mesmo projeto), marcar **Public bucket**. O upload em
   si é feito pelo admin (via service_role, bypassa RLS de storage) — não
   precisa configurar policy nenhuma no bucket.

## Checklist: Mercado Pago (fica para o final)

Sem essas variáveis, o botão "Gerar Pix" mostra um aviso amigável (não
quebra o app) e o webhook recusa toda requisição com 401.

1. Criar/acessar a conta no [painel do desenvolvedor Mercado Pago](https://www.mercadopago.com.br/developers/panel).
2. Pegar o **Access Token** de produção (ou teste) e colocar em
   `MP_ACCESS_TOKEN`.
3. Em Notificações > Webhooks, cadastrar a URL
   `https://<seu-dominio>/api/webhooks/mercadopago` e copiar a **chave
   secreta** gerada para `MP_WEBHOOK_SECRET`.
4. Preencher `NEXT_PUBLIC_SITE_URL` com a URL pública real do site (usada
   como `notification_url` ao criar cada cobrança Pix).
5. Testar: gerar uma cobrança de mensalidade/caixinha no admin, clicar em
   "Gerar Pix", pagar o QR code gerado (ambiente de teste ou real) e
   confirmar que o status muda para "Pago" automaticamente via webhook.

Enquanto o segredo real não existe, dá pra testar o endpoint localmente com
o fallback de `?secret=` documentado em `src/lib/mercadopago/webhook.ts` —
não usar isso em produção depois que a verificação de assinatura estiver
confirmada funcionando.

## Estrutura

```
src/
  proxy.ts                 → protege /admin/* (sessão), pagina publica fica de fora
  app/
    (public)/page.tsx      → "/" pagina publica de status
    (admin)/admin/...      → painel (jogadores, cobrancas, configuracoes)
    api/webhooks/mercadopago/route.ts
  lib/
    supabase/               → clients (browser/server/admin) + env
    data/                   → camada de dados (auth, players, payments, settings, public-status)
    mercadopago/            → cliente isolado da API do Mercado Pago
    utils/                  → formatacao de moeda e mes
supabase/migrations/*.sql → schema completo (tabelas + RLS), no schema "caixa_time"
```

## Deploy

Recomendado: [Vercel](https://vercel.com/new). Configurar as mesmas
variáveis de ambiente de `.env.local` no painel do projeto.
