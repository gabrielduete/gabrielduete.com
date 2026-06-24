import { buildSystemPrompt } from './buildPrompt'

const chunks = [
  { text: 'lazy loading explained', slug: 'lazy', title: 'Lazy', url: '/en/blog/lazy', score: 0.8 },
]

describe('buildSystemPrompt', () => {
  it('includes the current article title and content when provided', () => {
    const prompt = buildSystemPrompt({
      locale: 'pt-br',
      currentArticle: { title: 'Meu Post', content: 'conteudo do post' },
      chunks: [],
    })

    expect(prompt).toContain('Meu Post')
    expect(prompt).toContain('conteudo do post')
    expect(prompt).toContain('pt-br')
  })

  it('includes retrieved chunks with their urls', () => {
    const prompt = buildSystemPrompt({ locale: 'en', currentArticle: null, chunks })

    expect(prompt).toContain('lazy loading explained')
    expect(prompt).toContain('/en/blog/lazy')
  })

  it('truncates very long article content', () => {
    const long = 'x'.repeat(10000)
    const prompt = buildSystemPrompt({
      locale: 'en',
      currentArticle: { title: 'T', content: long },
      chunks: [],
    })

    expect(prompt).not.toContain('x'.repeat(7000))
  })
})
