import { getAiEnv } from './env'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let limiter: Ratelimit | null = null

function getLimiter(): Ratelimit {
  if (limiter) return limiter
  const env = getAiEnv()
  const redis = new Redis({ url: env.redisUrl, token: env.redisToken })
  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    prefix: 'chatbot',
  })
  return limiter
}

export async function checkRateLimit(ip: string): Promise<{ success: boolean }> {
  const { success } = await getLimiter().limit(ip)
  return { success }
}
