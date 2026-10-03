'use client'

import { Locales } from '@/enums/Locales'
import { useLocale } from 'next-intl'

import NavigatorMobile from '../Navigator/Mobile'
import ToggleLang from '../ToggleLang'
import ToggleTheme from '../ToggleTheme'

const MenuMobile = () => {
  const isEn = useLocale() === Locales.EN

  return (
    <div className='lg:hidden'>
      <div className='flex items-center justify-between px-4 pt-base'>
        <ToggleLang />
        <ToggleTheme />
      </div>
      <nav
        aria-label={isEn ? 'Main navigation' : 'Navegação principal'}
        className='fixed inset-x-0 bottom-0 z-40 border-t border-green-weak-border bg-bg-primary pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.5)]'
      >
        <NavigatorMobile />
      </nav>
    </div>
  )
}

export default MenuMobile
