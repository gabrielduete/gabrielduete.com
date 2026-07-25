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
