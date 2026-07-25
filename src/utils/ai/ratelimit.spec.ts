const limitMock = jest.fn()

jest.mock('@upstash/ratelimit', () => {
  const Ratelimit = jest
    .fn()
    .mockImplementation(() => ({ limit: limitMock })) as jest.Mock & { slidingWindow: jest.Mock }
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

import { Ratelimit } from '@upstash/ratelimit'
import { checkRateLimit } from './ratelimit'

describe('checkRateLimit', () => {
  it('returns success from the limiter keyed by ip', async () => {
    limitMock.mockResolvedValue({ success: true })

    const result = await checkRateLimit('1.2.3.4')

    expect(limitMock).toHaveBeenCalledWith('1.2.3.4')
    expect(result.success).toBe(true)
  })

  it('reports a blocked ip', async () => {
    limitMock.mockResolvedValue({ success: false })

    await expect(checkRateLimit('5.6.7.8')).resolves.toEqual({ success: false })
  })

  it('builds the limiter only once', async () => {
    limitMock.mockResolvedValue({ success: true })
    const callsBefore = (Ratelimit as unknown as jest.Mock).mock.calls.length

    await checkRateLimit('1.2.3.4')
    await checkRateLimit('1.2.3.4')

    expect((Ratelimit as unknown as jest.Mock).mock.calls.length).toBe(
      callsBefore,
    )
  })
})
