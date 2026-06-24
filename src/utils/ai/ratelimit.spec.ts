const limitMock = jest.fn()

jest.mock('@upstash/ratelimit', () => {
  const Ratelimit: any = jest
    .fn()
    .mockImplementation(() => ({ limit: limitMock }))
  Ratelimit.slidingWindow = jest.fn(() => 'sliding-window')
  return { Ratelimit }
})

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({})),
}))

jest.mock('./env', () => ({
  getAiEnv: () => ({
    redisUrl: 'ru',
    redisToken: 'rt',
    groqApiKey: 'g',
    vectorUrl: 'vu',
    vectorToken: 'vt',
  }),
}))

import { checkRateLimit } from './ratelimit'

describe('checkRateLimit', () => {
  it('returns success from the limiter keyed by ip', async () => {
    limitMock.mockResolvedValue({ success: true })

    const result = await checkRateLimit('1.2.3.4')

    expect(limitMock).toHaveBeenCalledWith('1.2.3.4')
    expect(result.success).toBe(true)
  })
})
