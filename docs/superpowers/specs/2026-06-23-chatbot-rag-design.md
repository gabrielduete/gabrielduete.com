# Chat-bot IA com RAG no blog — Design

**Data:** 2026-06-23
**Status:** Aprovado, pronto para plano de implementação

## Objetivo

Adicionar um chat-bot com IA no canto inferior direito de gabrielduete.com que:

1. Conhece todo o conteúdo do blog (RAG sobre os posts MDX).
2. Responde dúvidas técnicas gerais como um chat de IA normal.
3. Tem contexto especial do **artigo atual na tela** — responde dúvidas sobre o post que o leitor está lendo usando o texto completo dele.

Bilíngue (en / pt-br), seguindo i18n e design system existentes.

## Decisões (brainstorming)

| Tema | Decisão |
|------|---------|
| Conhecimento | RAG completo (vector store) |
| Vector store | Upstash Vector (embeddings hosted, free tier) |
| Modelo de chat | Groq llama (free tier) via AI SDK |
| Embeddings | Hosted no Upstash Vector (sem API separada de embeddings) |
| Indexação | Build-time (script roda no `next build`) |
| Histórico de conversa | Só sessão / localStorage (sem banco) |
| Anti-abuso | Rate limit por IP (Upstash Ratelimit) |
| Runtime do handler | Node (Fluid Compute, default Vercel) |
| Visual do widget | Bolha flutuante seguindo design system atual (Tailwind v4 + next-themes) |

## Arquitetura

```
[Widget bottom-right]  ──POST stream──>  /api/chat (route handler, Node)
   useChat (AI SDK)                          │
   localStorage history                      ├─ rate limit (Upstash Ratelimit, por IP)
                                             ├─ query top-K (Upstash Vector, filtro por locale)
                                             ├─ monta prompt: [artigo atual] + [trechos RAG] + [pergunta]
                                             └─ streamText (Groq llama, AI SDK)

[Build] next build ─> scripts/index-blog.ts ─> chunk posts MDX ─> upsert Upstash Vector
```

## Componentes

Cada unidade tem um propósito, interface definida, testável isolada.

### 1. `scripts/index-blog.ts` (indexação build-time)
- **Faz:** lê posts de `src/content/blog/{en,pt-br}/*.mdx`, faz chunk por seção, gera upsert no Upstash Vector.
- **Metadata por chunk:** `{ slug, locale, title, url, chunkIndex }`.
- **Idempotência:** id do vetor = hash determinístico do conteúdo do chunk → reindexação só altera o que mudou.
- **Trigger:** hook no script de build (ex: `prebuild` ou dentro do pipeline `next build`).
- **Depende de:** `@upstash/vector`, `gray-matter` (já no repo) para frontmatter.

### 2. `src/app/api/chat/route.ts` (handler de chat)
- **Faz:** recebe `{ messages, currentSlug, locale }`. Fluxo:
  1. Rate limit por IP (Upstash Ratelimit). Excedeu → 429.
  2. Embed + query top-K no Upstash Vector, filtrando por `locale`.
  3. Carrega o MDX do `currentSlug` (texto completo) quando presente.
  4. Monta system prompt: instruções + artigo atual + trechos RAG.
  5. `streamText` com Groq llama, retorna stream para o `useChat`.
- **Runtime:** Node.
- **Depende de:** `ai`, `@ai-sdk/groq`, `@upstash/vector`, `@upstash/ratelimit`, `@upstash/redis`, utils internos.

### 3. `src/components/ChatBot/` (widget)
- **Faz:** botão flutuante bottom-right + painel de chat. `useChat` do AI SDK. Envia `currentSlug` e `locale` da página atual. Persiste mensagens em localStorage. Streaming de resposta.
- **i18n:** textos de UI via next-intl.
- **Tema:** respeita next-themes + Tailwind v4, segue design system existente.
- **Depende de:** `ai/react` (useChat), contexto de locale/slug da página.

### 4. `src/utils/ai/` (clients e helpers)
- `upstashVector.ts` — client + query helper.
- `ratelimit.ts` — instância Upstash Ratelimit.
- `buildPrompt.ts` — monta system prompt a partir de (artigo atual, trechos RAG, locale).
- `chunk.ts` — divide MDX em chunks por seção.
- **Isolado e testável** — sem dependência de framework além dos SDKs.

## Fluxo de contexto (feature-chave)

- **Artigo atual:** a página do post passa `currentSlug` ao widget → handler injeta o texto completo do post no prompt. Dúvida sobre o post na tela é respondida com o conteúdo inteiro.
- **Resto do blog:** RAG retrieval top-K cobre perguntas tipo "qual post fala de X".
- **Dúvida técnica geral:** o modelo responde normalmente, ancorado no contexto quando relevante.

## Env vars novas

```
GROQ_API_KEY=
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Adicionar nomes (sem valores) ao `.example.env`. Provisionar Upstash Vector + Redis via Vercel Marketplace.

## Dependências novas

`ai`, `@ai-sdk/groq`, `@upstash/vector`, `@upstash/ratelimit`, `@upstash/redis`

## Testes (Jest + Testing Library, padrão do repo)

- `buildPrompt` — monta contexto correto dado (artigo atual, trechos, locale).
- `chunk` — split de MDX correto (por seção, sem perder conteúdo).
- `ratelimit` — bloqueia após N requisições do mesmo IP.
- `ChatBot` — render do botão/painel, envio de mensagem, persistência localStorage.
- Mocks de Groq e Upstash nos testes (sem chamadas reais).

## Fora de escopo (YAGNI v1)

- Histórico de conversa em banco.
- Autenticação / identidade de usuário.
- UI de troca de modelo.
- Analytics de conversas.
- Entrada/saída por voz.

## Riscos e mitigação

- **Esgotar free tier do Groq/Upstash:** rate limit por IP mitiga abuso.
- **Custo de contexto grande (post inteiro no prompt):** posts longos podem estourar contexto do llama — truncar/limitar tamanho do artigo injetado se necessário.
- **Sincronização de índice:** indexação build-time garante índice sempre alinhado ao deploy, já que posts vivem no git.
