import { useEffect, useState } from 'react'

import GlobalStyle from '@/styles/GlobalStyles'
import { darkTheme, lightTheme } from '@/styles/theme'
import { appWithTranslation } from 'next-i18next'
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes'
import { AppProps } from 'next/app'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

const App = ({ Component, pageProps }: AppProps) => {
  function ThemeWithStyled({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) return null

    const theme = resolvedTheme === 'dark' ? darkTheme : lightTheme

    return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
  }

  return (
    <NextThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem={true}
      themes={['light', 'dark']}
    >
      <ThemeWithStyled>
        <GlobalStyle />
        <Component {...pageProps} />
      </ThemeWithStyled>
    </NextThemeProvider>
  )
}

export default appWithTranslation(App)
