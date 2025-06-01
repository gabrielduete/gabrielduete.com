import Navigator from '../Navigator/Desktop'
import ToggleLang from '../ToggleLang'
import ToggleTheme from '../ToggleTheme'

const MenuDesktop = () => {
  return (
    <nav className='lg:flex items-center justify-around m-xxxlarge screen hidden'>
      <ToggleLang />
      <Navigator />
      <ToggleTheme />
    </nav>
  )
}

export default MenuDesktop
