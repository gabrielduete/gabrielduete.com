import { getLangProps } from '@/utils/getLangProps'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'

const Home = () => {
  const { t } = useTranslation('common')

  return (
    <>
      <Head>
        <title>Gabriel Duete</title>
        <meta name='description' content='My blog xd' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <h1>{t('greeting')}</h1>
    </>
  )
}

export const getStaticProps = getLangProps(['common'])

export default Home
