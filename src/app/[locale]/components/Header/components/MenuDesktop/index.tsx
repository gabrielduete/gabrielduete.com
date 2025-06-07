import NavigatorDesktop from '../Navigator/Desktop'
import ToggleLang from '../ToggleLang'
import ToggleTheme from '../ToggleTheme'

const MenuDesktop = () => {
  return (
    <nav className='relative lg:block mt-xxxlarge mb-xxxlarge hidden w-full max-w-ultrawidemin m-auto'>
      <div className='absolute left-10 top-large'>
        <ToggleLang />
      </div>
      <div className='w-full max-w-content m-auto'>
        <NavigatorDesktop />
      </div>
      <div className='absolute right-10 top-large'>
        <ToggleTheme />
      </div>
    </nav>
  )
}

export default MenuDesktop
