'use client'

import { useEffect, useState } from 'react'

import Pagination from '@/components/Pagination'
import { useFilter } from '@/contexts/FilterContext'
import { Locales } from '@/enums/Locales'
import { parseDate } from '@/utils/formatterDate'
import { useLocale } from 'next-intl'

import Card from './components/Card'
import { FILTERS } from './index.data'

type CardsProps = {
  articles: IArticle[]
}

const Cards = ({ articles }: CardsProps) => {
  const locale = useLocale()
  const [currentPage, setCurrentPage] = useState(1)
  const { setFilters, selectedFilter } = useFilter()

  const articlesPerPage = 4

  const filteredArticles = articles.filter(article => {
    const isAll = selectedFilter === 'Todos' || selectedFilter === 'All'

    return isAll || article.category === selectedFilter
  })

  const orderArticles = [...filteredArticles].sort((a, b) => {
    const isEN = locale === Locales.EN

    if (!isEN) {
      const dateA = parseDate(a.date)
      const dateB = parseDate(b.date)

      return dateB.getTime() - dateA.getTime()
    }

    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()

    return dateB - dateA
  })

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentPageArticles = orderArticles.slice(startIndex, endIndex)

  const totalPages = Math.ceil(orderArticles.length / articlesPerPage)

  const currentArticles = totalPages === 1 ? orderArticles : currentPageArticles

  useEffect(() => {
    setFilters(FILTERS)
  }, [setFilters])

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
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )
}

export default Cards
