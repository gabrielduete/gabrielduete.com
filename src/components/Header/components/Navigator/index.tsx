'use client'

import { Locales } from '@/enums/Locales'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import items from './navigator.data'

const Navigator = () => {
  const pathname = usePathname().replace(/^\/(en|pt-br)?/, '')
  const locale = useLocale()
  const isEn = locale === Locales.EN

  const isSelect = (path: string) => {
    return (
      pathname === `/${path.toLowerCase()}` ||
      (pathname === '' && path === 'Hello')
    )
  }

  return (
    <ul
      className='bg-bg-primary rounded-sm border-[1px] border-green-weak-border w-full max-w-[1000px]
      p-(--spacing-base) flex items-center justify-center gap-(--spacing-xxxxlarge) list-none'
    >
      {items.map(({ name, name_en, href }) => {
        return (
          <li key={name} className='text-subtitle-small text-primary'>
            <Link href={href} passHref>
              <p
                className={`
                  cursor-pointer transition-colors text-primary hover:text-secondary
                  ${isSelect(name_en ?? name) && 'text-secondary'}`}
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

export default Navigator
