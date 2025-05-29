'use client'

import Navigator from './components/Navigator'
import ToggleLang from './components/ToggleLang'
import ToggleTheme from './components/ToggleTheme'
import './header.css'

const Header = () => {
  return (
    <header className='header'>
      <ToggleLang />
      <Navigator />
      <ToggleTheme />
    </header>
  )
}

export default Header
