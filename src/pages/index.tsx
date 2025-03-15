import Layout from '@/layout'
import { getLangProps } from '@/utils/getLangProps'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'

const Home = () => {
  const { t, i18n } = useTranslation('common')

  console.debug('Idioma atual:', i18n.language)
  console.debug('Namespaces carregados:', i18n.reportNamespaces)
  console.debug('Tradução de greeting:', t('greeting'))

  return (
    <>
      <Head>
        <title>Gabriel Duete</title>
        <meta name='description' content='My blog xd' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Layout>
        <h1>{t('greeting')}</h1>
      </Layout>
    </>
  )
}

export const getStaticProps = getLangProps(['common'])

export default Home
