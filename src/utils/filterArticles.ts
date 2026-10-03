export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

export const matchesQuery = (article: IArticle, query: string): boolean => {
  const normalizedQuery = normalizeText(query)

  if (!normalizedQuery) {
    return true
  }

  const haystack = normalizeText(
    [article.title, article.description, ...(article.tags ?? [])].join(' '),
  )

  return normalizedQuery.split(/\s+/).every(term => haystack.includes(term))
}

export const matchesTags = (article: IArticle, tags: string[]): boolean => {
  if (!tags.length) {
    return true
  }

  return tags.some(tag => (article.tags ?? []).includes(tag))
}

export const getTagsByFrequency = (articles: IArticle[]): string[] => {
  const counters = new Map<string, number>()

  articles.forEach(article => {
    ;(article.tags ?? []).forEach(tag => {
      counters.set(tag, (counters.get(tag) ?? 0) + 1)
    })
  })

  return [...counters.entries()]
    .sort(([tagA, countA], [tagB, countB]) =>
      countB === countA ? tagA.localeCompare(tagB) : countB - countA,
    )
    .map(([tag]) => tag)
}
