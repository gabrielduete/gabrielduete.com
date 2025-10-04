import { Locales } from '@/enums/Locales'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

import { getBlogData } from './getDataContentFile'

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}))

jest.mock('gray-matter', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('path', () => ({
  join: jest.fn(),
}))

describe('getBlogData', () => {
  const mockReadFileSync = fs.readFileSync as jest.Mock
  const mockMatter = matter as unknown as jest.Mock
  const mockPathJoin = path.join as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should read file with correct path for English locale', () => {
    const slug = 'test-post'
    const locale = Locales.EN
    const expectedPath = '/project/src/content/blog/en/test-post.mdx'
    const fileContent = '---\ntitle: Test Post\n---\n# Content'

    mockPathJoin.mockReturnValue(expectedPath)
    mockReadFileSync.mockReturnValue(fileContent)
    mockMatter.mockReturnValue({
      content: '# Content',
      data: { title: 'Test Post' },
    })

    const result = getBlogData(slug, locale)

    expect(mockPathJoin).toHaveBeenCalledWith(
      process.cwd(),
      'src/content/blog',
      locale,
      `${slug}.mdx`,
    )
    expect(mockReadFileSync).toHaveBeenCalledWith(expectedPath, 'utf-8')
    expect(mockMatter).toHaveBeenCalledWith(fileContent)
    expect(result).toEqual({
      content: '# Content',
      data: { title: 'Test Post' },
    })
  })

  it('should read file with correct path for Portuguese locale', () => {
    const slug = 'post-teste'
    const locale = Locales.PT_BR
    const expectedPath = '/project/src/content/blog/pt-br/post-teste.mdx'
    const fileContent = '---\ntitle: Post de Teste\n---\n# Conteúdo'

    mockPathJoin.mockReturnValue(expectedPath)
    mockReadFileSync.mockReturnValue(fileContent)
    mockMatter.mockReturnValue({
      content: '# Conteúdo',
      data: { title: 'Post de Teste' },
    })

    const result = getBlogData(slug, locale)

    expect(mockPathJoin).toHaveBeenCalledWith(
      process.cwd(),
      'src/content/blog',
      locale,
      `${slug}.mdx`,
    )
    expect(mockReadFileSync).toHaveBeenCalledWith(expectedPath, 'utf-8')
    expect(mockMatter).toHaveBeenCalledWith(fileContent)
    expect(result).toEqual({
      content: '# Conteúdo',
      data: { title: 'Post de Teste' },
    })
  })

  it('should handle different slug formats', () => {
    const slug = 'my-awesome-post-2024'
    const locale = Locales.EN
    const expectedPath = '/project/src/content/blog/en/my-awesome-post-2024.mdx'
    const fileContent = '---\ntitle: My Awesome Post\n---\n# Content'

    mockPathJoin.mockReturnValue(expectedPath)
    mockReadFileSync.mockReturnValue(fileContent)
    mockMatter.mockReturnValue({
      content: '# Content',
      data: { title: 'My Awesome Post' },
    })

    const result = getBlogData(slug, locale)

    expect(mockPathJoin).toHaveBeenCalledWith(
      process.cwd(),
      'src/content/blog',
      locale,
      `${slug}.mdx`,
    )
    expect(result).toEqual({
      content: '# Content',
      data: { title: 'My Awesome Post' },
    })
  })

  it('should handle empty frontmatter', () => {
    const slug = 'minimal-post'
    const locale = Locales.EN
    const expectedPath = '/project/src/content/blog/en/minimal-post.mdx'
    const fileContent = '# Just content without frontmatter'

    mockPathJoin.mockReturnValue(expectedPath)
    mockReadFileSync.mockReturnValue(fileContent)
    mockMatter.mockReturnValue({
      content: '# Just content without frontmatter',
      data: {},
    })

    const result = getBlogData(slug, locale)

    expect(result).toEqual({
      content: '# Just content without frontmatter',
      data: {},
    })
  })

  it('should handle complex frontmatter data', () => {
    const slug = 'complex-post'
    const locale = Locales.EN
    const expectedPath = '/project/src/content/blog/en/complex-post.mdx'
    const fileContent = `---
title: Complex Post
author: John Doe
date: 2024-01-01
tags: [react, nextjs, testing]
published: true
---\n# Complex Content`

    const complexData = {
      title: 'Complex Post',
      author: 'John Doe',
      date: '2024-01-01',
      tags: ['react', 'nextjs', 'testing'],
      published: true,
    }

    mockPathJoin.mockReturnValue(expectedPath)
    mockReadFileSync.mockReturnValue(fileContent)
    mockMatter.mockReturnValue({
      content: '# Complex Content',
      data: complexData,
    })

    const result = getBlogData(slug, locale)

    expect(result).toEqual({
      content: '# Complex Content',
      data: complexData,
    })
  })
})
