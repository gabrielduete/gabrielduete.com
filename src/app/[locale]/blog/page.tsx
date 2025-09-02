import TabTitleWatcher from '@/components/TabTitleWatcher/TabTitleWatcher'
import { getAllArticles } from '@/utils/getArticles'
import { useLocale } from 'next-intl'

import BlogView from './views/ClientView'

export const metadata = {
  title: 'Gabriel Duete | Blog',
  description: 'Gabriel Duete Blog, a software developer.',
}

const Blog = () => {
  const locale = useLocale()

  const articles = getAllArticles(locale as Langs)

  return (
    <>
      <TabTitleWatcher originalTitle={metadata.title} />
      <BlogView articles={articles} />
    </>
  )
}

export default Blog
