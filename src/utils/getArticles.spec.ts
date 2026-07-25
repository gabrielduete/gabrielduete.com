import fs from 'fs'

import { getAllArticles, getPinnedArticles } from './getArticles'

jest.mock('fs')

const mockedFs = fs as jest.Mocked<typeof fs>

const fileWith = (frontmatter: string) => `---\n${frontmatter}\n---\nbody`

describe('getAllArticles', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('maps the frontmatter of every mdx file', () => {
    mockedFs.readdirSync.mockReturnValue([
      'post.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    mockedFs.readFileSync.mockReturnValue(
      fileWith(
        [
          'title: Post title',
          'description: Post description',
          "date: '2025-03-14'",
          'category: Performance',
          'tags: [perf]',
          'pinned: true',
        ].join('\n'),
      ),
    )

    expect(getAllArticles('en')).toEqual([
      {
        title: 'Post title',
        description: 'Post description',
        date: '2025-03-14',
        category: 'Performance',
        tags: ['perf'],
        slug: 'post',
        locale: 'en',
        pinned: true,
      },
    ])
  })

  it('falls back to empty values when the frontmatter is incomplete', () => {
    mockedFs.readdirSync.mockReturnValue([
      'empty.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    mockedFs.readFileSync.mockReturnValue(fileWith('unrelated: 1'))

    expect(getAllArticles('pt-br')).toEqual([
      {
        title: '',
        description: '',
        date: '',
        category: '',
        tags: [],
        slug: 'empty',
        locale: 'pt-br',
        pinned: false,
      },
    ])
  })

  it('ignores files that are not mdx', () => {
    mockedFs.readdirSync.mockReturnValue([
      'notes.txt',
      'image.png',
    ] as unknown as ReturnType<typeof fs.readdirSync>)

    expect(getAllArticles('en')).toEqual([])
    expect(mockedFs.readFileSync).not.toHaveBeenCalled()
  })
})

describe('getPinnedArticles', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns only the pinned articles', () => {
    mockedFs.readdirSync.mockReturnValue([
      'pinned.mdx',
      'regular.mdx',
    ] as unknown as ReturnType<typeof fs.readdirSync>)
    mockedFs.readFileSync
      .mockReturnValueOnce(fileWith('title: Pinned\npinned: true'))
      .mockReturnValueOnce(fileWith('title: Regular'))

    const pinned = getPinnedArticles('en')

    expect(pinned).toHaveLength(1)
    expect(pinned[0].title).toBe('Pinned')
  })
})
