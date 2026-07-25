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
  ...jest.requireActual('@/app/[locale]/blog/helpers/getDataContentFile'),
  getBlogData: jest.fn(() => ({ content: 'post body', data: { title: 'Post' } })),
}))

type StreamMockReturn = { toUIMessageStreamResponse: () => Response }
const streamTextMock = jest.fn<StreamMockReturn, [Record<string, unknown>]>(() => ({
  toUIMessageStreamResponse: () => new Response('ok', { status: 200 }),
}))
jest.mock('ai', () => ({
  streamText: (args: Record<string, unknown>) => streamTextMock(args),
  convertToModelMessages: (m: unknown) => Promise.resolve(m),
}))
jest.mock('@ai-sdk/groq', () => ({ groq: () => 'model' }))

import { getBlogData } from '@/app/[locale]/blog/helpers/getDataContentFile'
import { checkRateLimit } from '@/utils/ai/ratelimit'
import { queryRelevantChunks } from '@/utils/ai/upstashVector'
import { POST } from './route'

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '9.9.9.9' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    streamTextMock.mockClear()
    ;(checkRateLimit as jest.Mock).mockResolvedValue({ success: true })
    ;(queryRelevantChunks as jest.Mock).mockResolvedValue([])
    ;(getBlogData as jest.Mock).mockReturnValue({
      content: 'post body',
      data: { title: 'Post' },
    })
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

  it('returns 400 on malformed JSON body', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '9.9.9.9' },
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(streamTextMock).not.toHaveBeenCalled()
  })

  it('treats non-array messages as empty array', async () => {
    const res = await POST(
      makeRequest({
        messages: 'not an array',
        locale: 'en',
      }),
    )

    expect(res.status).toBe(200)
    expect(streamTextMock).toHaveBeenCalledTimes(1)
  })

  it('answers without article context when the current post cannot be read', async () => {
    ;(getBlogData as jest.Mock).mockImplementation(() => {
      throw new Error('not found')
    })

    const res = await POST(
      makeRequest({
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'hi' }] }],
        currentSlug: 'gone',
        locale: 'en',
      }),
    )

    expect(res.status).toBe(200)
    expect(streamTextMock).toHaveBeenCalledTimes(1)
  })

  it('falls back to the slug when the post has no title', async () => {
    ;(getBlogData as jest.Mock).mockReturnValue({
      content: 'post body',
      data: {},
    })

    const res = await POST(
      makeRequest({
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'hi' }] }],
        currentSlug: 'untitled',
        locale: 'pt-br',
      }),
    )

    expect(res.status).toBe(200)
    expect(streamTextMock.mock.calls[0][0].system).toContain('untitled')
  })

  it('skips the vector search when there is no user message', async () => {
    const res = await POST(
      makeRequest({
        messages: [{ role: 'assistant', parts: [{ type: 'text', text: 'hi' }] }],
        locale: 'en',
      }),
    )

    expect(res.status).toBe(200)
    expect(queryRelevantChunks).not.toHaveBeenCalled()
  })

  it('searches the vector index with the latest user message only', async () => {
    await POST(
      makeRequest({
        messages: [
          { role: 'user', parts: [{ type: 'text', text: 'first' }] },
          { role: 'assistant', parts: [{ type: 'text', text: 'answer' }] },
          {
            role: 'user',
            parts: [
              { type: 'text', text: 'second' },
              { type: 'step-start' },
              { type: 'text', text: 'question' },
            ],
          },
        ],
        locale: 'en',
      }),
    )

    expect(queryRelevantChunks).toHaveBeenCalledWith('second question', 'en')
  })

  it('treats a user message without parts as empty', async () => {
    const res = await POST(
      makeRequest({
        messages: [{ role: 'user' }],
        locale: 'en',
      }),
    )

    expect(res.status).toBe(200)
    expect(queryRelevantChunks).not.toHaveBeenCalled()
  })

  it('ignores an unknown locale and falls back to en', async () => {
    await POST(
      makeRequest({
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'hi' }] }],
        locale: 'fr',
      }),
    )

    expect(queryRelevantChunks).toHaveBeenCalledWith('hi', 'en')
  })

  it('ignores a non-string currentSlug', async () => {
    await POST(
      makeRequest({
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'hi' }] }],
        currentSlug: 42,
        locale: 'en',
      }),
    )

    expect(getBlogData).not.toHaveBeenCalled()
  })

  it.each([
    ['parent traversal', '../../../etc/hosts'],
    ['nested path', 'sub/dir/post'],
    ['backslash path', '..\\..\\secret'],
    ['absolute path', '/etc/hosts'],
    ['empty slug', ''],
  ])('never reads the filesystem for a %s slug', async (_label, slug) => {
    const res = await POST(
      makeRequest({
        messages: [{ role: 'user', parts: [{ type: 'text', text: 'hi' }] }],
        currentSlug: slug,
        locale: 'en',
      }),
    )

    expect(res.status).toBe(200)
    expect(getBlogData).not.toHaveBeenCalled()
  })

  it('rate limits by the proxy-appended ip, not the client-supplied one', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '1.2.3.4, 203.0.113.7',
      },
      body: JSON.stringify({ messages: [], locale: 'en' }),
    })

    await POST(req)

    expect(checkRateLimit).toHaveBeenCalledWith('203.0.113.7')
  })

  it('rate limits by "anonymous" when the request has no forwarded ip', async () => {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: [], locale: 'en' }),
    })

    await POST(req)

    expect(checkRateLimit).toHaveBeenCalledWith('anonymous')
  })

  it('returns 500 and does not call streamText when checkRateLimit throws', async () => {
    ;(checkRateLimit as jest.Mock).mockRejectedValue(new Error('no env'))

    const res = await POST(makeRequest({ messages: [], locale: 'en' }))

    expect(res.status).toBe(500)
    expect(streamTextMock).not.toHaveBeenCalled()
  })
})
