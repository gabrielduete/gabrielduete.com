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

  const options: { lang: Langs; label: string; name: string }[] = [
    { lang: Locales.PT_BR, label: 'PT', name: 'Português' },
    { lang: Locales.EN, label: 'EN', name: 'English' },
  ]

  const isEn = locale === Locales.EN

  return (
    <div
      role='group'
      aria-label={isEn ? 'Language' : 'Idioma'}
      className='relative flex rounded-full border border-green-weak-border p-0.5'
    >
      <span
        aria-hidden
        className={clsx(
          'absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-secondary',
          'transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          isEn && 'translate-x-full',
        )}
      />
      {options.map(({ lang, label, name }) => {
        const isActive = locale === lang

        return (
          <button
            key={lang}
            type='button'
            lang={lang}
            title={name}
            aria-pressed={isActive}
            onClick={() => !isActive && switchLanguage(lang)}
            className={clsx(
              'relative z-10 w-10 cursor-pointer rounded-full py-xxsmall text-small font-bold transition-colors duration-300',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
              isActive
                ? 'text-green-black'
                : 'text-primary hover:text-secondary',
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default ToggleLang
