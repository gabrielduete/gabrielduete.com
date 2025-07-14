export {}

declare global {
  type Langs = 'en' | 'pt-br'

  type Themes = 'dark' | 'light'

  type IArticle = {
    title: string
    description: string
    date: string
    category: string
    tags: string[]
    slug: string
    locale: Langs
    pinned?: boolean
  }

  type LocaleFilters = Array<{
    [lang in Langs]: string[]
  }>

  type IFilters = LocaleFilters[keyof LocaleFilters][number]
}
