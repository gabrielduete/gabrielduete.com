'use client'

import { useFilter } from '@/hooks/useFilter'
import clsx from 'clsx'

import { filters } from './index.data'

const Filter = () => {
  const { selectedFilter, setSelectedFilter } = useFilter()

  return (
    <div>
      <ul className='flex gap-xxxxlarge'>
        {filters.map(filter => {
          return (
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
          )
        })}
      </ul>
    </div>
  )
}

export default Filter
