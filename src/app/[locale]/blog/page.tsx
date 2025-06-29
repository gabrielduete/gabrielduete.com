'use client'

import Filter from '@/components/Filter'
import { useFilter } from '@/hooks/useFilter'

import Cards from './components/Cards'

const Blog = () => {
  const { selectedFilter, setFilter } = useFilter()

  return (
    <div className='flex flex-col gap-xxlarge'>
      <Filter selectedFilter={selectedFilter} onFilterChange={setFilter} />
      <Cards />
    </div>
  )
}

export default Blog
