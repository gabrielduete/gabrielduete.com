import Cards from '@/components/Cards'
import Filter from '@/components/Filter'
import { getAllArticles } from '@/utils/getArticles'
import { useLocale } from 'next-intl'

const Blog = () => {
  const locale = useLocale()
  const articles = getAllArticles(locale as Langs)

  return (
    <section className='flex flex-col gap-xxlarge'>
      <Filter />
      <Cards articles={articles} />
    </section>
  )
}

export default Blog
