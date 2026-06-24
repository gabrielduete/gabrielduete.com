function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

export function getAiEnv() {
  return {
    groqApiKey: required('GROQ_API_KEY'),
    vectorUrl: required('UPSTASH_VECTOR_REST_URL'),
    vectorToken: required('UPSTASH_VECTOR_REST_TOKEN'),
    redisUrl: required('UPSTASH_REDIS_REST_URL'),
    redisToken: required('UPSTASH_REDIS_REST_TOKEN'),
  }
}
