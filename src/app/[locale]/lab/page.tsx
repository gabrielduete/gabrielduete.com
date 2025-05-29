import { getTranslations } from 'next-intl/server'

const Lab = async () => {
  const t = await getTranslations('IndexPage')

  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  )
}

export default Lab
