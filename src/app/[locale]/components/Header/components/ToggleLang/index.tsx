'use client'

import { useFilter } from '@/contexts/FilterContext'
import { Locales } from '@/enums/Locales'
import { usePathname, useRouter } from '@/i18n/navigation'
import clsx from 'clsx'
import { useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'

const ToggleLang = () => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { filters } = useFilter()

  const switchLanguage = (lang: Langs) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentFilter = params.get('filter')

    if (filters === undefined) {
      return router.replace(pathname, { locale: lang })
    }

    const currentIndex = filters?.[locale]?.findIndex(
      (index: string) => index === currentFilter,
    )

    const translatedFilter =
      currentIndex !== -1 ? filters[lang][currentIndex] : currentFilter

    if (translatedFilter) {
      params.set('filter', translatedFilter)
    }

    const newPath = `${pathname}?${params.toString()}`
    router.replace(newPath, { locale: lang })
  }

  const isSelect = (lang: Langs) => locale === lang

  return (
    <div className='flex gap-2'>
      <button
        className={`cursor-pointer uppercase ${
          isSelect(Locales.PT_BR) ? 'text-secondary' : 'text-primary'
        }`}
        onClick={() => switchLanguage(Locales.PT_BR)}
      >
        pt-br
      </button>
      <p className='text-primary'>/</p>
      <button
        className={clsx(
          'uppercase cursor-pointer',
          isSelect(Locales.EN) ? 'text-secondary' : 'text-primary',
        )}
        onClick={() => switchLanguage(Locales.EN)}
      >
        en
      </button>
    </div>
  )
}

export default ToggleLang
