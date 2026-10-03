'use client'

import { Locales } from '@/enums/Locales'
import clsx from 'clsx'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiArrowUpRight } from 'react-icons/fi'

import { isSelect } from '../helpers/isSelect'
import { removeLangPath } from '../helpers/removeLangPath'
import items from '../navigator.data'

const NavigatorMobile = () => {
  const pathname = removeLangPath(usePathname())
  const locale = useLocale()
  const isEn = locale === Locales.EN

  return (
    <ul className='mx-auto flex h-16 max-w-md items-stretch'>
      {items.map(item => {
        const { name, name_en, icon: Icon } = item
        const isExternal = 'external' in item && item.external
        const href = isExternal
          ? isEn
            ? item.hrefEn
            : item.href
          : `/${locale}${item.href}`
        const isActive = !isExternal && isSelect(pathname, name_en ?? name)

        return (
          <li key={name} className='flex-1'>
            <Link
              href={href}
              aria-current={isActive ? 'page' : undefined}
              {...(isExternal
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className={clsx(
                'group flex h-full flex-col items-center justify-center gap-xxsmall text-small transition-colors',
                'focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-card-accent',
                isActive
                  ? 'text-card-accent'
                  : 'text-gray-300 hover:text-white',
              )}
            >
              <span
                className={clsx(
                  'relative flex items-center justify-center rounded-full px-base py-xxsmall transition-colors',
                  isActive ? 'bg-card-accent/15' : 'group-hover:bg-white/5',
                )}
              >
                <Icon aria-hidden className='h-5 w-5' />
                {isExternal && (
                  <FiArrowUpRight
                    aria-hidden
                    className='absolute top-0 right-1 h-3 w-3'
                  />
                )}
              </span>
              <span className={clsx(isActive && 'font-bold')}>
                {isEn ? (name_en ?? name) : name}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export default NavigatorMobile
