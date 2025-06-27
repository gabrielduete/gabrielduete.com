'use client'

import Filter from '@/components/Filter'
import { useFilter } from '@/hooks/useFilter'

const Blog = () => {
  const { selectedFilter, setFilter } = useFilter()

  return (
    <div>
      <Filter selectedFilter={selectedFilter} onFilterChange={setFilter} />
    </div>
  )
}

export default Blog
