import { isSelect } from './isSelect'
import { removeLangPath } from './removeLangPath'

describe('isSelect', () => {
  it('should return true when pathname matches path', () => {
    const result = isSelect('/blog', 'blog')
    expect(result).toBe(true)
  })

  it('should return false when pathname does not match path', () => {
    const result = isSelect('/blog', 'career')
    expect(result).toBe(false)
  })

  it('should return true when pathname is empty and path is Hello', () => {
    const result = isSelect('', 'Hello')
    expect(result).toBe(true)
  })

  it('should return false for root path when path is Hello', () => {
    const result = isSelect('/', 'Hello')
    expect(result).toBe(false)
  })
})

describe('removeLangPath', () => {
  it('should remove locale from pathname', () => {
    const result = removeLangPath('/en/blog')
    expect(result).toBe('/blog')
  })

  it('should handle root path', () => {
    const result = removeLangPath('/en')
    expect(result).toBe('')
  })

  it('should not modify pathname without locale', () => {
    const result = removeLangPath('/blog')
    expect(result).toBe('blog')
  })

  it('should handle empty string', () => {
    const result = removeLangPath('')
    expect(result).toBe('')
  })
})
