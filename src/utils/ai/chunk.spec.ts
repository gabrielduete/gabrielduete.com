import { chunkMarkdown } from './chunk'

describe('chunkMarkdown', () => {
  it('splits content into one chunk per heading section', () => {
    const md = `# Intro\nHello world.\n\n## Details\nMore text here.`
    const chunks = chunkMarkdown(md)

    expect(chunks).toHaveLength(2)
    expect(chunks[0]).toContain('# Intro')
    expect(chunks[0]).toContain('Hello world.')
    expect(chunks[1]).toContain('## Details')
  })

  it('drops empty/whitespace-only sections', () => {
    const md = `# A\n\n\n## B\ntext`
    const chunks = chunkMarkdown(md)

    expect(chunks.every(c => c.trim().length > 0)).toBe(true)
  })

  it('splits a section longer than maxChars into multiple chunks', () => {
    const long = 'word '.repeat(500) // 2500 chars
    const md = `# Big\n${long}`
    const chunks = chunkMarkdown(md, 1000)

    expect(chunks.length).toBeGreaterThan(1)
    chunks.forEach(c => expect(c.length).toBeLessThanOrEqual(1000 + 50))
  })

  it('hard-splits a single token longer than maxChars', () => {
    const md = `# T\n${'a'.repeat(2500)}`
    const chunks = chunkMarkdown(md, 1000)
    chunks.forEach(c => expect(c.length).toBeLessThanOrEqual(1000))
  })

  it('groups short paragraphs until the next one would overflow', () => {
    const md = ['a'.repeat(60), 'b'.repeat(60), 'c'.repeat(60)].join('\n\n')
    const chunks = chunkMarkdown(md, 100)

    expect(chunks).toEqual(['a'.repeat(60), 'b'.repeat(60), 'c'.repeat(60)])
  })

  it('keeps paragraphs together while they still fit', () => {
    const md = ['a'.repeat(20), 'b'.repeat(20), 'c'.repeat(60)].join('\n\n')
    const chunks = chunkMarkdown(md, 100)

    expect(chunks).toEqual([
      `${'a'.repeat(20)}\n\n${'b'.repeat(20)}`,
      'c'.repeat(60),
    ])
  })

  it('falls back to the whole content when there is no heading', () => {
    expect(chunkMarkdown('plain text without headings')).toEqual([
      'plain text without headings',
    ])
  })

  it('returns nothing for empty content', () => {
    expect(chunkMarkdown('   ')).toEqual([])
  })
})
