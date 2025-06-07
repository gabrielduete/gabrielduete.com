import ProfilePic from '@/public/assets/images/profile-pic.png'
import { getTranslations } from 'next-intl/server'
import Image from 'next/image'

const Home = async () => {
  const t = await getTranslations('IndexPage')

  return (
    <section className='w-full bg-bg-cards rounded-sm text-white p-xxxlarge mt-giant flex gap-xxlarge'>
      <Image
        src={ProfilePic}
        alt='Profile Pic'
        className='max-w-[148px] max-h-[148px] rounded-sm'
      />
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
