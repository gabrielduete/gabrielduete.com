import React, { useState } from 'react'

import { useTheme } from '@/contexts/useTheme'

import * as S from './styles'

const ToggleTheme = () => {
  const { isDarkMode, toggleTheme } = useTheme()

  return <S.Circle isDark={isDarkMode} onClick={toggleTheme} />
}

export default ToggleTheme
