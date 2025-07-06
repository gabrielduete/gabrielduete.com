import { getAllArticles } from '@/utils/getArticles'
import { useLocale } from 'next-intl'

import Card from './components/Card'

const Cards = () => {
  const locale = useLocale()

  const articles = getAllArticles(locale as Langs)

  return (
    <div className='flex gap-xxlarge flex-wrap justify-center lg:justify-start'>
      {articles.map((article: IArticle) => (
        <Card key={article.title} {...article} />
      ))}
    </div>
  )
}

export default Cards
