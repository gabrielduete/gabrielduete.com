import { renderHook } from '@testing-library/react'

let mockPath = '/en'
jest.mock('next/navigation', () => ({
  usePathname: () => mockPath,
}))

import { useCurrentPost } from './useCurrentPost'

describe('useCurrentPost', () => {
  it('returns slug and locale on a blog post path', () => {
    mockPath = '/pt-br/blog/my-post'
    const { result } = renderHook(() => useCurrentPost())

    expect(result.current).toEqual({ locale: 'pt-br', slug: 'my-post' })
  })

  it('returns null slug off blog post pages', () => {
    mockPath = '/en/career'
    const { result } = renderHook(() => useCurrentPost())

    expect(result.current.slug).toBeNull()
    expect(result.current.locale).toBe('en')
  })
})
