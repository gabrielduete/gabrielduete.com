'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import Pagination from '@/components/Pagination'
import { useFilter } from '@/contexts/FilterContext'
import { parseArticleDate } from '@/utils/formatterDate'
import { useLocale } from 'next-intl'

import Card from './components/Card'

type CardsProps = {
  articles: IArticle[]
}

const Cards = ({ articles }: CardsProps) => {
  const locale = useLocale()
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

    const query = params.toString()

    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  const { selectedFilter } = useFilter()

  const articlesPerPage = 4

  const filteredArticles = articles.filter(article => {
    const isAll = selectedFilter === 'Todos' || selectedFilter === 'All'

    return isAll || article.category === selectedFilter
  })

  const orderArticles = [...filteredArticles].sort((a, b) => {
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

  return (
    <>
      <div className='flex gap-xxlarge flex-wrap justify-center lg:justify-start'>
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
