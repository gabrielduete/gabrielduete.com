'use client'

import { useEffect, useState } from 'react'

import { Storages } from '@/enums/Storages'
import { MdDarkMode, MdLightMode } from 'react-icons/md'

const ToggleTheme = () => {
  const [theme, setThemeState] = useState<Themes>('dark')

  useEffect(() => {
    const storedTheme = localStorage.getItem(Storages.THEME) as Themes

    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches

    const initialTheme = storedTheme ?? (systemPrefersDark ? 'dark' : 'light')

    setThemeState(initialTheme)
    document.body.dataset.theme = initialTheme
  }, [])

  const setTheme = (theme: Themes) => {
    document.body.dataset.theme = theme
    localStorage.setItem(Storages.THEME, theme)
    setThemeState(theme)
  }

  const isDark = theme === 'dark'

  return (
    <div
      className='cursor-pointer'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label='Toggle theme'
      role='button'
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          setTheme(isDark ? 'light' : 'dark')
        }
      }}
    >
      {isDark ? (
        <MdLightMode size={24} className='text-secondary' />
      ) : (
        <MdDarkMode size={24} className='text-primary' />
      )}
    </div>
  )
}

export default ToggleTheme
