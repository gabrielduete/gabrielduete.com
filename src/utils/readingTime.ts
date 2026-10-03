const WORDS_PER_MINUTE = 200

export const getReadingTime = (content: string): number => {
  const words = content.trim().split(/\s+/).filter(Boolean).length

  if (words === 0) {
    return 1
  }

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export default getReadingTime
