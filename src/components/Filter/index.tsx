import clsx from 'clsx'

import { filters } from './index.data'
import { IFilters } from './types'

type FilterProps = {
  selectedFilter: IFilters
  onFilterChange: (filter: IFilters) => void
}

const Filter = ({ selectedFilter, onFilterChange }: FilterProps) => {
  return (
    <div>
      <ul className='flex gap-xxxxlarge'>
        {filters.map(filter => {
          return (
            <li key={filter}>
              <button
                onClick={() => onFilterChange(filter)}
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
