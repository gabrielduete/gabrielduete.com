# Chat-bot IA com RAG — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a floating bottom-right AI chat-bot to gabrielduete.com that answers questions grounded in the blog (RAG over all MDX posts) and has special context of the post currently on screen.

**Architecture:** A build-time script chunks every MDX post and upserts it into an Upstash Vector index (hosted embeddings). A Node route handler `/api/chat` rate-limits per IP, queries the vector index, injects the current post's full text plus retrieved chunks into the system prompt, and streams a response from a Groq llama model via the AI SDK. A client `ChatBot` component (mounted globally in the layout) reads the current slug/locale from the URL pathname, talks to the handler via `useChat`, and persists history in localStorage.

**Tech Stack:** Next.js 15 (App Router, RSC), React 19, TypeScript, Tailwind v4, next-intl, Jest + Testing Library, AI SDK (`ai`), `@ai-sdk/groq`, `@ai-sdk/react`, `@upstash/vector`, `@upstash/ratelimit`, `@upstash/redis`.

## Global Constraints

- Node version: project default (no edge runtime for the chat handler — use Node).
- Path alias: `@/*` maps to `src/*` (see `tsconfig.json`).
- Components live in `src/components/<Name>/index.tsx` with co-located `index.spec.tsx`. Client components start with `'use client'`.
- Locales: `Locales` enum in `src/enums/Locales.ts` — `EN = 'en'`, `PT_BR = 'pt-br'`. Locales list also in `src/i18n/routing.ts` (`defaultLocale: 'en'`).
- Blog posts: `src/content/blog/{en,pt-br}/<slug>.mdx`, frontmatter via `gray-matter` with keys `title, description, date, category, tags, pinned`.
- Read a post with existing helper: `getBlogData(slug, locale)` from `src/app/[locale]/blog/helpers/getDataContentFile.ts` → returns `{ content, data }`.
- i18n UI strings: add to `src/messages/en.json` and `src/messages/pt-br.json` under a new `ChatBot` key, consumed with `next-intl`.
- Styling: Tailwind v4 utility classes; reuse existing custom tokens seen in the codebase (e.g. `green-black`, `green-white`, `text-secondary`, `text-primary`). Respect dark/light via `next-themes` (already installed).
- **AI SDK API churns — do not trust memory.** In every AI-SDK task there is an explicit step to verify the current signature against `node_modules/ai/docs/` and `node_modules/@ai-sdk/*/docs/` before writing/finalizing code. Run `npx tsc --noEmit` after AI-SDK changes.
- Tests: `npm test` (Jest). Run the specific file during TDD: `npm test -- <path>`.
- Lint/format must pass: `npm run lint`.

---

## Task 1: Dependencies, env scaffolding, and config helper

**Files:**
- Modify: `package.json` (dependencies + `prebuild` script)
- Modify: `.example.env`
- Create: `src/utils/ai/env.ts`
- Test: `src/utils/ai/env.spec.ts`

**Interfaces:**
- Produces: `getAiEnv(): { groqApiKey: string; vectorUrl: string; vectorToken: string; redisUrl: string; redisToken: string }` — throws if a required var is missing.

- [ ] **Step 1: Install runtime deps**

Run:
```bash
npm install ai @ai-sdk/react @ai-sdk/groq @upstash/vector @upstash/ratelimit @upstash/redis
```
Expected: packages added to `dependencies` in `package.json`, no peer-dep errors that fail install.

- [ ] **Step 2: Document env vars in `.example.env`**

Append to `.example.env`:
```
# Groq (free tier) — chat model
GROQ_API_KEY=
# Upstash Vector — blog RAG index (hosted embeddings)
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=
# Upstash Redis — per-IP rate limiting for /api/chat
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

- [ ] **Step 3: Write the failing test for the env helper**

Create `src/utils/ai/env.spec.ts`:
```ts
import { getAiEnv } from './env'

describe('getAiEnv', () => {
  const OLD = process.env

  beforeEach(() => {
    process.env = { ...OLD }
  })

  afterAll(() => {
    process.env = OLD
  })

  it('returns all values when env is complete', () => {
    process.env.GROQ_API_KEY = 'g'
    process.env.UPSTASH_VECTOR_REST_URL = 'vu'
    process.env.UPSTASH_VECTOR_REST_TOKEN = 'vt'
    process.env.UPSTASH_REDIS_REST_URL = 'ru'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'rt'

    expect(getAiEnv()).toEqual({
      groqApiKey: 'g',
      vectorUrl: 'vu',
      vectorToken: 'vt',
      redisUrl: 'ru',
      redisToken: 'rt',
    })
  })

  it('throws when a required var is missing', () => {
    delete process.env.GROQ_API_KEY
    expect(() => getAiEnv()).toThrow('GROQ_API_KEY')
  })
})
```

- [ ] **Step 4: Run test, verify it fails**

Run: `npm test -- src/utils/ai/env.spec.ts`
Expected: FAIL — cannot find module `./env`.

- [ ] **Step 5: Implement the env helper**

Create `src/utils/ai/env.ts`:
```ts
function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export function getAiEnv() {
  return {
    groqApiKey: required('GROQ_API_KEY'),
    vectorUrl: required('UPSTASH_VECTOR_REST_URL'),
    vectorToken: required('UPSTASH_VECTOR_REST_TOKEN'),
    redisUrl: required('UPSTASH_REDIS_REST_URL'),
    redisToken: required('UPSTASH_REDIS_REST_TOKEN'),
  }
}
```

- [ ] **Step 6: Run test, verify it passes**

Run: `npm test -- src/utils/ai/env.spec.ts`
Expected: PASS (2 tests).

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json .example.env src/utils/ai/env.ts src/utils/ai/env.spec.ts
git commit -m "feat(chatbot): add AI deps and env config helper"
```

---

## Task 2: MDX chunker

**Files:**
- Create: `src/utils/ai/chunk.ts`
- Test: `src/utils/ai/chunk.spec.ts`

**Interfaces:**
- Produces: `chunkMarkdown(content: string, maxChars?: number): string[]` — splits markdown by top-level headings (`#`/`##`), further splitting any section longer than `maxChars` (default 1500) on paragraph boundaries. Drops empty chunks. Keeps the heading line with its section.

- [ ] **Step 1: Write the failing test**

Create `src/utils/ai/chunk.spec.ts`:
```ts
import { chunkMarkdown } from './chunk'

describe('chunkMarkdown', () => {
  it('splits content into one chunk per heading section', () => {
    const md = `# Intro\nHello world.\n\n## Details\nMore text here.`
    const chunks = chunkMarkdown(md)

    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toContain('# Intro')
    expect(chunks[0]).toContain('Hello world.')
    expect(chunks[1]).toContain('## Details')
  })

  it('drops empty/whitespace-only sections', () => {
    const md = `# A\n\n\n## B\ntext`
    const chunks = chunkMarkdown(md)

    expect(chunks.every(c => c.trim().length > 0)).toBe(true)
  })

  it('splits a section longer than maxChars into multiple chunks', () => {
    const long = 'word '.repeat(500) // 2500 chars
    const md = `# Big\n${long}`
    const chunks = chunkMarkdown(md, 1000)

    expect(chunks.length).toBeGreaterThan(1)
    chunks.forEach(c => expect(c.length).toBeLessThanOrEqual(1000 + 50))
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/utils/ai/chunk.spec.ts`
Expected: FAIL — cannot find module `./chunk`.

- [ ] **Step 3: Implement the chunker**

Create `src/utils/ai/chunk.ts`:
```ts
const DEFAULT_MAX = 1500

function splitLongSection(section: string, maxChars: number): string[] {
  if (section.length <= maxChars) return [section]

  const paragraphs = section.split(/\n{2,}/)
  const out: string[] = []
  let buffer = ''

  for (const para of paragraphs) {
    if (buffer && buffer.length + para.length + 2 > maxChars) {
      out.push(buffer.trim())
      buffer = ''
    }
    buffer += (buffer ? '\n\n' : '') + para
  }
  if (buffer.trim()) out.push(buffer.trim())
  return out
}

export function chunkMarkdown(content: string, maxChars = DEFAULT_MAX): string[] {
  // Split before any line starting with one or two '#'
  const sections = content
    .split(/\n(?=#{1,2}\s)/)
    .map(s => s.trim())
    .filter(Boolean)

  const source = sections.length > 0 ? sections : [content.trim()].filter(Boolean)

  return source.flatMap(section => splitLongSection(section, maxChars))
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- src/utils/ai/chunk.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/ai/chunk.ts src/utils/ai/chunk.spec.ts
git commit -m "feat(chatbot): add MDX chunker"
```

---

## Task 3: List-all-posts helper

**Files:**
- Create: `src/utils/ai/listPosts.ts`
- Test: `src/utils/ai/listPosts.spec.ts`

**Interfaces:**
- Consumes: `Locales` enum.
- Produces:
  - `type PostEntry = { slug: string; locale: string; title: string; url: string; content: string }`
  - `listAllPosts(): PostEntry[]` — reads every `.mdx` under `src/content/blog/<locale>/`, parses frontmatter with `gray-matter`, returns one entry per file. `url` = `/{locale}/blog/{slug}`. `title` falls back to slug if frontmatter lacks it.

- [ ] **Step 1: Write the failing test**

Create `src/utils/ai/listPosts.spec.ts`:
```ts
import { listAllPosts } from './listPosts'

describe('listAllPosts', () => {
  it('returns entries for both locales with required fields', () => {
    const posts = listAllPosts()

    expect(posts.length).toBeGreaterThan(0)
    const sample = posts[0]
    expect(sample).toHaveProperty('slug')
    expect(sample).toHaveProperty('locale')
    expect(sample).toHaveProperty('title')
    expect(sample).toHaveProperty('content')
    expect(sample.url).toMatch(/^\/(en|pt-br)\/blog\//)
  })

  it('includes both en and pt-br posts', () => {
    const posts = listAllPosts()
    const locales = new Set(posts.map(p => p.locale))

    expect(locales.has('en')).toBe(true)
    expect(locales.has('pt-br')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/utils/ai/listPosts.spec.ts`
Expected: FAIL — cannot find module `./listPosts`.

- [ ] **Step 3: Implement the helper**

Create `src/utils/ai/listPosts.ts`:
```ts
import { Locales } from '@/enums/Locales'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export type PostEntry = {
  slug: string
  locale: string
  title: string
  url: string
  content: string
}

const BLOG_ROOT = path.join(process.cwd(), 'src/content/blog')

export function listAllPosts(): PostEntry[] {
  const locales = [Locales.EN, Locales.PT_BR]
  const entries: PostEntry[] = []

  for (const locale of locales) {
    const dir = path.join(BLOG_ROOT, locale)
    if (!fs.existsSync(dir)) continue

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
      const { content, data } = matter(raw)

      entries.push({
        slug,
        locale,
        title: typeof data.title === 'string' ? data.title : slug,
        url: `/${locale}/blog/${slug}`,
        content,
      })
    }
  }

  return entries
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- src/utils/ai/listPosts.spec.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/ai/listPosts.ts src/utils/ai/listPosts.spec.ts
git commit -m "feat(chatbot): add list-all-posts helper"
```

---

## Task 4: Upstash Vector client + query helper

**Files:**
- Create: `src/utils/ai/upstashVector.ts`
- Test: `src/utils/ai/upstashVector.spec.ts`

**Interfaces:**
- Consumes: `getAiEnv` (Task 1).
- Produces:
  - `getVectorIndex(): Index` — memoized `@upstash/vector` client built from env.
  - `type RetrievedChunk = { text: string; slug: string; title: string; url: string; score: number }`
  - `queryRelevantChunks(query: string, locale: string, topK?: number): Promise<RetrievedChunk[]>` — queries the index with `data: query`, filters by `locale`, returns mapped chunks (default topK 4).

**Notes:** Upstash Vector with a hosted embedding model accepts `upsert({ id, data, metadata })` and `query({ data, topK, includeMetadata, filter })` where `data` is raw text (the index embeds it). Verify exact method names against `node_modules/@upstash/vector/` before finalizing.

- [ ] **Step 1: Verify the @upstash/vector API**

Run: `grep -rE "query|upsert|filter|includeMetadata" node_modules/@upstash/vector/dist/*.d.ts | head -40`
Expected: confirm `query` accepts `{ data, topK, includeMetadata, filter }` and `upsert` accepts `{ id, data, metadata }`. Adjust code below if signatures differ.

- [ ] **Step 2: Write the failing test (mocked client)**

Create `src/utils/ai/upstashVector.spec.ts`:
```ts
const queryMock = jest.fn()

jest.mock('@upstash/vector', () => ({
  Index: jest.fn().mockImplementation(() => ({ query: queryMock })),
}))

jest.mock('./env', () => ({
  getAiEnv: () => ({
    vectorUrl: 'u',
    vectorToken: 't',
    groqApiKey: 'g',
    redisUrl: 'ru',
    redisToken: 'rt',
  }),
}))

import { queryRelevantChunks } from './upstashVector'

describe('queryRelevantChunks', () => {
  beforeEach(() => queryMock.mockReset())

  it('maps results to RetrievedChunk and passes a locale filter', async () => {
    queryMock.mockResolvedValue([
      {
        score: 0.9,
        metadata: { text: 'chunk text', slug: 's', title: 'T', url: '/en/blog/s' },
      },
    ])

    const result = await queryRelevantChunks('hello', 'en', 3)

    expect(queryMock).toHaveBeenCalledTimes(1)
    const arg = queryMock.mock.calls[0][0]
    expect(arg.data).toBe('hello')
    expect(arg.topK).toBe(3)
    expect(String(arg.filter)).toContain('en')
    expect(result[0]).toEqual({
      text: 'chunk text',
      slug: 's',
      title: 'T',
      url: '/en/blog/s',
      score: 0.9,
    })
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npm test -- src/utils/ai/upstashVector.spec.ts`
Expected: FAIL — cannot find module `./upstashVector`.

- [ ] **Step 4: Implement the client + query helper**

Create `src/utils/ai/upstashVector.ts`:
```ts
import { getAiEnv } from './env'
import { Index } from '@upstash/vector'

let index: Index | null = null

export function getVectorIndex(): Index {
  if (index) return index
  const env = getAiEnv()
  index = new Index({ url: env.vectorUrl, token: env.vectorToken })
  return index
}

export type RetrievedChunk = {
  text: string
  slug: string
  title: string
  url: string
  score: number
}

export async function queryRelevantChunks(
  query: string,
  locale: string,
  topK = 4,
): Promise<RetrievedChunk[]> {
  const results = await getVectorIndex().query({
    data: query,
    topK,
    includeMetadata: true,
    filter: `locale = '${locale}'`,
  })

  return (results ?? []).map((r: any) => ({
    text: String(r.metadata?.text ?? ''),
    slug: String(r.metadata?.slug ?? ''),
    title: String(r.metadata?.title ?? ''),
    url: String(r.metadata?.url ?? ''),
    score: Number(r.score ?? 0),
  }))
}
```

- [ ] **Step 5: Run test, verify it passes**

Run: `npm test -- src/utils/ai/upstashVector.spec.ts`
Expected: PASS (1 test).

- [ ] **Step 6: Typecheck and commit**

Run: `npx tsc --noEmit`
Expected: no errors.
```bash
git add src/utils/ai/upstashVector.ts src/utils/ai/upstashVector.spec.ts
git commit -m "feat(chatbot): add Upstash Vector query helper"
```

---

## Task 5: Indexing script + build hook

**Files:**
- Create: `scripts/index-blog.ts`
- Modify: `package.json` (add `prebuild` script)
- Test: `scripts/index-blog.spec.ts`

**Interfaces:**
- Consumes: `listAllPosts` (Task 3), `chunkMarkdown` (Task 2), `getVectorIndex` (Task 4).
- Produces:
  - `buildVectorRecords(posts: PostEntry[]): { id: string; data: string; metadata: Record<string, string | number> }[]` — exported pure function: for each post, chunk content, produce one record per chunk with deterministic id `${locale}:${slug}:${chunkIndex}` and metadata `{ text, slug, locale, title, url, chunkIndex }`.
  - `indexBlog(): Promise<number>` — builds records from `listAllPosts()` and upserts them in batches, returns total record count. Invoked when the script runs directly.

**Notes:** Build-time guard — if env vars are missing (e.g. preview without Upstash), log a warning and skip rather than failing the build.

- [ ] **Step 1: Write the failing test for `buildVectorRecords`**

Create `scripts/index-blog.spec.ts`:
```ts
import { buildVectorRecords } from './index-blog'

describe('buildVectorRecords', () => {
  it('produces one record per chunk with deterministic ids and metadata', () => {
    const posts = [
      {
        slug: 'my-post',
        locale: 'en',
        title: 'My Post',
        url: '/en/blog/my-post',
        content: `# A\nfirst.\n\n## B\nsecond.`,
      },
    ]

    const records = buildVectorRecords(posts as any)

    expect(records.length).toBe(2)
    expect(records[0].id).toBe('en:my-post:0')
    expect(records[1].id).toBe('en:my-post:1')
    expect(records[0].metadata).toMatchObject({
      slug: 'my-post',
      locale: 'en',
      title: 'My Post',
      url: '/en/blog/my-post',
      chunkIndex: 0,
    })
    expect(typeof records[0].data).toBe('string')
    expect(records[0].metadata.text).toContain('# A')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- scripts/index-blog.spec.ts`
Expected: FAIL — cannot find module `./index-blog`.

- [ ] **Step 3: Implement the script**

Create `scripts/index-blog.ts`:
```ts
import { chunkMarkdown } from '../src/utils/ai/chunk'
import { listAllPosts, type PostEntry } from '../src/utils/ai/listPosts'
import { getVectorIndex } from '../src/utils/ai/upstashVector'

type VectorRecord = {
  id: string
  data: string
  metadata: Record<string, string | number>
}

export function buildVectorRecords(posts: PostEntry[]): VectorRecord[] {
  const records: VectorRecord[] = []

  for (const post of posts) {
    const chunks = chunkMarkdown(post.content)

    chunks.forEach((text, chunkIndex) => {
      records.push({
        id: `${post.locale}:${post.slug}:${chunkIndex}`,
        data: text,
        metadata: {
          text,
          slug: post.slug,
          locale: post.locale,
          title: post.title,
          url: post.url,
          chunkIndex,
        },
      })
    })
  }

  return records
}

export async function indexBlog(): Promise<number> {
  const records = buildVectorRecords(listAllPosts())
  const index = getVectorIndex()

  const BATCH = 50
  for (let i = 0; i < records.length; i += BATCH) {
    await index.upsert(records.slice(i, i + BATCH))
  }

  return records.length
}

if (require.main === module) {
  const hasEnv =
    process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN

  if (!hasEnv) {
    console.warn('[index-blog] Upstash Vector env missing — skipping indexing.')
    process.exit(0)
  }

  indexBlog()
    .then(count => {
      console.log(`[index-blog] Upserted ${count} chunks.`)
      process.exit(0)
    })
    .catch(err => {
      console.error('[index-blog] Failed:', err)
      process.exit(1)
    })
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- scripts/index-blog.spec.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Wire the build hook**

In `package.json` `scripts`, add a `prebuild` entry that runs the script with `ts-node` (already a devDependency):
```json
"prebuild": "ts-node --compiler-options '{\"module\":\"commonjs\"}' scripts/index-blog.ts",
```
Verify `next build` still works locally even without Upstash env (script should warn and exit 0):
Run: `npm run prebuild`
Expected: prints `[index-blog] Upstash Vector env missing — skipping indexing.` when env unset, exit 0.

- [ ] **Step 6: Commit**

```bash
git add scripts/index-blog.ts scripts/index-blog.spec.ts package.json
git commit -m "feat(chatbot): add build-time blog indexing script"
```

---

## Task 6: Rate limiter

**Files:**
- Create: `src/utils/ai/ratelimit.ts`
- Test: `src/utils/ai/ratelimit.spec.ts`

**Interfaces:**
- Consumes: `getAiEnv` (Task 1).
- Produces: `checkRateLimit(ip: string): Promise<{ success: boolean }>` — uses `@upstash/ratelimit` sliding window (10 requests / 60s) backed by Upstash Redis. Memoized limiter instance.

- [ ] **Step 1: Write the failing test (mocked)**

Create `src/utils/ai/ratelimit.spec.ts`:
```ts
const limitMock = jest.fn()

jest.mock('@upstash/ratelimit', () => {
  const Ratelimit: any = jest
    .fn()
    .mockImplementation(() => ({ limit: limitMock }))
  Ratelimit.slidingWindow = jest.fn(() => 'sliding-window')
  return { Ratelimit }
})

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('./env', () => ({
  getAiEnv: () => ({
    redisUrl: 'ru',
    redisToken: 'rt',
    groqApiKey: 'g',
    vectorUrl: 'vu',
    vectorToken: 'vt',
  }),
}))

import { checkRateLimit } from './ratelimit'

describe('checkRateLimit', () => {
  it('returns success from the limiter keyed by ip', async () => {
    limitMock.mockResolvedValue({ success: true })

    const result = await checkRateLimit('1.2.3.4')

    expect(limitMock).toHaveBeenCalledWith('1.2.3.4')
    expect(result.success).toBe(true)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/utils/ai/ratelimit.spec.ts`
Expected: FAIL — cannot find module `./ratelimit`.

- [ ] **Step 3: Implement the limiter**

Create `src/utils/ai/ratelimit.ts`:
```ts
import { getAiEnv } from './env'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let limiter: Ratelimit | null = null

function getLimiter(): Ratelimit {
  if (limiter) return limiter
  const env = getAiEnv()
  const redis = new Redis({ url: env.redisUrl, token: env.redisToken })
  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    prefix: 'chatbot',
  })
  return limiter
}

export async function checkRateLimit(ip: string): Promise<{ success: boolean }> {
  const { success } = await getLimiter().limit(ip)
  return { success }
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- src/utils/ai/ratelimit.spec.ts`
Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/utils/ai/ratelimit.ts src/utils/ai/ratelimit.spec.ts
git commit -m "feat(chatbot): add per-IP rate limiter"
```

---

## Task 7: System prompt builder

**Files:**
- Create: `src/utils/ai/buildPrompt.ts`
- Test: `src/utils/ai/buildPrompt.spec.ts`

**Interfaces:**
- Consumes: `RetrievedChunk` (Task 4).
- Produces:
  - `type BuildPromptArgs = { locale: string; currentArticle?: { title: string; content: string } | null; chunks: RetrievedChunk[] }`
  - `buildSystemPrompt(args: BuildPromptArgs): string` — composes a system prompt that (a) sets the assistant persona for Gabriel Duete's blog, (b) instructs answering in the user's locale language, (c) includes the current article's full text when present, (d) includes retrieved chunks as reference context with their URLs, (e) instructs to ground answers in provided context and answer general technical questions otherwise.
  - Truncates `currentArticle.content` to 6000 chars to bound prompt size.

- [ ] **Step 1: Write the failing test**

Create `src/utils/ai/buildPrompt.spec.ts`:
```ts
import { buildSystemPrompt } from './buildPrompt'

const chunks = [
  { text: 'lazy loading explained', slug: 'lazy', title: 'Lazy', url: '/en/blog/lazy', score: 0.8 },
]

describe('buildSystemPrompt', () => {
  it('includes the current article title and content when provided', () => {
    const prompt = buildSystemPrompt({
      locale: 'pt-br',
      currentArticle: { title: 'Meu Post', content: 'conteudo do post' },
      chunks: [],
    })

    expect(prompt).toContain('Meu Post')
    expect(prompt).toContain('conteudo do post')
    expect(prompt).toContain('pt-br')
  })

  it('includes retrieved chunks with their urls', () => {
    const prompt = buildSystemPrompt({ locale: 'en', currentArticle: null, chunks })

    expect(prompt).toContain('lazy loading explained')
    expect(prompt).toContain('/en/blog/lazy')
  })

  it('truncates very long article content', () => {
    const long = 'x'.repeat(10000)
    const prompt = buildSystemPrompt({
      locale: 'en',
      currentArticle: { title: 'T', content: long },
      chunks: [],
    })

    expect(prompt).not.toContain('x'.repeat(7000))
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/utils/ai/buildPrompt.spec.ts`
Expected: FAIL — cannot find module `./buildPrompt`.

- [ ] **Step 3: Implement the prompt builder**

Create `src/utils/ai/buildPrompt.ts`:
```ts
import type { RetrievedChunk } from './upstashVector'

export type BuildPromptArgs = {
  locale: string
  currentArticle?: { title: string; content: string } | null
  chunks: RetrievedChunk[]
}

const MAX_ARTICLE_CHARS = 6000

export function buildSystemPrompt({
  locale,
  currentArticle,
  chunks,
}: BuildPromptArgs): string {
  const parts: string[] = []

  parts.push(
    `You are the assistant for Gabriel Duete's developer blog (gabrielduete.com). ` +
      `Answer clearly and concisely. Always reply in the language matching locale "${locale}" ` +
      `(pt-br = Portuguese, en = English). You can answer general technical/programming questions, ` +
      `but when the provided blog context is relevant, ground your answer in it and cite the post URL.`,
  )

  if (currentArticle) {
    const content = currentArticle.content.slice(0, MAX_ARTICLE_CHARS)
    parts.push(
      `The reader is currently viewing this article:\n` +
        `Title: ${currentArticle.title}\n` +
        `Content:\n${content}`,
    )
  }

  if (chunks.length > 0) {
    const refs = chunks
      .map((c, i) => `[${i + 1}] (${c.title} — ${c.url})\n${c.text}`)
      .join('\n\n')
    parts.push(`Reference excerpts from other blog posts:\n${refs}`)
  }

  return parts.join('\n\n---\n\n')
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- src/utils/ai/buildPrompt.spec.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/utils/ai/buildPrompt.ts src/utils/ai/buildPrompt.spec.ts
git commit -m "feat(chatbot): add system prompt builder"
```

---

## Task 8: Chat route handler

**Files:**
- Create: `src/app/api/chat/route.ts`
- Test: `src/app/api/chat/route.spec.ts`

**Interfaces:**
- Consumes: `checkRateLimit` (Task 6), `queryRelevantChunks` (Task 4), `buildSystemPrompt` (Task 7), `getBlogData` (existing helper), `getAiEnv` (Task 1).
- Request body (JSON): `{ messages: UIMessage[]; currentSlug?: string; locale?: string }`.
- Behaviour:
  1. Resolve IP from `x-forwarded-for` header (fallback `'anonymous'`). Rate-limit → on failure return `429`.
  2. Default `locale` to `'en'` if absent/invalid.
  3. If `currentSlug` present, load full post via `getBlogData(currentSlug, locale)` (wrap in try/catch; missing file → no current article).
  4. Derive a query string from the latest user message text; `queryRelevantChunks(query, locale)`.
  5. `buildSystemPrompt(...)`, then `streamText({ model: groq(<model>), system, messages: convertToModelMessages(messages) })`.
  6. Return `result.toUIMessageStreamResponse()`.
- `export const runtime = 'nodejs'`.

**Notes — verify AI SDK v6 API before coding:**
- `grep -rE "toUIMessageStreamResponse|convertToModelMessages|streamText" node_modules/ai/docs/ | head`
- `grep -rE "export" node_modules/@ai-sdk/groq/dist/*.d.ts | head` — confirm the `groq` factory and how the API key is read (env `GROQ_API_KEY` is the default).
- Confirm current Groq model id (free tier). Run: `node -e "fetch('https://api.groq.com/openai/v1/models',{headers:{Authorization:'Bearer '+process.env.GROQ_API_KEY}}).then(r=>r.json()).then(d=>console.log(d.data?.map(m=>m.id)))"` and pick a current llama model (e.g. `llama-3.3-70b-versatile`). Use that id in code.

- [ ] **Step 1: Verify AI SDK + Groq API and model id**

Run the three commands in **Notes** above. Record: the exact `streamText` return method for App Router streaming, the `convertToModelMessages` import path, and a valid Groq llama model id. Use these in Steps 3–4.

- [ ] **Step 2: Write the failing test (all deps mocked)**

Create `src/app/api/chat/route.spec.ts`:
```ts
jest.mock('@/utils/ai/ratelimit', () => ({
  checkRateLimit: jest.fn(),
}))
jest.mock('@/utils/ai/upstashVector', () => ({
  queryRelevantChunks: jest.fn().mockResolvedValue([]),
}))
jest.mock('@/app/[locale]/blog/helpers/getDataContentFile', () => ({
  getBlogData: jest.fn(() => ({ content: 'post body', data: { title: 'Post' } })),
}))

const streamTextMock = jest.fn(() => ({
  toUIMessageStreamResponse: () => new Response('ok', { status: 200 }),
}))
jest.mock('ai', () => ({
  streamText: (...args: any[]) => streamTextMock(...args),
  convertToModelMessages: (m: any) => m,
}))
jest.mock('@ai-sdk/groq', () => ({ groq: () => 'model' }))

import { checkRateLimit } from '@/utils/ai/ratelimit'
import { POST } from './route'

function makeRequest(body: any) {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '9.9.9.9' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    streamTextMock.mockClear()
    ;(checkRateLimit as jest.Mock).mockResolvedValue({ success: true })
  })

  it('returns 429 when rate limited', async () => {
    ;(checkRateLimit as jest.Mock).mockResolvedValue({ success: false })

    const res = await POST(makeRequest({ messages: [], locale: 'en' }))

    expect(res.status).toBe(429)
    expect(streamTextMock).not.toHaveBeenCalled()
  })

  it('streams a response when allowed', async () => {
    const res = await POST(
      makeRequest({
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'hi' }] }],
        currentSlug: 'post',
        locale: 'en',
      }),
    )

    expect(res.status).toBe(200)
    expect(streamTextMock).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npm test -- src/app/api/chat/route.spec.ts`
Expected: FAIL — cannot find module `./route`.

- [ ] **Step 4: Implement the handler**

Create `src/app/api/chat/route.ts` (adjust API names per Step 1 findings):
```ts
import { getBlogData } from '@/app/[locale]/blog/helpers/getDataContentFile'
import { Locales } from '@/enums/Locales'
import { buildSystemPrompt } from '@/utils/ai/buildPrompt'
import { checkRateLimit } from '@/utils/ai/ratelimit'
import { queryRelevantChunks } from '@/utils/ai/upstashVector'
import { groq } from '@ai-sdk/groq'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'

export const runtime = 'nodejs'

const MODEL = 'llama-3.3-70b-versatile' // confirm via Step 1

function resolveLocale(value: unknown): string {
  return value === Locales.PT_BR ? Locales.PT_BR : Locales.EN
}

function latestUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find(m => m.role === 'user')
  if (!last) return ''
  return (last.parts ?? [])
    .filter((p: any) => p.type === 'text')
    .map((p: any) => p.text)
    .join(' ')
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous'

  const { success } = await checkRateLimit(ip)
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }

  const body = await req.json()
  const messages: UIMessage[] = body.messages ?? []
  const locale = resolveLocale(body.locale)

  let currentArticle: { title: string; content: string } | null = null
  if (body.currentSlug) {
    try {
      const { content, data } = getBlogData(body.currentSlug, locale as Locales)
      currentArticle = {
        title: typeof data.title === 'string' ? data.title : body.currentSlug,
        content,
      }
    } catch {
      currentArticle = null
    }
  }

  const query = latestUserText(messages)
  const chunks = query ? await queryRelevantChunks(query, locale) : []

  const system = buildSystemPrompt({ locale, currentArticle, chunks })

  const result = streamText({
    model: groq(MODEL),
    system,
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
```

- [ ] **Step 5: Run test, verify it passes**

Run: `npm test -- src/app/api/chat/route.spec.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Typecheck and commit**

Run: `npx tsc --noEmit`
Expected: no errors.
```bash
git add src/app/api/chat/route.ts src/app/api/chat/route.spec.ts
git commit -m "feat(chatbot): add /api/chat route handler"
```

---

## Task 9: ChatBot widget component

**Files:**
- Create: `src/components/ChatBot/index.tsx`
- Create: `src/components/ChatBot/useCurrentPost.ts`
- Test: `src/components/ChatBot/index.spec.tsx`
- Test: `src/components/ChatBot/useCurrentPost.spec.ts`
- Modify: `src/messages/en.json`, `src/messages/pt-br.json`

**Interfaces:**
- Consumes: `useChat` from `@ai-sdk/react`, `usePathname` from `next/navigation`, `useTranslations` from `next-intl`.
- Produces:
  - `useCurrentPost(): { locale: string; slug: string | null }` — parses `usePathname()`; for `/{locale}/blog/{slug}` returns slug, otherwise `slug: null`; locale defaults to `'en'`.
  - `ChatBot` default export — floating button bottom-right that toggles a chat panel; wires `useChat` to `/api/chat`, sends `currentSlug`/`locale` in the request body, persists messages to `localStorage` under key `chatbot-history`.

**Notes — verify `@ai-sdk/react` `useChat` API before coding (it changed a lot):**
- `grep -rE "useChat|DefaultChatTransport|sendMessage|status" node_modules/@ai-sdk/react/dist/*.d.ts | head -40`
- Confirm how to (a) attach a transport pointing at `/api/chat`, (b) include extra body fields (`currentSlug`, `locale`), (c) read streaming `status` and `messages`, (d) send a message from an input. Adapt the code in Step 5 to the confirmed API.

- [ ] **Step 1: Write the failing test for `useCurrentPost`**

Create `src/components/ChatBot/useCurrentPost.spec.ts`:
```ts
import { renderHook } from '@testing-library/react'

let mockPath = '/en'
jest.mock('next/navigation', () => ({
  usePathname: () => mockPath,
}))

import { useCurrentPost } from './useCurrentPost'

describe('useCurrentPost', () => {
  it('returns slug and locale on a blog post path', () => {
    mockPath = '/pt-br/blog/my-post'
    const { result } = renderHook(() => useCurrentPost())

    expect(result.current).toEqual({ locale: 'pt-br', slug: 'my-post' })
  })

  it('returns null slug off blog post pages', () => {
    mockPath = '/en/career'
    const { result } = renderHook(() => useCurrentPost())

    expect(result.current.slug).toBeNull()
    expect(result.current.locale).toBe('en')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npm test -- src/components/ChatBot/useCurrentPost.spec.ts`
Expected: FAIL — cannot find module `./useCurrentPost`.

- [ ] **Step 3: Implement `useCurrentPost`**

Create `src/components/ChatBot/useCurrentPost.ts`:
```ts
'use client'

import { usePathname } from 'next/navigation'

export function useCurrentPost(): { locale: string; slug: string | null } {
  const pathname = usePathname() || '/'
  const segments = pathname.split('/').filter(Boolean)
  const locale = segments[0] === 'pt-br' ? 'pt-br' : 'en'
  const slug =
    segments[1] === 'blog' && segments[2] ? decodeURIComponent(segments[2]) : null

  return { locale, slug }
}
```

- [ ] **Step 4: Run test, verify it passes**

Run: `npm test -- src/components/ChatBot/useCurrentPost.spec.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Add i18n strings**

In `src/messages/en.json`, add a top-level `ChatBot` object:
```json
"ChatBot": {
  "open": "Open chat",
  "close": "Close chat",
  "title": "Ask about the blog",
  "placeholder": "Ask anything…",
  "send": "Send",
  "empty": "Hi! Ask me anything about this blog or the post you're reading."
}
```
In `src/messages/pt-br.json`, add:
```json
"ChatBot": {
  "open": "Abrir chat",
  "close": "Fechar chat",
  "title": "Pergunte sobre o blog",
  "placeholder": "Pergunte qualquer coisa…",
  "send": "Enviar",
  "empty": "Oi! Pergunte qualquer coisa sobre o blog ou sobre o post que você está lendo."
}
```

- [ ] **Step 6: Write the failing test for `ChatBot`**

Create `src/components/ChatBot/index.spec.tsx`:
```tsx
import { fireEvent, render, screen } from '@testing-library/react'

const sendMessageMock = jest.fn()
jest.mock('@ai-sdk/react', () => ({
  useChat: () => ({
    messages: [],
    sendMessage: sendMessageMock,
    status: 'ready',
  }),
}))
jest.mock('next/navigation', () => ({ usePathname: () => '/en/blog/post' }))
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

import ChatBot from '.'

describe('<ChatBot />', () => {
  beforeEach(() => sendMessageMock.mockClear())

  it('is collapsed initially and opens the panel on click', () => {
    render(<ChatBot />)

    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'open' }))

    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('sends a message on submit', () => {
    render(<ChatBot />)
    fireEvent.click(screen.getByRole('button', { name: 'open' }))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.submit(input.closest('form')!)

    expect(sendMessageMock).toHaveBeenCalled()
  })
})
```

- [ ] **Step 7: Run test, verify it fails**

Run: `npm test -- src/components/ChatBot/index.spec.tsx`
Expected: FAIL — cannot find module `.` (no `index.tsx`).

- [ ] **Step 8: Implement `ChatBot`**

Create `src/components/ChatBot/index.tsx` (adapt `useChat` usage to the API confirmed in the Notes step):
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

import { useChat } from '@ai-sdk/react'
import { useTranslations } from 'next-intl'
import { FaComments, FaTimes } from 'react-icons/fa'

import { useCurrentPost } from './useCurrentPost'

const STORAGE_KEY = 'chatbot-history'

const ChatBot = () => {
  const t = useTranslations('ChatBot')
  const { locale, slug } = useCurrentPost()
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')

  const { messages, sendMessage, status } = useChat({
    api: '/api/chat',
    body: { currentSlug: slug, locale },
  })

  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || status !== 'ready') return
    sendMessage({ text })
    setInput('')
  }

  if (!isOpen) {
    return (
      <button
        aria-label={t('open')}
        onClick={() => setIsOpen(true)}
        className='fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-black text-white shadow-lg hover:opacity-90'
      >
        <FaComments size={22} />
      </button>
    )
  }

  return (
    <div className='fixed bottom-6 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col rounded-xl border border-gray-600 bg-green-black text-white shadow-2xl'>
      <header className='flex items-center justify-between border-b border-gray-600 p-3'>
        <span className='font-semibold'>{t('title')}</span>
        <button aria-label={t('close')} onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>
      </header>

      <div ref={listRef} className='flex-1 space-y-3 overflow-y-auto p-3 text-sm'>
        {messages.length === 0 && <p className='text-gray-400'>{t('empty')}</p>}
        {messages.map(message => (
          <div
            key={message.id}
            className={message.role === 'user' ? 'text-right' : 'text-left'}
          >
            <span className='inline-block rounded-lg bg-black/30 px-3 py-2'>
              {message.parts
                .filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('')}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className='flex gap-2 border-t border-gray-600 p-3'>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className='flex-1 rounded-md bg-black/30 px-3 py-2 text-sm outline-none'
        />
        <button
          type='submit'
          className='rounded-md bg-secondary px-3 py-2 text-sm text-white hover:bg-primary'
        >
          {t('send')}
        </button>
      </form>
    </div>
  )
}

export default ChatBot
```

- [ ] **Step 9: Run test, verify it passes**

Run: `npm test -- src/components/ChatBot/index.spec.tsx`
Expected: PASS (2 tests). If `useChat` options differ from `{ api, body }` per the Notes step, update both the component and the mock accordingly so behaviour (sends message, sends body fields) holds.

- [ ] **Step 10: Typecheck and commit**

Run: `npx tsc --noEmit`
Expected: no errors.
```bash
git add src/components/ChatBot src/messages/en.json src/messages/pt-br.json
git commit -m "feat(chatbot): add ChatBot widget component"
```

---

## Task 10: Mount widget globally + end-to-end verification

**Files:**
- Modify: `src/app/[locale]/layout.tsx`
- Test: `src/app/[locale]/__tests__/layout.spec.tsx` (existing — extend)

**Interfaces:**
- Consumes: `ChatBot` default export (Task 9).

- [ ] **Step 1: Extend the layout test to assert ChatBot is rendered**

Open `src/app/[locale]/__tests__/layout.spec.tsx`. Add a mock and assertion that the `ChatBot` is part of the tree. Add near the other mocks:
```tsx
jest.mock('@/components/ChatBot', () => ({
  __esModule: true,
  default: () => <div data-testid='chatbot' />,
}))
```
And inside the rendered-layout assertions add:
```tsx
expect(screen.getByTestId('chatbot')).toBeInTheDocument()
```
(Match the existing render/setup style already in that spec file.)

- [ ] **Step 2: Run the layout test, verify it fails**

Run: `npm test -- src/app/[locale]/__tests__/layout.spec.tsx`
Expected: FAIL — `chatbot` testid not found.

- [ ] **Step 3: Mount ChatBot in the layout**

In `src/app/[locale]/layout.tsx`, add the import and render it inside `<body>` after `<Footer />`:
```tsx
import ChatBot from '@/components/ChatBot'
```
```tsx
        </NextIntlClientProvider>
        <ChatBot />
      </body>
```
(Place `<ChatBot />` as a sibling after the provider's closing tag is not valid because it uses `useTranslations`; instead render it INSIDE `<NextIntlClientProvider>`, after `<Footer />`.)

Correct placement — inside the provider:
```tsx
            <Footer />
            <ChatBot />
          </FilterProvider>
```

- [ ] **Step 4: Run the layout test, verify it passes**

Run: `npm test -- src/app/[locale]/__tests__/layout.spec.tsx`
Expected: PASS.

- [ ] **Step 5: Full test suite + lint + typecheck**

Run: `npm test`
Expected: all suites pass.
Run: `npm run lint`
Expected: no errors.
Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Manual smoke test (requires real Upstash + Groq env)**

Set the five env vars in `.env`. Then:
```bash
npm run prebuild   # indexes posts into Upstash Vector
npm run dev
```
Verify in browser:
1. Floating button appears bottom-right on every page.
2. Open panel on a blog post (`/pt-br/blog/<slug>`), ask "do que fala esse post?" → answer reflects the current post.
3. Ask "qual post fala de lazy loading?" → answer references the relevant post (RAG).
4. Reload page → previous messages restored from localStorage.
5. Fire >10 messages within 60s → `429` handled gracefully (no crash).

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/layout.tsx src/app/[locale]/__tests__/layout.spec.tsx
git commit -m "feat(chatbot): mount ChatBot globally in layout"
```

---

## Post-implementation: deployment notes

- Provision **Upstash Vector** (with a hosted embedding model, e.g. `bge`/`mxbai`) and **Upstash Redis** via the Vercel Marketplace; set the index's embedding model at creation so `data`-based upsert/query works.
- Add all five env vars in the Vercel project (Production + Preview).
- Ensure `GROQ_API_KEY` is a free-tier Groq key.
- `prebuild` runs indexing on every deploy; it no-ops safely if env is missing.
- Consider restricting indexing to production builds if preview deploys should not write to the shared index.

## Self-review notes

- Spec coverage: vector store (T4/T5), hosted embeddings (T5 upsert by `data`), Groq chat (T8), build-time indexing (T5), localStorage history (T9), per-IP rate limit (T6), current-article context (T8 + T9 pathname wiring), RAG retrieval (T4/T8), i18n (T9), Node runtime (T8). All covered.
- Current-article wiring uses `usePathname` in the widget (T9) instead of threading props through the server post page — simpler, no change to `page.jsx`. This refines the spec's "page passes currentSlug" without changing behaviour.
- AI SDK / Upstash / Groq exact signatures are verified in-task (explicit grep/curl steps) because those APIs drift; code shown is the target shape to adapt.
