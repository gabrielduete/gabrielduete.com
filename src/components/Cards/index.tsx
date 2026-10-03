'use client'

import Pagination from '@/components/Pagination'
import { useFilter } from '@/contexts/FilterContext'
import { matchesQuery, matchesTags } from '@/utils/filterArticles'
import { parseArticleDate } from '@/utils/formatterDate'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Card from './components/Card'

type CardsProps = {
  articles: IArticle[]
}

const Cards = ({ articles }: CardsProps) => {
  const locale = useLocale()
  const t = useTranslations('Common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageParam = Number(searchParams.get('page'))
  const currentPage = pageParam > 0 ? pageParam : 1

  const setCurrentPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (page <= 1) {
      params.delete('page')
    } else {
      params.set('page', String(page))
    }

    const search = params.toString()

    router.push(search ? `${pathname}?${search}` : pathname, { scroll: false })
  }

  const { selectedFilter, query, selectedTags } = useFilter()

  const articlesPerPage = 4

  const filteredArticles = articles.filter(article => {
    const isAll = selectedFilter === 'Todos' || selectedFilter === 'All'
    const matchesCategory = isAll || article.category === selectedFilter

    return (
      matchesCategory &&
      matchesTags(article, selectedTags) &&
      matchesQuery(article, query)
    )
  })

  const orderArticles = [...filteredArticles].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1
    }

    const dateA = parseArticleDate(a.date, locale as Langs)
    const dateB = parseArticleDate(b.date, locale as Langs)

    return dateB.getTime() - dateA.getTime()
  })

  const totalPages = Math.ceil(orderArticles.length / articlesPerPage)

  const safePage = Math.min(Math.max(currentPage, 1), Math.max(totalPages, 1))

  const startIndex = (safePage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentPageArticles = orderArticles.slice(startIndex, endIndex)

  const currentArticles = totalPages === 1 ? orderArticles : currentPageArticles

  if (orderArticles.length === 0) {
    return (
      <p
        className='text-medium text-gray-400 text-center lg:text-left'
        data-testid='cards__empty'
      >
        {t('noResults')}
      </p>
    )
  }

  return (
    <>
      <div className='grid grid-cols-1 gap-xxlarge justify-items-center lg:grid-cols-2'>
        {currentArticles.map(article => (
          <Card key={article.title} {...article} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={safePage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )
}

export default Cards
