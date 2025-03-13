import { LocalKeys } from '@/enums/LocalKeys'
import GlobalStyle from '@/styles/GlobalStyles'
import { darkTheme, lightTheme } from '@/styles/theme'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'styled-components'

export default function App({ Component, pageProps }: AppProps) {
  const theme =
    (typeof window !== 'undefined' &&
      window.localStorage.getItem(LocalKeys.THEME)) ||
    'dark'

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
