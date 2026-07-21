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
      <ul className='flex flex-wrap gap-xxlarge'>
        {localizedFilters?.map((filter: string) => {
          const isSelected = selectedFilter === filter

          return (
            <li key={filter}>
              <button
                onClick={() => setSelectedFilter(filter as IFilters)}
                aria-pressed={isSelected}
                className={clsx(
                  'cursor-pointer text-large text-primary hover:text-secondary',
                  'border-b pb-xxsmall transition-colors',
                  isSelected
                    ? 'text-secondary border-secondary'
                    : 'border-transparent',
                )}
              >
                {filter}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Filter
