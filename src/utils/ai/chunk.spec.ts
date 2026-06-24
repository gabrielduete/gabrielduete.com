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
})
