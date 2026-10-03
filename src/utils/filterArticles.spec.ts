import {
  getTagsByFrequency,
  matchesQuery,
  matchesTags,
  normalizeText,
} from './filterArticles'

const makeArticle = (article: Partial<IArticle> = {}): IArticle =>
  ({
    title: 'O que é gitflow?',
    description: 'Entendendo o fluxo de trabalho com git',
    date: '28-02-2023',
    category: 'Engenharia',
    tags: ['git', 'gitflow'],
    slug: 'gitflow',
    locale: 'pt-br',
    pinned: false,
    readingTime: 5,
    ...article,
  }) as IArticle

describe('normalizeText', () => {
  it('should strip accents, lowercase and trim', () => {
    expect(normalizeText('  Útil ENGENHARIA  ')).toBe('util engenharia')
  })
})

describe('matchesQuery', () => {
  it('should match every article when the query is empty', () => {
    expect(matchesQuery(makeArticle(), '   ')).toBe(true)
  })

  it('should match ignoring accents and case', () => {
    expect(matchesQuery(makeArticle(), 'GITFLOW')).toBe(true)
    expect(matchesQuery(makeArticle({ title: 'Útil' }), 'util')).toBe(true)
  })

  it('should match against the description and the tags', () => {
    expect(matchesQuery(makeArticle(), 'fluxo')).toBe(true)
    expect(matchesQuery(makeArticle({ tags: ['react'] }), 'react')).toBe(true)
  })

  it('should handle an article with no tags', () => {
    expect(matchesQuery(makeArticle({ tags: [] }), 'gitflow')).toBe(true)
    expect(matchesQuery(makeArticle({ tags: [] }), 'react')).toBe(false)
  })

  it('should require every term of a multi word query', () => {
    expect(matchesQuery(makeArticle(), 'gitflow fluxo')).toBe(true)
    expect(matchesQuery(makeArticle(), 'gitflow docker')).toBe(false)
  })

  it('should not match an unrelated query', () => {
    expect(matchesQuery(makeArticle(), 'kubernetes')).toBe(false)
  })
})

describe('matchesTags', () => {
  it('should match every article when no tag is selected', () => {
    expect(matchesTags(makeArticle(), [])).toBe(true)
  })

  it('should match when the article has any of the selected tags', () => {
    expect(matchesTags(makeArticle(), ['react', 'git'])).toBe(true)
  })

  it('should not match when the article has none of the selected tags', () => {
    expect(matchesTags(makeArticle(), ['react'])).toBe(false)
  })

  it('should not match an article with no tags', () => {
    expect(matchesTags(makeArticle({ tags: [] }), ['git'])).toBe(false)
  })
})

describe('getTagsByFrequency', () => {
  it('should order tags by frequency and then alphabetically', () => {
    const articles = [
      makeArticle({ tags: ['git', 'react'] }),
      makeArticle({ tags: ['react', 'css'] }),
      makeArticle({ tags: ['react'] }),
    ]

    expect(getTagsByFrequency(articles)).toEqual(['react', 'css', 'git'])
  })

  it('should return an empty list when there are no articles', () => {
    expect(getTagsByFrequency([])).toEqual([])
  })

  it('should skip articles without tags', () => {
    expect(getTagsByFrequency([makeArticle({ tags: [] })])).toEqual([])
  })
})
