'use client'

import { useEffect, useMemo } from 'react'

import Cards from '@/components/Cards'
import Filter from '@/components/Filter'
import SearchInput from '@/components/SearchInput'
import TagFilter from '@/components/TagFilter'
import { useFilter } from '@/contexts/FilterContext'
import { getTagsByFrequency } from '@/utils/filterArticles'

import { FILTERS } from '../index.data'

type BlogViewProps = {
  articles: IArticle[]
}

const BlogView = ({ articles }: BlogViewProps) => {
  const { setFilters } = useFilter()

  const tags = useMemo(() => getTagsByFrequency(articles), [articles])

  useEffect(() => {
    setFilters(FILTERS)
  }, [setFilters])

  return (
    <section className='flex flex-col gap-xxlarge'>
      <div className='flex flex-col gap-large'>
        <Filter />
        <SearchInput />
        <TagFilter tags={tags} />
      </div>
      <Cards articles={articles} />
    </section>
  )
}

export default BlogView
