'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'

const QUERY_DEBOUNCE_MS = 250

interface FilterContextProps {
  filters: IFilters
  setFilters: (filters: IFilters) => void
  selectedFilter: IFilters
  setSelectedFilter: (filter: IFilters) => void
  query: string
  setQuery: (query: string) => void
  selectedTags: string[]
  toggleTag: (tag: string) => void
  clearTags: () => void
}

const FilterContext = createContext<FilterContextProps | null>(null)

export const parseTagsParam = (value: string | null): string[] => {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
}

export const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState()

  const locale = useLocale()
  const isEN = locale === 'en'

  const DEFAULT_FILTER: IFilters = isEN ? 'All' : 'Todos'

  const searchParams = useSearchParams()
  const router = useRouter()

  const selectedFilter =
    (searchParams.get('filter') as IFilters) || DEFAULT_FILTER

  const queryParam = searchParams.get('q') ?? ''
  const selectedTags = parseTagsParam(searchParams.get('tags'))

  const [query, setQueryState] = useState(queryParam)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) {
      return
    }

    setQueryState(queryParam)
  }, [queryParam])

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const pushParams = useCallback(
    (params: URLSearchParams) => {
      params.delete('page')

      const search = params.toString()

      router.push(search ? `?${search}` : '?', { scroll: false })
    },
    [router],
  )

  const setSelectedFilter = useCallback(
    (filter: IFilters) => {
      const params = new URLSearchParams(searchParams.toString())

      params.set('filter', filter)
      pushParams(params)
    },
    [pushParams, searchParams],
  )

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value)

      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      debounceRef.current = setTimeout(() => {
        debounceRef.current = null

        const params = new URLSearchParams(searchParams.toString())

        if (value.trim()) {
          params.set('q', value)
        } else {
          params.delete('q')
        }

        pushParams(params)
      }, QUERY_DEBOUNCE_MS)
    },
    [pushParams, searchParams],
  )

  const toggleTag = useCallback(
    (tag: string) => {
      const params = new URLSearchParams(searchParams.toString())

      const nextTags = selectedTags.includes(tag)
        ? selectedTags.filter(selected => selected !== tag)
        : [...selectedTags, tag]

      if (nextTags.length) {
        params.set('tags', nextTags.join(','))
      } else {
        params.delete('tags')
      }

      pushParams(params)
    },
    [pushParams, searchParams, selectedTags],
  )

  const clearTags = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete('tags')
    pushParams(params)
  }, [pushParams, searchParams])

  return (
    <FilterContext.Provider
      value={{
        selectedFilter,
        setSelectedFilter,
        filters,
        setFilters,
        query,
        setQuery,
        selectedTags,
        toggleTag,
        clearTags,
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
