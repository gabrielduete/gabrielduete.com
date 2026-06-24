/**
 * @jest-environment node
 */

jest.mock('@/utils/ai/ratelimit', () => ({
  checkRateLimit: jest.fn(),
}))
jest.mock('@/utils/ai/upstashVector', () => ({
  queryRelevantChunks: jest.fn().mockResolvedValue([]),
}))
jest.mock('@/app/[locale]/blog/helpers/getDataContentFile', () => ({
  getBlogData: jest.fn(() => ({ content: 'post body', data: { title: 'Post' } })),
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const streamTextMock = jest.fn((_args: any) => ({
  toUIMessageStreamResponse: () => new Response('ok', { status: 200 }),
}))
jest.mock('ai', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  streamText: (args: any) => streamTextMock(args),
  convertToModelMessages: (m: any) => Promise.resolve(m),
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
