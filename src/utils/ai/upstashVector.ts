import { getAiEnv } from './env'
import { Index, type QueryResult } from '@upstash/vector'

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

  return (results ?? []).map((r: QueryResult<Record<string, unknown>>) => ({
    text: String(r.metadata?.text ?? ''),
    slug: String(r.metadata?.slug ?? ''),
    title: String(r.metadata?.title ?? ''),
    url: String(r.metadata?.url ?? ''),
    score: Number(r.score ?? 0),
  }))
}
