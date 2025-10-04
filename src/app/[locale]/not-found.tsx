import Cards from '@/components/Cards'
import { Paths } from '@/enums/Paths'
import { getPinnedArticles } from '@/utils/getArticles'
import { getLocale, getTranslations } from 'next-intl/server'
import Link from 'next/link'

const NotFound = async () => {
  const t = await getTranslations('NotFound')
  const locale = await getLocale()

  const pinnedArticles = getPinnedArticles(locale as Langs)

  return (
    <div className='flex flex-col items-center text-primary lg:items-start'>
      <h1 className='text-title-giant'>{t('title')}</h1>
      <p className='text-medium'>
        {t.rich('description', {
          blog: chunks => (
            <Link href={Paths.BLOG}>
              <span className='text-secondary underline hover:text-primary'>
                {chunks}
              </span>
            </Link>
          ),
          projects: chunks => (
            <Link href={Paths.LAB}>
              <span className='text-secondary underline hover:text-primary'>
                {chunks}
              </span>
            </Link>
          ),
        })}
      </p>
      <p className='text-large mt-medium mb-medium'>{t('articles')}</p>
      <Cards articles={pinnedArticles} />
    </div>
  )
}

export default NotFound
