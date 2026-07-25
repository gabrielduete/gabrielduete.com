function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

// Reads the first env var that is set among `names`. Throws naming all of them
// if none is present. Used for the Redis credentials, which the Vercel Upstash
// integration injects as KV_REST_API_* while local/manual setups may use the
// UPSTASH_REDIS_REST_* names.
function requiredOneOf(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name]
    if (value) return value
  }
  throw new Error(`Missing required env var: one of ${names.join(', ')}`)
}

export function getAiEnv() {
  return {
    groqApiKey: required('GROQ_API_KEY'),
    vectorUrl: required('UPSTASH_VECTOR_REST_URL'),
    vectorToken: required('UPSTASH_VECTOR_REST_TOKEN'),
    redisUrl: requiredOneOf('KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL'),
    redisToken: requiredOneOf('KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN'),
  }
}
