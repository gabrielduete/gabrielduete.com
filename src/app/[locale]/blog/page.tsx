import Filter from '@/components/Filter'

import Cards from './components/Cards'

const Blog = () => {
  return (
    <section className='flex flex-col gap-xxlarge'>
      <Filter />
      <Cards />
    </section>
  )
}

export default Blog
