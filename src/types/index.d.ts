import { filters } from '@/enums/Filters'

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
  }

  type LocaleFilters = typeof filters

  type IFilters = LocaleFilters[keyof LocaleFilters][number]

  type IFilterTranslations = {
    [key in Langs]: {
      [filter in IFilters]?: string
    }
  }
}
