import { buildVectorRecords } from './index-blog'

describe('buildVectorRecords', () => {
  it('produces one record per chunk with deterministic ids and metadata', () => {
    const posts = [
      {
        slug: 'my-post',
        locale: 'en',
        title: 'My Post',
        url: '/en/blog/my-post',
        content: `# A\nfirst.\n\n## B\nsecond.`,
      },
    ]

    const records = buildVectorRecords(posts as any)

    expect(records.length).toBe(2)
    expect(records[0].id).toBe('en:my-post:0')
    expect(records[1].id).toBe('en:my-post:1')
    expect(records[0].metadata).toMatchObject({
      slug: 'my-post',
      locale: 'en',
      title: 'My Post',
      url: '/en/blog/my-post',
      chunkIndex: 0,
    })
    expect(typeof records[0].data).toBe('string')
    expect(records[0].metadata.text).toContain('# A')
  })
})
