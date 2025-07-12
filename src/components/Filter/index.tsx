'use client'

import { useFilter } from '@/contexts/FilterContext'
import clsx from 'clsx'
import { useLocale } from 'next-intl'

const Filter = () => {
  const locale = useLocale() as Langs
  const { filters, selectedFilter, setSelectedFilter } = useFilter()

  const localizedFilters = filters?.[locale]

  return (
    <div data-testid='component-filter'>
      <ul className='flex gap-xxxxlarge'>
        {localizedFilters?.map((filter: string) => (
          <li key={filter}>
            <button
              onClick={() => setSelectedFilter(filter as IFilters)}
              className={clsx(
                'cursor-pointer text-large text-primary hover:text-secondary',
                selectedFilter === filter && 'text-secondary',
              )}
            >
              {filter}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Filter
