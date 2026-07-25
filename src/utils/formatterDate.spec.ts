import { formatDate, parseArticleDate } from './formatterDate'

describe('parseArticleDate', () => {
  it('parses ISO dates regardless of the locale', () => {
    const parsed = parseArticleDate('2025-03-14', 'en')

    expect(parsed.getFullYear()).toBe(2025)
    expect(parsed.getMonth()).toBe(2)
    expect(parsed.getDate()).toBe(14)
  })

  it('parses EN dates as month first', () => {
    const parsed = parseArticleDate('03-14-2025', 'en')

    expect(parsed.getMonth()).toBe(2)
    expect(parsed.getDate()).toBe(14)
  })

  it('parses PT-BR dates as day first', () => {
    const parsed = parseArticleDate('14-03-2025', 'pt-br')

    expect(parsed.getMonth()).toBe(2)
    expect(parsed.getDate()).toBe(14)
  })

  it('keeps the date at local midnight', () => {
    const parsed = parseArticleDate('2025-01-01', 'pt-br')

    expect(parsed.getHours()).toBe(0)
    expect(parsed.getMinutes()).toBe(0)
  })
})

describe('formatDate', () => {
  it('formats EN dates with the en-US shape', () => {
    expect(formatDate('2025-03-14', 'en')).toBe('Mar 14, 2025')
  })

  it('formats PT-BR dates with the pt-BR shape', () => {
    expect(formatDate('14-03-2025', 'pt-br')).toMatch(/14 de mar/)
  })

  it('uses the same shape for both date notations of a locale', () => {
    expect(formatDate('03-14-2025', 'en')).toBe(formatDate('2025-03-14', 'en'))
  })
})
