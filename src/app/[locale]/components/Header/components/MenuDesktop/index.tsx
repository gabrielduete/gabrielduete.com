import NavigatorDesktop from '../Navigator/Desktop'
import ToggleLang from '../ToggleLang'
import ToggleTheme from '../ToggleTheme'

const MenuDesktop = () => {
  return (
    <nav className='hidden lg:flex items-center justify-between gap-large px-large mt-xxxlarge mb-xxxlarge w-full max-w-ultrawidemin m-auto'>
      <div className='shrink-0'>
        <ToggleLang />
      </div>
      <div className='flex-1 min-w-0 flex justify-center'>
        <NavigatorDesktop />
      </div>
      <div className='shrink-0'>
        <ToggleTheme />
      </div>
    </nav>
  )
}

export default MenuDesktop
