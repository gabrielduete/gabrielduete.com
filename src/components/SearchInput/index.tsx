'use client'

import { useFilter } from '@/contexts/FilterContext'
import { useTranslations } from 'next-intl'
import { FiSearch, FiX } from 'react-icons/fi'

const SearchInput = () => {
  const t = useTranslations('Common')
  const { query, setQuery } = useFilter()

  return (
    <div className='relative w-full' data-testid='search-input'>
      <FiSearch
        aria-hidden
        className='absolute left-base top-1/2 -translate-y-1/2 text-gray-400'
      />
      <input
        type='search'
        value={query}
        onChange={event => setQuery(event.target.value)}
        aria-label={t('searchLabel')}
        placeholder={t('searchPlaceholder')}
        className='
          w-full bg-bg-cards text-white text-medium rounded-sm
          border border-green-weak-border
          pl-xxxlarge pr-xxxlarge py-small
          placeholder:text-gray-400
          focus:outline-none focus:border-secondary
          [&::-webkit-search-cancel-button]:appearance-none
        '
      />
      {query && (
        <button
          type='button'
          onClick={() => setQuery('')}
          aria-label={t('clearSearch')}
          className='
            absolute right-base top-1/2 -translate-y-1/2
            text-gray-400 hover:text-secondary cursor-pointer
          '
        >
          <FiX aria-hidden />
        </button>
      )}
    </div>
  )
}

export default SearchInput
