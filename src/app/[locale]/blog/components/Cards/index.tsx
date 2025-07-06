'use client'

import { useState } from 'react'

import Pagination from '@/components/Pagination'
import { Locales } from '@/enums/Locales'
import { parseDate } from '@/utils/formatterDate'
import { useLocale } from 'next-intl'

import Card from './components/Card'

type CardsProps = {
  articles: IArticle[]
}

const Cards = ({ articles }: CardsProps) => {
  const locale = useLocale()

  const [currentPage, setCurrentPage] = useState(1)

  const orderArticles = [...articles].sort((a, b) => {
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

  const articlesPerPage = 4

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
      <Pagination
        totalPages={totalPages}
        currentPages={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  )
}

export default Cards
