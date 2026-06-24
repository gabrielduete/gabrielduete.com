import { listAllPosts } from './listPosts'

describe('listAllPosts', () => {
  it('returns entries for both locales with required fields', () => {
    const posts = listAllPosts()

    expect(posts.length).toBeGreaterThan(0)
    const sample = posts[0]
    expect(sample).toHaveProperty('slug')
    expect(sample).toHaveProperty('locale')
    expect(sample).toHaveProperty('title')
    expect(sample).toHaveProperty('content')
    expect(sample.url).toMatch(/^\/(en|pt-br)\/blog\//)
  })

  it('includes both en and pt-br posts', () => {
    const posts = listAllPosts()
    const locales = new Set(posts.map(p => p.locale))

    expect(locales.has('en')).toBe(true)
    expect(locales.has('pt-br')).toBe(true)
  })
})
