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
  const vercelEnv = process.env.VERCEL_ENV
  if (vercelEnv && vercelEnv !== 'production') {
    console.log(
      `[index-blog] Skipping indexing on non-production Vercel env (VERCEL_ENV=${vercelEnv}).`,
    )
    process.exit(0)
  }

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
