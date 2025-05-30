import Navigator from './components/Navigator'
import ToggleLang from './components/ToggleLang'
import ToggleTheme from './components/ToggleTheme'

const Header = () => {
  return (
    <header className='flex items-center justify-around m-xxxlarge'>
      <ToggleLang />
      <Navigator />
      <ToggleTheme />
    </header>
  )
}

export default Header
