import { useEffect, useState } from 'react'

import Layout from '@/layout'
import GlobalStyle from '@/styles/GlobalStyles'
import { darkTheme, lightTheme } from '@/styles/theme'
import { appWithTranslation } from 'next-i18next'
import { ThemeProvider as NextThemeProvider, useTheme } from 'next-themes'
import { AppProps } from 'next/app'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

const WithStyledTheme = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const theme = resolvedTheme === 'light' ? lightTheme : darkTheme

  return <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
}

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <NextThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem={true}
      disableTransitionOnChange={false}
      themes={['light', 'dark']}
    >
      <WithStyledTheme>
        <GlobalStyle />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WithStyledTheme>
    </NextThemeProvider>
  )
}

export default appWithTranslation(App)
