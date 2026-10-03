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

// Fails open: if Redis is unreachable or misconfigured, let the request through
// instead of taking the whole chatbot down with it.
export async function checkRateLimit(ip: string): Promise<{ success: boolean }> {
  try {
    const { success } = await getLimiter().limit(ip)
    return { success }
  } catch (err) {
    console.error('[checkRateLimit] Rate limiter unavailable, allowing request:', err)
    return { success: true }
  }
}
