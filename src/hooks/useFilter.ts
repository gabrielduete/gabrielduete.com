'use client'

import { useEffect } from 'react'

import { IFilters } from '@/components/Filter/types'
import { useRouter, useSearchParams } from 'next/navigation'

const DEFAULT_FILTER: IFilters = 'Front-end'

export const useFilter = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedFilter =
    (searchParams.get('filter') as IFilters) || DEFAULT_FILTER

  useEffect(() => {
    if (!searchParams.has('filter')) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('filter', DEFAULT_FILTER)
      router.replace(`?${params.toString()}`)
    }
  }, [searchParams, router])

  const setFilter = (filter: IFilters) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('filter', filter)
    router.push(`?${params.toString()}`)
  }

  return { selectedFilter, setFilter }
}
