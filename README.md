# Cartórios de Protesto de Mato Grosso — site + blog

Código do site institucional do IEPTB-MT e do blog/CMS, num único app React (Vite + TypeScript +
Tailwind + Supabase).

| Domínio | O que serve |
|---|---|
| `www.cartoriosdeprotestomt.com.br` | Site institucional (8 páginas pré-renderizadas) |
| `blog.cartoriosdeprotestomt.com.br` | Blog público (`/blog`, `/blog/:slug`) e CMS (`/admin`, `/editor`, `/login`) |

O mesmo build atende os dois domínios: o app decide pelo hostname (`src/lib/hosts.ts`) e o
`vercel.json` cuida de redirecionamentos e reescritas.

## Rodando localmente

```bash
cp .env.example .env   # preencha com os dados do projeto Supabase
npm install
npm run dev            # http://localhost:8080 — site em /, blog em /blog, CMS em /admin
```

## Scripts

| Comando | Faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção + pré-renderização das páginas do site (`scripts/prerender.mjs`) |
| `npm run images` | Regera as imagens do site em WebP (várias larguras) a partir de `assets-src/site/` |
| `npm run lint` | ESLint |

## Estrutura

- `src/site/` — site institucional (páginas, layout, animações, conteúdo)
- `src/pages/`, `src/components/` — blog e CMS
- `src/AppRoutes.tsx` — rotas do site; `src/BlogRoutes.tsx` — rotas do blog/CMS (carregadas sob demanda)
- `supabase/migrations/` — esquema do banco; `supabase/functions/` — edge functions
- `scripts/` — pré-renderização e otimização de imagens

## Supabase

- Variáveis do front: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`.
- Edge functions: `create-user`, `delete-user`, `set-user-password`, `publish-scheduled` (chamada a
  cada 5 min pelo `pg_cron`) e `generate-excerpt` (resumo dos posts — usa o Claude se o segredo
  `ANTHROPIC_API_KEY` estiver configurado; sem ele, gera um resumo extrativo).
- Uploads de imagem do CMS são convertidos para WebP no navegador antes de subir.
