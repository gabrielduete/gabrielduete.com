'use client'

import { useEffect } from 'react'

import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

export const useFilter = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const locale = useLocale()

  const isEN = locale === 'en'

  const DEFAULT_FILTER: IFilters = isEN ? 'All' : 'Todos'

  const selectedFilter =
    (searchParams.get('filter') as IFilters) || DEFAULT_FILTER

  useEffect(() => {
    if (!searchParams.has('filter')) {
      const params = new URLSearchParams(searchParams.toString())

      params.set('filter', DEFAULT_FILTER)
      router.replace(`?${params.toString()}`)
    }
  }, [searchParams, router])

  const setSelectedFilter = (filter: IFilters) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('filter', filter)
    router.push(`?${params.toString()}`)
  }

  return { selectedFilter, setSelectedFilter }
}
