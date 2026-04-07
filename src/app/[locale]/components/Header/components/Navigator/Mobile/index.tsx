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
      {items.map(item => {
        const { name, name_en } = item
        const isExternal = 'external' in item && item.external
        const href = isExternal
          ? isEn
            ? item.hrefEn
            : item.href
          : `/${locale}${item.href}`
        return (
          <li key={name} className='text-subtitle'>
            <Link
              href={href}
              passHref
              onClick={closeMenu}
              {...(isExternal
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <p
                className={`
                  cursor-pointer transition-colors hover:text-secondary mb-base
                  ${isSelect(pathname, name_en ?? name) ? 'text-secondary' : 'text-white'}`}
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
