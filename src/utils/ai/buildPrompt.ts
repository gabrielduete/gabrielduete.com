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
