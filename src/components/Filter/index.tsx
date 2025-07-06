'use client'

import { filters } from '@/enums/Filters'
import { useFilter } from '@/hooks/useFilter'
import clsx from 'clsx'
import { useLocale } from 'next-intl'

const Filter = () => {
  const locale = useLocale() as Langs
  const { selectedFilter, setSelectedFilter } = useFilter()

  const localizedFilters = filters[locale]

  return (
    <div>
      <ul className='flex gap-xxxxlarge'>
        {localizedFilters.map(filter => (
          <li key={filter}>
            <button
              onClick={() => setSelectedFilter(filter)}
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
