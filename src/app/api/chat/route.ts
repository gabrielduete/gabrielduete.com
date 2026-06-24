import { getBlogData } from '@/app/[locale]/blog/helpers/getDataContentFile'
import { Locales } from '@/enums/Locales'
import { buildSystemPrompt } from '@/utils/ai/buildPrompt'
import { checkRateLimit } from '@/utils/ai/ratelimit'
import { queryRelevantChunks } from '@/utils/ai/upstashVector'
import { groq } from '@ai-sdk/groq'
import { convertToModelMessages, streamText, type UIMessage } from 'ai'

export const runtime = 'nodejs'

const MODEL = 'llama-3.3-70b-versatile'

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
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
