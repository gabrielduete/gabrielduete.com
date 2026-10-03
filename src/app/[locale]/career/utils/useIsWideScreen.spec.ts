import { act, renderHook } from '@testing-library/react'

import { WIDE_SCREEN_QUERY, useIsWideScreen } from './useIsWideScreen'

type Listener = () => void

const mockMatchMedia = (matches: boolean) => {
  const listeners: Listener[] = []

  const mediaQuery = {
    matches,
    addEventListener: jest.fn((_: string, listener: Listener) =>
      listeners.push(listener),
    ),
    removeEventListener: jest.fn(),
  }

  window.matchMedia = jest.fn().mockReturnValue(mediaQuery)

  return {
    mediaQuery,
    emit: (next: boolean) => {
      mediaQuery.matches = next
      listeners.forEach(listener => listener())
    },
  }
}

describe('useIsWideScreen', () => {
  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia
  })

  it('should return false when matchMedia is not available', () => {
    const { result } = renderHook(() => useIsWideScreen())

    expect(result.current).toBe(false)
  })

  it('should read the initial match', () => {
    mockMatchMedia(true)

    const { result } = renderHook(() => useIsWideScreen())

    expect(result.current).toBe(true)
  })

  it('should follow the query with the default breakpoint', () => {
    mockMatchMedia(false)

    renderHook(() => useIsWideScreen())

    expect(window.matchMedia).toHaveBeenCalledWith(WIDE_SCREEN_QUERY)
  })

  it('should update when the media query changes', () => {
    const { emit } = mockMatchMedia(false)

    const { result } = renderHook(() => useIsWideScreen())

    expect(result.current).toBe(false)

    act(() => emit(true))

    expect(result.current).toBe(true)
  })

  it('should stop listening on unmount', () => {
    const { mediaQuery } = mockMatchMedia(true)

    const { unmount } = renderHook(() => useIsWideScreen())
    unmount()

    expect(mediaQuery.removeEventListener).toHaveBeenCalled()
  })
})
