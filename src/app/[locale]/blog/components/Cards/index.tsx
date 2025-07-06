'use client'

import { useState } from 'react'

import Pagination from '@/components/Pagination'

import Card from './components/Card'

type CardsProps = {
  articles: IArticle[]
}

const Cards = ({ articles }: CardsProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 4

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = articles.slice(startIndex, endIndex)

  const totalPages = Math.ceil(articles.length / articlesPerPage)

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
