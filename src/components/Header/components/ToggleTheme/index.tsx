'use client'

import React from 'react'

import { useTheme } from 'next-themes'

const ToggleTheme = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <div
      className={`rounded-full cursor-pointer w-large h-large bg-bg-secondary`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label='Toggle theme'
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          setTheme(isDark ? 'light' : 'dark')
        }
      }}
    />
  )
}

export default ToggleTheme
