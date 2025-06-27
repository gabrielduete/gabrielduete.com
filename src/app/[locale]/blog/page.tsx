'use client'

import { useEffect } from 'react'

import Filter from '@/components/Filter'
import { IFilters } from '@/components/Filter/types'
import { useRouter, useSearchParams } from 'next/navigation'

const Blog = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const DEFAULT_FILTER: IFilters = 'Front-end'

  const selectedFilter =
    (searchParams.get('filter') as IFilters) || DEFAULT_FILTER

  useEffect(() => {
    const hasFilterParam = searchParams.has('filter')

    if (!hasFilterParam) {
      const params = new URLSearchParams(searchParams.toString())

      params.set('filter', DEFAULT_FILTER)
      router.replace(`?${params.toString()}`)
    }
  }, [searchParams, router])

  const filterChange = (filter: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('filter', filter)
    router.push(`?${params.toString()}`)
  }

  return (
    <div>
      <Filter selectedFilter={selectedFilter} onFilterChange={filterChange} />
    </div>
  )
}

export default Blog
