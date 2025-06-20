'use client'

import { Locales } from '@/enums/Locales'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

const ToggleLang = () => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()

  const switchLanguage = (lang: Langs) => {
    router.replace(pathname, { locale: lang })
  }

  const isSelect = (lang: Langs) => locale === lang

  return (
    <div className='flex gap-2'>
      <button
        className={`
          cursor-pointer uppercase
          ${isSelect(Locales.PT_BR) ? 'text-secondary' : 'text-primary'}
        `}
        onClick={() => switchLanguage(Locales.PT_BR)}
      >
        pt-br
      </button>
      <p className='text-primary'>/</p>
      <button
        className={`
          uppercase cursor-pointer 
          ${isSelect(Locales.EN) ? 'text-secondary' : 'text-primary'}
        `}
        onClick={() => switchLanguage(Locales.EN)}
      >
        en
      </button>
    </div>
  )
}

export default ToggleLang
