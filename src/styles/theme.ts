import { DefaultTheme } from 'styled-components'

export const darkTheme: DefaultTheme = {
  mode: 'dark',
  colors: {
    background: 'var(--color-green-border)',
    text: 'var(--color-white)',
  },
}

export const lightTheme: DefaultTheme = {
  mode: 'light',
  colors: {
    background: 'var(--color-white)',
    text: 'var(--color-green-strong)',
  },
}
