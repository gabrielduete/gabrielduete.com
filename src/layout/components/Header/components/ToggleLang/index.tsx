import { useRouter } from 'next/router'

import * as S from './styles'

const ToggleLang = () => {
  const { push, pathname, locale } = useRouter()

  const switchLanguage = (lang: Langs) => {
    push(pathname, pathname, { locale: lang })
  }

  const isSelect = (lang: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')

    return (
      locale === lang ||
      (locale === 'en' && lang === 'en' && pathWithoutLocale === '/')
    )
  }

  return (
    <S.Container>
      <S.Lang
        onClick={() => switchLanguage('pt-BR')}
        isSelect={isSelect('pt-BR')}
      >
        PT-BR
      </S.Lang>
      <p>/</p>
      <S.Lang onClick={() => switchLanguage('en')} isSelect={isSelect('en')}>
        EN
      </S.Lang>
    </S.Container>
  )
}

export default ToggleLang
