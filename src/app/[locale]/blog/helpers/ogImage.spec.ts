import { formatOgDate, getTitleFontSize, truncateDescription } from './ogImage'

describe('ogImage helpers', () => {
  describe('getTitleFontSize', () => {
    it('uses the largest size for short titles', () => {
      expect(getTitleFontSize('About Me')).toBe(76)
    })

    it('shrinks for medium titles', () => {
      expect(
        getTitleFontSize('Do heatmap do Clarity pra um botão de copiar'),
      ).toBe(64)
    })

    it('shrinks further for long titles', () => {
      expect(getTitleFontSize('a'.repeat(61))).toBe(52)
    })
  })

  describe('truncateDescription', () => {
    it('returns empty string for non-string input', () => {
      expect(truncateDescription(undefined)).toBe('')
    })

    it('collapses whitespace and keeps short text intact', () => {
      expect(truncateDescription('  Um   texto\ncurto. ')).toBe(
        'Um texto curto.',
      )
    })

    it('cuts on a word boundary and appends an ellipsis', () => {
      expect(truncateDescription('one two three four', 12)).toBe('one two…')
    })

    it('drops trailing punctuation before the ellipsis', () => {
      expect(truncateDescription('one two, three', 9)).toBe('one two…')
    })
  })

  describe('formatOgDate', () => {
    it('replaces dashes with slashes', () => {
      expect(formatOgDate('02-10-2026')).toBe('02/10/2026')
    })

    it('returns empty string for missing date', () => {
      expect(formatOgDate(undefined)).toBe('')
    })
  })
})
