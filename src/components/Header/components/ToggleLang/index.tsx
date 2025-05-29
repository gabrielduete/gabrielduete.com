'use client'

import { usePathname, useRouter } from 'next/navigation'

type Langs = 'pt-br' | 'en'

const ToggleLang = () => {
  const router = useRouter()
  const pathname = usePathname()
  const locale = 'en'

  const switchLanguage = (lang: Langs) => {
    router.push(`/${lang}${pathname}`)
  }

  const isSelect = (lang: string) => {
    const pathWithoutLocale = pathname?.replace(`/${locale}`, '') || ''
    return (
      locale === lang ||
      (locale === 'en' && lang === 'en' && pathWithoutLocale === '/')
    )
  }

  return (
    <div className='flex gap-2'>
      <button
        className={`
          cursor-pointer bg-transparent border-0 transition-colors duration-200 text-subtitle-sm
          text-primary ${isSelect('pt-br') && 'text-primary'}`}
        onClick={() => switchLanguage('pt-br')}
      >
        PT-br
      </button>
      <p className='text-primary'>/</p>
      <button
        className={`lang text-primary ${isSelect('en') && 'text-secondary'}`}
        onClick={() => switchLanguage('en')}
      >
        EN
      </button>
    </div>
  )
}

export default ToggleLang
