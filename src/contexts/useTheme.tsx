import React, { ReactNode, createContext, useContext, useState } from 'react'

import { Storages } from '@/enums/Storages'

type ThemeContextProps = {
  isDarkMode: boolean
  setIsDarkMode: (value: boolean) => void
  toggleTheme: () => void
}

const ThemeContext = createContext({} as ThemeContextProps)

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
    window.localStorage.setItem(Storages.THEME, isDarkMode ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider')
  }
  return context
}
