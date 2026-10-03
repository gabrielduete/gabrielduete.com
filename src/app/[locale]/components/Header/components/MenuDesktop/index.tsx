import NavigatorDesktop from '../Navigator/Desktop'
import ToggleLang from '../ToggleLang'
import ToggleTheme from '../ToggleTheme'

const MenuDesktop = () => {
  return (
    <nav className='hidden lg:grid grid-cols-[1fr_minmax(0,var(--container-content))_1fr] items-center gap-large px-large mt-xxxlarge mb-xxxlarge w-full max-w-ultrawidemin m-auto'>
      <div className='justify-self-start'>
        <ToggleLang />
      </div>
      <NavigatorDesktop />
      <div className='justify-self-end'>
        <ToggleTheme />
      </div>
    </nav>
  )
}

export default MenuDesktop
