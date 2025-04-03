import { useEffect } from 'react'

import { ThemeContextProvider, useTheme } from '@/contexts/useTheme'
import { Storages } from '@/enums/Storages'
import GlobalStyle from '@/styles/GlobalStyles'
import { darkTheme, lightTheme } from '@/styles/theme'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

const AppContent = ({ Component, pageProps }: AppProps) => {
  const { isDarkMode, setIsDarkMode } = useTheme()

  useEffect(() => {
    const savedTheme = window.localStorage.getItem(Storages.THEME)

    if (savedTheme) {
      return setIsDarkMode(savedTheme === 'dark')
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const systemTheme = mediaQuery.matches ? 'dark' : 'light'

    setIsDarkMode(systemTheme === 'dark')
    window.localStorage.setItem(Storages.THEME, systemTheme)

    const handleChange = (event: MediaQueryListEvent) => {
      const newTheme = event.matches ? 'dark' : 'light'

      setIsDarkMode(event.matches)
      window.localStorage.setItem(Storages.THEME, newTheme)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(Storages.THEME)

    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark')
    }
  }, [isDarkMode])

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

const App = (props: AppProps) => {
  return (
    <ThemeContextProvider>
      <AppContent {...props} />
    </ThemeContextProvider>
  )
}

export default appWithTranslation(App)
