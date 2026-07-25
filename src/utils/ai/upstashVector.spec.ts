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

import { Index } from '@upstash/vector'
import { getVectorIndex, queryRelevantChunks } from './upstashVector'

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

  it('defaults every missing metadata field', async () => {
    queryMock.mockResolvedValue([{ metadata: undefined }])

    const result = await queryRelevantChunks('hello', 'pt-br')

    expect(result).toEqual([
      { text: '', slug: '', title: '', url: '', score: 0 },
    ])
  })

  it('returns an empty list when the index answers with nothing', async () => {
    queryMock.mockResolvedValue(undefined)

    await expect(queryRelevantChunks('hello', 'en')).resolves.toEqual([])
  })

  it('uses a topK of 4 by default', async () => {
    queryMock.mockResolvedValue([])

    await queryRelevantChunks('hello', 'en')

    expect(queryMock.mock.calls[0][0].topK).toBe(4)
  })

  it('builds the index only once', () => {
    const callsBefore = (Index as unknown as jest.Mock).mock.calls.length

    getVectorIndex()
    getVectorIndex()

    expect((Index as unknown as jest.Mock).mock.calls.length).toBe(callsBefore)
  })
})
