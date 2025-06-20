'use client'

import { useState } from 'react'

import { CgMenuRound } from 'react-icons/cg'
import { CgCloseO } from 'react-icons/cg'

import NavigatorMobile from '../Navigator/Mobile'
import ToggleLang from '../ToggleLang'
import ToggleTheme from '../ToggleTheme'

const MenuMobile = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className={`lg:hidden flex justify-end-safe ${!isOpen && 'm-small'}`}>
      <CgMenuRound
        size={38}
        className={`
              text-primary hover:text-icons-primary  
              cursor-pointer transition-colors duration-200
              ${isOpen ? 'hidden' : 'block'}`}
        aria-label='Open Menu'
        onClick={() => setIsOpen(!isOpen)}
      />
      <div
        className={`
          ${
            isOpen
              ? 'w-full h-full bg-bg-primary fixed top-0 left-0 z-[9999] flex-col place-items-center'
              : 'hidden'
          }`}
      >
        <CgCloseO
          size={38}
          className={`
              text-primary hover:text-icons-primary mt-xxlarge mr-xxlarge
              cursor-pointer transition-colors duration-200 place-self-end
              ${isOpen ? 'block ' : 'hidden'}`}
          aria-label='Close Menu'
          onClick={() => setIsOpen(!isOpen)}
        />
        <NavigatorMobile closeMenu={() => setIsOpen(false)} />
        <hr className='w-full text-green-white mb-xxlarge' />
        <ToggleLang />
        <hr className='w-full text-green-white mt-xxlarge mb-xxlarge' />
        <ToggleTheme />
      </div>
    </nav>
  )
}

export default MenuMobile
