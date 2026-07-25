import fs from 'fs'

import { listAllPosts } from './listPosts'

describe('listAllPosts', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

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

  it('skips locales whose content folder does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)
    const readdir = jest.spyOn(fs, 'readdirSync')

    expect(listAllPosts()).toEqual([])
    expect(readdir).not.toHaveBeenCalled()
  })

  it('ignores files that are not mdx', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest
      .spyOn(fs, 'readdirSync')
      .mockReturnValue(['notes.txt'] as unknown as ReturnType<
        typeof fs.readdirSync
      >)

    expect(listAllPosts()).toEqual([])
  })

  it('falls back to the slug when the post has no title', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest
      .spyOn(fs, 'readdirSync')
      .mockReturnValue(['untitled.mdx'] as unknown as ReturnType<
        typeof fs.readdirSync
      >)
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue('---\ntitle: 42\n---\nbody' as never)

    const posts = listAllPosts()

    expect(posts).toHaveLength(2)
    expect(posts[0]).toMatchObject({
      slug: 'untitled',
      title: 'untitled',
      locale: 'en',
      url: '/en/blog/untitled',
    })
  })
})
