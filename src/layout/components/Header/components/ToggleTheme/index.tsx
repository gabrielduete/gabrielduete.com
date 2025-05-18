import React from 'react'

import { useTheme } from 'next-themes'

import * as S from './styles'

const ToggleTheme = () => {
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <S.Circle
      isDark={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    />
  )
}

export default ToggleTheme
