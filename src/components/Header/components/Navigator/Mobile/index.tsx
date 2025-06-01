'use client'

import { Locales } from '@/enums/Locales'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isSelect } from '../helpers/isSelect'
import { removeLangPath } from '../helpers/removeLangPath'
import items from '../navigator.data'

type NavigatorMobileProps = {
  closeMenu: () => void
}

const NavigatorMobile = ({ closeMenu }: NavigatorMobileProps) => {
  const pathname = removeLangPath(usePathname())
  const locale = useLocale()
  const isEn = locale === Locales.EN

  return (
    <ul>
      {items.map(({ name, name_en, href }) => {
        return (
          <li key={name} className='text-subtitle text-primary'>
            <Link href={href} passHref onClick={closeMenu}>
              <p
                className={`
                  cursor-pointer transition-colors text-primary hover:text-secondary mb-base
                  ${isSelect(pathname, name_en ?? name) && 'text-secondary'}`}
              >
                {isEn ? (name_en ?? name) : name}
              </p>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default NavigatorMobile
