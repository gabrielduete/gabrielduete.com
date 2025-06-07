import { getTranslations } from 'next-intl/server'

const Home = async () => {
  const t = await getTranslations('IndexPage')

  return (
    <section className='w-full h-52 bg-bg-cards rounded-sm text-white'>
      <h1>{t('title')}</h1>
    </section>
  )
}

export default Home
