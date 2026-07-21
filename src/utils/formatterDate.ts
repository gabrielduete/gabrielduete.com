import { Locales } from '@/enums/Locales'

/**
 * Frontmatter dates come in mixed shapes across posts/locales:
 *  - ISO:      YYYY-MM-DD
 *  - EN:       MM-DD-YYYY
 *  - PT-BR:    DD-MM-YYYY
 * This normalizes any of them into a local-midnight Date (no TZ shift).
 */
export const parseArticleDate = (date: string, locale: Langs): Date => {
  const parts = date.split('-').map(Number)

  if (String(date.split('-')[0]).length === 4) {
    const [year, month, day] = parts

    return new Date(year, month - 1, day)
  }

  const [first, second, year] = parts
  const isEN = locale === Locales.EN

  const month = isEN ? first : second
  const day = isEN ? second : first

  return new Date(year, month - 1, day)
}

/**
 * Single canonical, locale-aware display format for every card/date,
 * so the same locale never shows two different date shapes.
 */
export const formatDate = (date: string, locale: Langs): string => {
  const parsed = parseArticleDate(date, locale)
  const intlLocale = locale === Locales.EN ? 'en-US' : 'pt-BR'

  return new Intl.DateTimeFormat(intlLocale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}
