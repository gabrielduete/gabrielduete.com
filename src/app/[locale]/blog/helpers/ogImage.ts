const DESCRIPTION_MAX_LENGTH = 140

export function getTitleFontSize(title: string) {
  if (title.length <= 32) return 76
  if (title.length <= 60) return 64
  return 52
}

export function truncateDescription(
  description: unknown,
  maxLength = DESCRIPTION_MAX_LENGTH,
) {
  if (typeof description !== 'string') return ''

  const text = description.replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text

  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:!?-]+$/, '')}…`
}

export function formatOgDate(date: unknown) {
  return typeof date === 'string' ? date.replace(/-/g, '/') : ''
}
