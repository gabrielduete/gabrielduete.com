'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

interface FilterContextProps {
  filters: IFilters
  setFilters: (filters: IFilters) => void
  selectedFilter: IFilters
  setSelectedFilter: (filter: IFilters) => void
}

const FilterContext = createContext<FilterContextProps | null>(null)

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState()

  const locale = useLocale()
  const isEN = locale === 'en'

  const DEFAULT_FILTER: IFilters = isEN ? 'All' : 'Todos'

  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedFilter =
    (searchParams.get('filter') as IFilters) || DEFAULT_FILTER

  useEffect(() => {
    if (!searchParams.has('filter')) {
      const params = new URLSearchParams(searchParams.toString())

      router.replace(`?${params.toString()}`)
    }
  }, [searchParams, router, DEFAULT_FILTER])

  const setSelectedFilter = useCallback(
    (filter: IFilters) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('filter', filter)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  return (
    <FilterContext.Provider
      value={{
        selectedFilter,
        setSelectedFilter,
        filters,
        setFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider')
  }
  return context
}
