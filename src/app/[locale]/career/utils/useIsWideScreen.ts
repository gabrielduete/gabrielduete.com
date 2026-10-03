'use client'

import { useEffect, useState } from 'react'

export const WIDE_SCREEN_QUERY = '(min-width: 1024px)'

export const useIsWideScreen = (query: string = WIDE_SCREEN_QUERY): boolean => {
  const [isWide, setIsWide] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(query)

    if (!mediaQuery) {
      return
    }

    const update = () => setIsWide(mediaQuery.matches)

    update()
    mediaQuery.addEventListener?.('change', update)

    return () => mediaQuery.removeEventListener?.('change', update)
  }, [query])

  return isWide
}
