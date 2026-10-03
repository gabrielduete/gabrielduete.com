import { getReadingTime } from './readingTime'

describe('getReadingTime', () => {
  it('should return 1 minute for an empty content', () => {
    expect(getReadingTime('')).toBe(1)
    expect(getReadingTime('   \n  ')).toBe(1)
  })

  it('should return 1 minute for a short content', () => {
    expect(getReadingTime('one two three')).toBe(1)
  })

  it('should round the reading time up', () => {
    const content = Array.from({ length: 201 }, () => 'word').join(' ')

    expect(getReadingTime(content)).toBe(2)
  })

  it('should handle multiple whitespaces between words', () => {
    const content = Array.from({ length: 400 }, () => 'word').join('\n\n  ')

    expect(getReadingTime(content)).toBe(2)
  })
})
