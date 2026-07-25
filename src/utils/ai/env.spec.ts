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

  it('reads Redis creds from the KV_* names injected by the Vercel integration', () => {
    process.env.GROQ_API_KEY = 'g'
    process.env.UPSTASH_VECTOR_REST_URL = 'vu'
    process.env.UPSTASH_VECTOR_REST_TOKEN = 'vt'
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
    process.env.KV_REST_API_URL = 'kvu'
    process.env.KV_REST_API_TOKEN = 'kvt'

    expect(getAiEnv()).toEqual({
      groqApiKey: 'g',
      vectorUrl: 'vu',
      vectorToken: 'vt',
      redisUrl: 'kvu',
      redisToken: 'kvt',
    })
  })

  it('throws when a required var is missing', () => {
    delete process.env.GROQ_API_KEY
    expect(() => getAiEnv()).toThrow('GROQ_API_KEY')
  })

  it('throws naming every accepted name when no Redis url is set', () => {
    process.env.GROQ_API_KEY = 'g'
    process.env.UPSTASH_VECTOR_REST_URL = 'vu'
    process.env.UPSTASH_VECTOR_REST_TOKEN = 'vt'
    delete process.env.KV_REST_API_URL
    delete process.env.UPSTASH_REDIS_REST_URL

    expect(() => getAiEnv()).toThrow(
      'Missing required env var: one of KV_REST_API_URL, UPSTASH_REDIS_REST_URL',
    )
  })
})
