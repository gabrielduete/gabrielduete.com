'use client'

import { useState } from 'react'

import Pagination from '@/components/Pagination'
import { Locales } from '@/enums/Locales'
import { useFilter } from '@/hooks/useFilter'
import { parseDate } from '@/utils/formatterDate'
import { useLocale } from 'next-intl'

import Card from './components/Card'

type CardsProps = {
  articles: IArticle[]
}

const Cards = ({ articles }: CardsProps) => {
  const locale = useLocale()
  const { selectedFilter } = useFilter()
  const [currentPage, setCurrentPage] = useState(1)

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
  const currentArticles = orderArticles.slice(startIndex, endIndex)

  const totalPages = Math.ceil(orderArticles.length / articlesPerPage)

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
          currentPages={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )
}

export default Cards
