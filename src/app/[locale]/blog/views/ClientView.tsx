'use client'

import { useEffect } from 'react'

import Cards from '@/components/Cards'
import Filter from '@/components/Filter'
import { useFilter } from '@/contexts/FilterContext'

import { FILTERS } from '../index.data'

type BlogViewProps = {
  articles: IArticle[]
}

const BlogView = ({ articles }: BlogViewProps) => {
  const { setFilters } = useFilter()

  useEffect(() => {
    setFilters(FILTERS)
  }, [setFilters])

  return (
    <section className='flex flex-col gap-xxlarge'>
      <Filter />
      <Cards articles={articles} />
    </section>
  )
}

export default BlogView
