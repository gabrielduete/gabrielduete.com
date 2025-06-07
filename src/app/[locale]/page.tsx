import { getTranslations } from 'next-intl/server'

const Home = async () => {
  const t = await getTranslations('IndexPage')

  return (
    <section className='w-full bg-bg-cards rounded-sm text-white p-xxxlarge mt-giant'>
      <img />
      <div>
        <h1 className='text-xlarge font-bold'>Gabriel Duete</h1>
        <h2 className='text-medium whitespace-pre-line leading-[160%] mt-xsmall mb-large'>
          {t('about')}
        </h2>
      </div>
    </section>
  )
}

export default Home
