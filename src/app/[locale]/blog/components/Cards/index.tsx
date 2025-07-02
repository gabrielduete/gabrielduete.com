import { getAllArticles } from '@/utils/getArticles'
import { useLocale } from 'next-intl'

import Card from './components/Card'

const Cards = () => {
  const locale = useLocale()

  const articles = getAllArticles(locale)

  return (
    <div className='flex gap-xxlarge flex-wrap'>
      {articles.map(article => (
        <Card
          key={article.slug}
          title={article.title}
          description={article.description}
          date={article.date}
        />
      ))}
    </div>
  )
}

export default Cards
