'use client'

import { Locales } from '@/enums/Locales'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isSelect } from '../helpers/isSelect'
import { removeLangPath } from '../helpers/removeLangPath'
import items from '../navigator.data'

const NavigatorDesktop = () => {
  const pathname = removeLangPath(usePathname())
  const locale = useLocale()
  const isEn = locale === Locales.EN

  return (
    <ul
      className='bg-bg-primary rounded-sm border-[1px] border-green-weak-border w-full max-w-[1000px]
      p-base flex items-center justify-center gap-(--spacing-xxxxlarge) list-none'
    >
      {items.map(item => {
        const { name, name_en } = item
        const isExternal = 'external' in item && item.external
        const href = isExternal
          ? isEn
            ? item.hrefEn
            : item.href
          : `/${locale}${item.href}`
        return (
          <li key={name}>
            <Link
              href={href}
              {...(isExternal
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <p
                className={`
                  text-subtitle-small cursor-pointer transition-colors hover:text-secondary
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

export default NavigatorDesktop
