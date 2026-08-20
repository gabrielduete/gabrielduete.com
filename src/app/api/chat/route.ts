import {
  getBlogData,
  isValidSlug,
} from '@/app/[locale]/blog/helpers/getDataContentFile'
import { Locales } from '@/enums/Locales'
import { buildSystemPrompt } from '@/utils/ai/buildPrompt'
import { checkRateLimit } from '@/utils/ai/ratelimit'
import { queryRelevantChunks } from '@/utils/ai/upstashVector'
import { groq } from '@ai-sdk/groq'
import { convertToModelMessages, streamText, type UIMessage, type TextUIPart } from 'ai'

export const runtime = 'nodejs'

const MODEL = 'openai/gpt-oss-120b'

function resolveLocale(value: unknown): string {
  return value === Locales.PT_BR ? Locales.PT_BR : Locales.EN
}

function latestUserText(messages: UIMessage[]): string {
  const last = [...messages].reverse().find(m => m.role === 'user')
  if (!last) return ''
  return (last.parts ?? [])
    .filter((p): p is TextUIPart => p.type === 'text')
    .map(p => p.text)
    .join(' ')
}

export async function POST(req: Request) {
  try {
    // Trust the rightmost entry: it is appended by the proxy closest to us,
    // while any client-supplied value stays on the left.
    const forwardedFor = req.headers.get('x-forwarded-for')?.split(',') ?? []
    const ip = forwardedFor[forwardedFor.length - 1]?.trim() || 'anonymous'

    const { success } = await checkRateLimit(ip)
    if (!success) {
      return new Response('Too many requests', { status: 429 })
    }

    let body: Record<string, unknown>
    try {
      body = await req.json()
    } catch {
      return new Response('Bad request', { status: 400 })
    }

    const messages: UIMessage[] = Array.isArray(body.messages) ? (body.messages as UIMessage[]) : []
    const locale = resolveLocale(body.locale)
    const currentSlug = isValidSlug(body.currentSlug) ? body.currentSlug : undefined

    let currentArticle: { title: string; content: string } | null = null
    if (currentSlug) {
      try {
        const { content, data } = getBlogData(currentSlug, locale as Locales)
        currentArticle = {
          title: typeof data.title === 'string' ? data.title : currentSlug,
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
  } catch (err) {
    console.error('[POST /api/chat] Unhandled error:', err)
    return new Response('Internal error', { status: 500 })
  }
}
