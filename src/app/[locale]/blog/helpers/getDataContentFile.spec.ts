/**
 * @jest-environment node
 */

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}))

import { Locales } from '@/enums/Locales'
import fs from 'fs'
import { getBlogData } from './getDataContentFile'

describe('getBlogData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fs.readFileSync as jest.Mock).mockReturnValue(
      '---\ntitle: Post\n---\n\nbody',
    )
  })

  it('reads the mdx file for the given slug and locale', () => {
    const { content, data } = getBlogData('my-post', Locales.EN)

    expect(data.title).toBe('Post')
    expect(content.trim()).toBe('body')
    expect(fs.readFileSync).toHaveBeenCalledWith(
      expect.stringContaining(`src/content/blog/en/my-post.mdx`),
      'utf-8',
    )
  })

  it.each([
    ['parent traversal', '../../../etc/hosts'],
    ['nested path', 'sub/dir/post'],
    ['backslash path', '..\\..\\secret'],
    ['absolute path', '/etc/hosts'],
    ['empty slug', ''],
    ['dot segment', '.'],
  ])('throws on %s and never touches the filesystem', (_label, slug) => {
    expect(() => getBlogData(slug, Locales.EN)).toThrow(/invalid blog slug/i)
    expect(fs.readFileSync).not.toHaveBeenCalled()
  })
})
